import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    discount: 0,
    shippingFee: 0,
    totalAmount: 0,
    itemCount: 0,
    couponApplied: null
  });
  const [couponCode, setCouponCode] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Read guest cart from localStorage
  const getGuestCartItems = useCallback(() => {
    try {
      const stored = localStorage.getItem('ar_guest_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  const setGuestCartItems = useCallback((items) => {
    localStorage.setItem('ar_guest_cart', JSON.stringify(items));
  }, []);

  // Recalculate cart state with backend verification
  const refreshCart = useCallback(async (activeCoupon = couponCode) => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        const res = await api.get('/cart', { coupon: activeCoupon });
        if (res.success && res.data?.cart) {
          setCart(res.data.cart);
        }
      } else {
        const guestItems = getGuestCartItems();
        if (guestItems.length === 0) {
          setCart({
            items: [],
            subtotal: 0,
            discount: 0,
            shippingFee: 0,
            totalAmount: 0,
            itemCount: 0,
            couponApplied: null
          });
        } else {
          // Calculate verified quote on backend
          const res = await api.post('/cart/quote', {
            items: guestItems,
            couponCode: activeCoupon
          });
          if (res.success && res.data?.quote) {
            setCart(res.data.quote);
          }
        }
      }
    } catch (err) {
      console.error('[Cart] Refresh failed:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, couponCode, getGuestCartItems]);

  // Sync guest cart when user logs in
  useEffect(() => {
    const handleLoginSync = async () => {
      if (isAuthenticated) {
        const guestItems = getGuestCartItems();
        if (guestItems.length > 0) {
          try {
            await api.post('/cart/sync', { guestItems });
            localStorage.removeItem('ar_guest_cart');
            addToast('Your guest bag has been merged with your account.', 'info');
          } catch (e) {
            console.error('[Cart Sync Error]', e);
          }
        }
      }
      refreshCart();
    };

    handleLoginSync();
  }, [isAuthenticated]);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  const addToCart = async (product, quantity = 1, variant = null) => {
    const requestedQty = Number(quantity) || 1;

    try {
      if (isAuthenticated) {
        await api.post('/cart/items', {
          productId: product._id,
          variantSku: variant?.sku || '',
          color: variant?.color || '',
          size: variant?.size || '',
          quantity: requestedQty
        });
        await refreshCart();
      } else {
        const guestItems = getGuestCartItems();
        const existingIdx = guestItems.findIndex(
          (i) => i.productId === product._id && (i.variantSku || '') === (variant?.sku || '')
        );

        if (existingIdx > -1) {
          guestItems[existingIdx].quantity += requestedQty;
        } else {
          guestItems.push({
            productId: product._id,
            variantSku: variant?.sku || '',
            color: variant?.color || '',
            size: variant?.size || '',
            quantity: requestedQty
          });
        }
        setGuestCartItems(guestItems);
        await refreshCart();
      }

      addToast(`Added "${product.name}" to your shopping bag.`, 'success');
      openDrawer();
      return true;
    } catch (err) {
      const msg = err.data?.message || err.message || 'Could not add product to bag.';
      addToast(msg, 'error');
      return false;
    }
  };

  const updateQuantity = async (itemIdOrSku, newQuantity, productId) => {
    if (newQuantity <= 0) {
      return removeFromCart(itemIdOrSku, productId);
    }

    try {
      if (isAuthenticated) {
        await api.put(`/cart/items/${itemIdOrSku}`, { quantity: newQuantity });
        await refreshCart();
      } else {
        const guestItems = getGuestCartItems();
        const item = guestItems.find(
          (i) => i.productId === productId && (i.variantSku || '') === (itemIdOrSku || '')
        );
        if (item) {
          item.quantity = newQuantity;
          setGuestCartItems(guestItems);
          await refreshCart();
        }
      }
    } catch (err) {
      addToast(err.data?.message || err.message || 'Failed to update quantity.', 'error');
    }
  };

  const removeFromCart = async (itemIdOrSku, productId) => {
    try {
      if (isAuthenticated) {
        await api.delete(`/cart/items/${itemIdOrSku}`);
        await refreshCart();
      } else {
        let guestItems = getGuestCartItems();
        guestItems = guestItems.filter(
          (i) => !(i.productId === productId && (i.variantSku || '') === (itemIdOrSku || ''))
        );
        setGuestCartItems(guestItems);
        await refreshCart();
      }
      addToast('Item removed from bag.', 'info');
    } catch (err) {
      addToast(err.data?.message || err.message || 'Failed to remove item.', 'error');
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await api.delete('/cart/clear');
      } else {
        localStorage.removeItem('ar_guest_cart');
      }
      await refreshCart();
    } catch (err) {
      console.error(err);
    }
  };

  const applyCoupon = async (code) => {
    if (!code) {
      setCouponCode('');
      await refreshCart('');
      return { success: true };
    }

    try {
      const res = await api.post('/coupons/validate', {
        code,
        subtotal: cart.subtotal
      });

      if (res.success) {
        setCouponCode(code);
        await refreshCart(code);
        addToast(`Promotional code "${code.toUpperCase()}" applied! Saved PKR ${Number(res.data?.discount || 0).toLocaleString()}`, 'success');
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      const msg = err.data?.message || err.message || 'Invalid coupon code.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount: cart.itemCount || 0,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        couponCode,
        loading,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

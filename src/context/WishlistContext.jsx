import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [wishlistItems, setWishlistItems] = useState([]);

  const loadWishlist = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const res = await api.get('/wishlist');
        if (res.success && res.data?.wishlist) {
          setWishlistItems(res.data.wishlist.products || []);
        }
      } catch (err) {
        console.error('[Wishlist Error]', err.message);
      }
    } else {
      try {
        const local = localStorage.getItem('ar_guest_wishlist');
        setWishlistItems(local ? JSON.parse(local) : []);
      } catch {
        setWishlistItems([]);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => (item._id || item) === productId);
  };

  const toggleWishlist = async (product) => {
    const prodId = product._id || product;
    const currentlyIn = isInWishlist(prodId);

    if (isAuthenticated) {
      try {
        const res = await api.post('/wishlist/toggle', { productId: prodId });
        if (res.success) {
          await loadWishlist();
          addToast(res.data.isAdded ? 'Added to your curated wishlist.' : 'Removed from wishlist.', 'info');
        }
      } catch (err) {
        addToast('Failed to update wishlist.', 'error');
      }
    } else {
      let updated;
      if (currentlyIn) {
        updated = wishlistItems.filter((item) => (item._id || item) !== prodId);
        addToast('Removed from wishlist.', 'info');
      } else {
        updated = [...wishlistItems, product];
        addToast('Added to your curated wishlist.', 'info');
      }
      setWishlistItems(updated);
      localStorage.setItem('ar_guest_wishlist', JSON.stringify(updated));
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        isInWishlist,
        toggleWishlist,
        refreshWishlist: loadWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

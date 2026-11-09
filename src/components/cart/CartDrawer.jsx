import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Button from '../common/Button';
import BackButton from '../common/BackButton';

const CartDrawer = () => {
  const {
    cart,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    couponCode
  } = useCart();

  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const handleCheckoutClick = () => {
    closeDrawer();
    navigate('/checkout');
  };

  return (
    <div className="overlay anim-fade-in" onClick={closeDrawer} style={{ zIndex: 'var(--z-drawer-backdrop)' }}>
      <div
        className="drawer anim-slide-right"
        onClick={(e) => e.stopPropagation()}
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-5)', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <ShoppingBag size={20} color="var(--color-accent)" />
            <h3 style={{ fontSize: 'var(--font-size-lg)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}>
              Shopping Bag ({cart.itemCount || 0})
            </h3>
          </div>
          <button className="btn-icon" onClick={closeDrawer} aria-label="Close Shopping Bag">
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div style={{ padding: 'var(--space-3) var(--space-5)', backgroundColor: 'var(--color-surface-subtle)', borderBottom: '1px solid var(--color-border)', fontSize: 'var(--font-size-xs)' }}>
          {Number(cart.subtotal || 0) >= 5000 ? (
            <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>
              &check; You qualify for Free Delivery across all of KPK!
            </span>
          ) : (
            <span>
              Add <strong>PKR {Math.max(0, 5000 - Number(cart.subtotal || 0)).toLocaleString()}</strong> more to unlock Free KPK Delivery.
            </span>
          )}
        </div>

        {/* Item List / Empty State */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: 'var(--space-5)' }}>
          {cart.items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-12) 0' }}>
              <ShoppingBag size={48} color="var(--color-border-dark)" style={{ margin: '0 auto var(--space-4)', opacity: 0.3 }} />
              <h4 style={{ marginBottom: 'var(--space-2)' }}>Your bag is empty</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-6)' }}>
                Explore our curated artisanal collections and add exquisite heirloom pieces.
              </p>
              <Button variant="primary" onClick={() => { closeDrawer(); navigate('/shop'); }}>
                Explore The Catalog
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {cart.items.map((item) => (
                <div
                  key={`${item.product}_${item.variantSku || ''}`}
                  style={{
                    display: 'flex',
                    gap: 'var(--space-3)',
                    paddingBottom: 'var(--space-4)',
                    borderBottom: '1px solid var(--color-border)'
                  }}
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=300&q=80'}
                    alt={item.name}
                    style={{ width: '70px', height: '90px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=300&q=80';
                    }}
                  />
                  <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '4px' }}>
                        {item.name}
                      </h4>
                      {(item.color || item.size) && (
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                          {item.color} {item.size ? `• Size: ${item.size}` : ''}
                        </p>
                      )}
                      <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '4px' }}>
                        PKR {Number(item.price || 0).toLocaleString()}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-2)' }}>
                      {/* Quantity Stepper */}
                      <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xs)' }}>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item._id || item.variantSku, item.quantity - 1, item.product)}
                          style={{ padding: '4px 8px', cursor: 'pointer' }}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ padding: '0 8px', fontSize: 'var(--font-size-xs)', fontWeight: 'bold' }}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item._id || item.variantSku, item.quantity + 1, item.product)}
                          style={{ padding: '4px 8px', cursor: 'pointer' }}
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item._id || item.variantSku, item.product)}
                        style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-xs)', display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Subtotals & Checkout CTA */}
        {cart.items.length > 0 && (
          <div style={{ padding: 'var(--space-5)', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: 'var(--font-size-sm)' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
              <span style={{ fontWeight: 'bold' }}>PKR {Number(cart.subtotal || 0).toLocaleString()}</span>
            </div>

            {cart.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: 'var(--font-size-sm)', color: 'var(--color-success)' }}>
                <span>Promotional Discount</span>
                <span>-PKR {Number(cart.discount || 0).toLocaleString()}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)', fontSize: 'var(--font-size-sm)' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>KPK Courier Delivery</span>
              <span>{cart.shippingFee === 0 ? <strong style={{ color: 'var(--color-success)' }}>FREE</strong> : `PKR ${Number(cart.shippingFee || 0).toLocaleString()}`}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-5)', paddingTop: 'var(--space-2)', borderTop: '1px dashed var(--color-border)', fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
              <span>Total Amount</span>
              <span style={{ color: 'var(--color-primary)' }}>PKR {Number(cart.totalAmount || 0).toLocaleString()}</span>
            </div>

            <Button
              variant="accent"
              fullWidth
              size="lg"
              onClick={handleCheckoutClick}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}
            >
              Proceed To Checkout <ArrowRight size={18} />
            </Button>

            <BackButton
              onClick={closeDrawer}
              label="Continue Shopping"
              variant="outline"
              style={{ width: '100%', justifyContent: 'center' }}
            />

            <p style={{ textAlign: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-3)' }}>
              Cash on Delivery (COD) across all KPK &bull; 100% Amanat Guarantee
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;

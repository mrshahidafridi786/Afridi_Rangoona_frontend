import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';

const CartPage = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    couponCode
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState(couponCode || '');
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    setCouponLoading(true);
    await applyCoupon(inputCoupon.trim());
    setCouponLoading(false);
  };

  return (
    <div className="section-spacing-sm">
      <div className="container">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <BackButton to="/shop" label="Continue Shopping" style={{ marginBottom: 'var(--space-3)' }} />
          <span className="eyebrow">Hujra Bag</span>
          <h2>Your Selected Creations ({cart.itemCount || 0})</h2>
        </div>

        {cart.items.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
            <ShoppingBag size={56} color="var(--color-gold)" style={{ margin: '0 auto var(--space-4)', opacity: 0.4 }} />
            <h3>Your Bag is Empty</h3>
            <p style={{ color: 'var(--color-text-muted)', margin: 'var(--space-3) 0 var(--space-6)' }}>
              Explore authentic Swati shawls, Peshawari Kaptaan chappals, and traditional KPK kurtas.
            </p>
            <Link to="/shop">
              <Button variant="primary">Explore The Creations</Button>
            </Link>
          </div>
        ) : (
          <div className="cart-layout-grid">
            
            {/* Left: Cart Items Table / Cards */}
            <div>
              <div className="card" style={{ padding: 'clamp(var(--space-4), 3vw, var(--space-6))' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                  {cart.items.map((item) => (
                    <div
                      key={`${item.product}_${item.variantSku || ''}`}
                      style={{
                        display: 'flex',
                        gap: 'var(--space-4)',
                        paddingBottom: 'var(--space-6)',
                        borderBottom: '1px solid var(--color-border)',
                        flexWrap: 'wrap'
                      }}
                    >
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=300&q=80'}
                        alt={item.name}
                        style={{ width: '90px', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=300&q=80';
                        }}
                      />

                      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div className="flex-between">
                            <Link to={`/product/${item.slug}`} style={{ fontWeight: 'bold', fontSize: 'var(--font-size-base)', fontFamily: 'var(--font-display)' }}>
                              {item.name}
                            </Link>
                            <span style={{ fontWeight: 'bold', fontSize: 'var(--font-size-base)' }}>
                              PKR {Number(item.subtotal || 0).toLocaleString()}
                            </span>
                          </div>

                          {(item.color || item.size) && (
                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                              {item.color} {item.size ? `• Size: ${item.size}` : ''}
                            </p>
                          )}

                          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                            PKR {Number(item.price || 0).toLocaleString()} each
                          </p>
                        </div>

                        <div className="flex-between" style={{ marginTop: 'var(--space-4)' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xs)' }}>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item._id || item.variantSku, item.quantity - 1, item.product)}
                              style={{ padding: '6px 12px', cursor: 'pointer' }}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span style={{ padding: '0 12px', fontWeight: 'bold', fontSize: 'var(--font-size-sm)' }}>
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item._id || item.variantSku, item.quantity + 1, item.product)}
                              style={{ padding: '6px 12px', cursor: 'pointer' }}
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item._id || item.variantSku, item.product)}
                            style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-xs)', display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                          >
                            <Trash2 size={14} /> Remove Item
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-6)' }}>
                  <Link to="/shop" style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                    &larr; Continue Shopping
                  </Link>
                  <button
                    type="button"
                    onClick={clearCart}
                    style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)', cursor: 'pointer' }}
                  >
                    Clear Entire Bag
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Order Summary Card */}
            <div>
              <div className="card" style={{ padding: 'var(--space-6)', position: 'sticky', top: '100px' }}>
                <h3 style={{ fontSize: 'var(--font-size-base)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-4)' }}>
                  Order Summary
                </h3>

                {/* Promotional Coupon Input */}
                <form onSubmit={handleCouponSubmit} style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
                  <input
                    type="text"
                    placeholder="Coupon (e.g. WELCOME10)"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    className="form-input"
                    style={{ padding: '8px 12px', fontSize: 'var(--font-size-xs)' }}
                  />
                  <Button type="submit" variant="primary" size="sm" loading={couponLoading}>
                    Apply
                  </Button>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--font-size-sm)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
                  <div className="flex-between">
                    <span style={{ color: 'var(--color-text-secondary)' }}>Bag Subtotal</span>
                    <span style={{ fontWeight: 'bold' }}>PKR {Number(cart.subtotal || 0).toLocaleString()}</span>
                  </div>

                  {cart.discount > 0 && (
                    <div className="flex-between" style={{ color: 'var(--color-success)' }}>
                      <span>Promotional Discount ({cart.couponApplied})</span>
                      <span>-PKR {Number(cart.discount || 0).toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex-between">
                    <span style={{ color: 'var(--color-text-secondary)' }}>KPK Courier Delivery</span>
                    <span>
                      {cart.shippingFee === 0 ? (
                        <strong style={{ color: 'var(--color-success)' }}>FREE</strong>
                      ) : (
                        `PKR ${Number(cart.shippingFee || 0).toLocaleString()}`
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex-between" style={{ padding: 'var(--space-4) 0', fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
                  <span>Total Amount</span>
                  <span style={{ color: 'var(--color-primary)' }}>PKR {Number(cart.totalAmount || 0).toLocaleString()}</span>
                </div>

                <Button
                  variant="accent"
                  size="lg"
                  fullWidth
                  onClick={() => navigate('/checkout')}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  Proceed To Checkout <ArrowRight size={18} />
                </Button>

                <div style={{ marginTop: 'var(--space-4)', textAlign: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                  Cash on Delivery (COD) across KPK &bull; 100% Amanat &amp; Satisfaction Guarantee
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

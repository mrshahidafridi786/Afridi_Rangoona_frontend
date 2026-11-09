import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';

const Checkout = () => {
  const { user, isAuthenticated } = useAuth();
  const { cart, refreshCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Shipping Details, 2: Payment & Review
  const defaultAddress = user?.addresses?.[0] || {};

  const [formData, setFormData] = useState({
    recipientName: defaultAddress.recipientName || user?.name || '',
    email: user?.email || '',
    phone: defaultAddress.phone || user?.phone || '',
    street: defaultAddress.street || '',
    city: defaultAddress.city || 'Peshawar',
    state: defaultAddress.state || 'KPK',
    postalCode: defaultAddress.postalCode || '25000',
    country: defaultAddress.country || 'Pakistan',
    paymentMethod: 'sandbox' // 'stripe' | 'safepay' | 'sandbox'
  });

  const [providers, setProviders] = useState({});
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    api.get('/payments/providers')
      .then((res) => {
        if (res.success) setProviders(res.data || {});
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingProviders(false));
  }, []);

  if (cart.items.length === 0) {
    return (
      <div className="section-spacing container" style={{ textAlign: 'center' }}>
        <h2>Your Bag is Empty</h2>
        <p style={{ margin: 'var(--space-4) 0' }}>Please select items before proceeding to checkout.</p>
        <Link to="/shop" className="btn btn-primary">
          Browse Collections
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    const errors = {};
    if (!formData.recipientName.trim()) errors.recipientName = 'Recipient name is required.';
    if (!formData.email.trim()) errors.email = 'Valid email is required.';
    if (!formData.phone.trim()) errors.phone = 'Contact phone number is required.';
    if (!formData.street.trim()) errors.street = 'Street address is required.';
    if (!formData.city.trim()) errors.city = 'City is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlaceOrder = async () => {
    setSubmittingOrder(true);
    try {
      // 1. Create order on backend (strictly verified prices)
      const orderPayload = {
        items: cart.items.map((i) => ({
          productId: i.product?._id || i.product || i.productId,
          variantSku: i.variantSku || '',
          quantity: i.quantity
        })),
        shippingAddress: {
          recipientName: formData.recipientName,
          phone: formData.phone,
          email: formData.email,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        },
        couponCode: cart.couponApplied,
        paymentMethod: formData.paymentMethod
      };

      const res = await api.post('/orders', orderPayload);
      if (!res.success) {
        throw new Error(res.message || 'Failed to place order.');
      }

      const order = res.data.order;

      // 2. Initialize Payment Gateway Adapter session
      const payRes = await api.post('/payments/create-session', {
        orderId: order._id,
        provider: formData.paymentMethod
      });

      if (payRes.success && payRes.data?.checkoutUrl) {
        // Redirect to payment result or provider checkout
        window.location.href = payRes.data.checkoutUrl;
      } else {
        // Fallback directly to confirmation if immediate test
        navigate(`/order-confirmation/${order.orderNumber}`);
      }
    } catch (err) {
      addToast(err.data?.message || err.message || 'Could not process order.', 'error');
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div className="section-spacing-sm" style={{ backgroundColor: 'var(--color-surface-subtle)', minHeight: '90vh' }}>
      <div className="container">
        {/* Top Back Navigation */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <BackButton to="/cart" label="Back to Shopping Bag" />
        </div>

        {/* Step Indicator */}
        <div style={{ maxWidth: '480px', margin: '0 auto var(--space-8)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', color: step === 1 ? 'var(--color-primary)' : 'var(--color-success)' }}>
            <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: step === 1 ? 'var(--color-primary)' : 'var(--color-success)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              1
            </span>
            Shipping Information
          </div>
          <span style={{ color: 'var(--color-border-dark)' }}>&bull;&bull;&bull;</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', color: step === 2 ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
            <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: step === 2 ? 'var(--color-primary)' : '#DDD', color: step === 2 ? '#FFF' : '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              2
            </span>
            Payment &amp; Review
          </div>
        </div>

        {/* 2-Column Responsive Checkout Layout */}
        <div className="checkout-layout-grid">
          
          {/* Left Column: Form Steps */}
          <div>
            {step === 1 ? (
              <form onSubmit={handleProceedToPayment} className="card" style={{ padding: 'clamp(var(--space-4), 3vw, var(--space-8))' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                  <Truck size={22} color="var(--color-accent)" />
                  <h3 style={{ fontSize: 'var(--font-size-lg)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Recipient &amp; Delivery Destination
                  </h3>
                </div>

                <div className="grid-2">
                  <Input
                    label="Recipient Full Name"
                    name="recipientName"
                    required
                    value={formData.recipientName}
                    onChange={handleChange}
                    error={formErrors.recipientName}
                  />
                  <Input
                    label="Email for Order Notifications"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    error={formErrors.email}
                  />
                </div>

                <Input
                  label="Contact Phone (For Courier Dispatch)"
                  type="tel"
                  name="phone"
                  required
                  placeholder="+92 300 1234567"
                  value={formData.phone}
                  onChange={handleChange}
                  error={formErrors.phone}
                />

                <Input
                  label="Street Address / Residence / Landmark"
                  name="street"
                  required
                  placeholder="e.g. House 42, Khyber Road, Cantt"
                  value={formData.street}
                  onChange={handleChange}
                  error={formErrors.street}
                />

                <div className="grid-3">
                  <Input
                    label="City"
                    name="city"
                    required
                    placeholder="e.g. Peshawar, Mardan, Swat, Kohat"
                    value={formData.city}
                    onChange={handleChange}
                    error={formErrors.city}
                  />
                  <Input
                    label="Province / Region"
                    name="state"
                    placeholder="Khyber Pakhtunkhwa (KPK)"
                    value={formData.state}
                    onChange={handleChange}
                  />
                  <Input
                    label="Postal Code"
                    name="postalCode"
                    placeholder="25000"
                    value={formData.postalCode}
                    onChange={handleChange}
                  />
                </div>

                <Input
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  disabled
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
                  <Button type="submit" variant="primary" size="lg">
                    Continue To Payment &rarr;
                  </Button>
                </div>
              </form>
            ) : (
              <div className="card" style={{ padding: 'var(--space-8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                  <CreditCard size={22} color="var(--color-accent)" />
                  <h3 style={{ fontSize: 'var(--font-size-lg)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Select Payment Gateway
                  </h3>
                </div>

                {/* Shipping Confirmation Mini-Card */}
                <div style={{ backgroundColor: 'var(--color-surface-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-4)', marginBottom: 'var(--space-6)', fontSize: 'var(--font-size-xs)' }}>
                  <div className="flex-between" style={{ marginBottom: '4px' }}>
                    <strong>Delivering To:</strong>
                    <button type="button" onClick={() => setStep(1)} style={{ color: 'var(--color-accent)', cursor: 'pointer', textDecoration: 'underline' }}>
                      Edit Address
                    </button>
                  </div>
                  <p>{formData.recipientName} ({formData.phone})</p>
                  <p>{formData.street}, {formData.city}, {formData.country}</p>
                </div>

                {/* Gateway Selection Radios */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                  
                  {/* Option 1: Sandbox Simulator */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--space-4)',
                      border: formData.paymentMethod === 'sandbox' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      backgroundColor: formData.paymentMethod === 'sandbox' ? 'var(--color-surface-subtle)' : 'var(--color-surface)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="sandbox"
                        checked={formData.paymentMethod === 'sandbox'}
                        onChange={handleChange}
                      />
                      <div>
                        <strong style={{ fontSize: 'var(--font-size-sm)', display: 'block' }}>Cash on Delivery (COD across KPK)</strong>
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                          Pay cash to the rider at your doorstep anywhere in Khyber Pakhtunkhwa.
                        </span>
                      </div>
                    </div>
                    <span className="badge badge-confirmed">RECOMMENDED (KPK)</span>
                  </label>

                  {/* Option 2: Stripe Test Mode */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--space-4)',
                      border: formData.paymentMethod === 'stripe' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      backgroundColor: formData.paymentMethod === 'stripe' ? 'var(--color-surface-subtle)' : 'var(--color-surface)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="stripe"
                        checked={formData.paymentMethod === 'stripe'}
                        onChange={handleChange}
                      />
                      <div>
                        <strong style={{ fontSize: 'var(--font-size-sm)', display: 'block' }}>Stripe Test Mode</strong>
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                          Visa, Mastercard, American Express with test keys.
                        </span>
                      </div>
                    </div>
                    <span className="badge badge-pending">
                      {providers.stripe?.enabled ? 'CONFIGURED' : 'ADAPTER READY'}
                    </span>
                  </label>

                  {/* Option 3: Safepay Sandbox */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--space-4)',
                      border: formData.paymentMethod === 'safepay' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      backgroundColor: formData.paymentMethod === 'safepay' ? 'var(--color-surface-subtle)' : 'var(--color-surface)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="safepay"
                        checked={formData.paymentMethod === 'safepay'}
                        onChange={handleChange}
                      />
                      <div>
                        <strong style={{ fontSize: 'var(--font-size-sm)', display: 'block' }}>Safepay Sandbox</strong>
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                          Regional sandbox adapter for local merchant processing.
                        </span>
                      </div>
                    </div>
                    <span className="badge badge-pending">
                      {providers.safepay?.enabled ? 'CONFIGURED' : 'ADAPTER READY'}
                    </span>
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-8)' }}>
                  <BackButton
                    onClick={() => {
                      setStep(1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    label="Back to Shipping Details"
                    variant="button"
                  />
                  <Button
                    type="button"
                    variant="accent"
                    size="lg"
                    loading={submittingOrder}
                    onClick={handlePlaceOrder}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Lock size={16} /> Place Order &bull; PKR {Number(cart.totalAmount || 0).toLocaleString()}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Items Snapshot & Totals */}
          <div>
            <div className="card" style={{ padding: 'var(--space-6)' }}>
              <h4 style={{ fontSize: 'var(--font-size-sm)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-border)' }}>
                Order Items ({cart.itemCount})
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxHeight: '280px', overflowY: 'auto', marginBottom: 'var(--space-4)' }}>
                {cart.items.map((i) => (
                  <div key={`${i.product}_${i.variantSku}`} style={{ display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--font-size-xs)' }}>
                    <img
                      src={i.image || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=300&q=80'}
                      alt=""
                      style={{ width: '48px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=300&q=80';
                      }}
                    />
                    <div style={{ flexGrow: 1 }}>
                      <p style={{ fontWeight: 'bold' }}>{i.name}</p>
                      <p style={{ color: 'var(--color-text-muted)' }}>Qty: {i.quantity} &bull; PKR {Number(i.price || 0).toLocaleString()}</p>
                    </div>
                    <span style={{ fontWeight: 'bold' }}>PKR {Number(i.subtotal || 0).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--font-size-xs)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border)' }}>
                <div className="flex-between">
                  <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
                  <span>PKR {Number(cart.subtotal || 0).toLocaleString()}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex-between" style={{ color: 'var(--color-success)' }}>
                    <span>Discount</span>
                    <span>-PKR {Number(cart.discount || 0).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex-between">
                  <span style={{ color: 'var(--color-text-secondary)' }}>Shipping</span>
                  <span>{cart.shippingFee === 0 ? 'FREE' : `PKR ${Number(cart.shippingFee || 0).toLocaleString()}`}</span>
                </div>
                <div className="flex-between" style={{ paddingTop: 'var(--space-3)', borderTop: '1px dashed var(--color-border)', fontSize: 'var(--font-size-base)', fontWeight: 'bold' }}>
                  <span>Grand Total</span>
                  <span style={{ color: 'var(--color-primary)' }}>PKR {Number(cart.totalAmount || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

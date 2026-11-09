import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight, Clock } from 'lucide-react';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const orderNumber = searchParams.get('order');
  const mode = searchParams.get('mode') || 'sandbox';

  const { refreshCart } = useCart();
  const [verifying, setVerifying] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyTransaction = async () => {
      if (!orderNumber || !sessionId) {
        setVerifying(false);
        setErrorMessage('Missing order identification or transaction session ID.');
        return;
      }

      try {
        const res = await api.post('/payments/verify', {
          orderNumber,
          referenceId: sessionId,
          provider: mode
        });

        if (res.success && res.data?.verified) {
          setPaymentSuccess(true);
          setOrderDetails(res.data.order);
          await refreshCart();
        } else {
          setPaymentSuccess(false);
          setErrorMessage('Payment verification is currently pending or was cancelled.');
        }
      } catch (err) {
        console.error('[Payment Verification Error]', err);
        setErrorMessage(err.data?.message || err.message || 'Verification could not be finalized.');
      } finally {
        setVerifying(false);
      }
    };

    verifyTransaction();
  }, [sessionId, orderNumber, mode, refreshCart]);

  return (
    <div className="section-spacing" style={{ backgroundColor: 'var(--color-surface-subtle)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container container-narrow" style={{ maxWidth: '580px' }}>
        <div className="card anim-slide-up" style={{ padding: 'var(--space-10)', textAlign: 'center' }}>
          <div style={{ textAlign: 'left', marginBottom: 'var(--space-4)' }}>
            <BackButton to="/orders" label="Back to My Orders" />
          </div>
          
          {verifying ? (
            <div>
              <Clock size={52} color="var(--color-gold)" style={{ margin: '0 auto var(--space-4)', animation: 'pulse 1.5s infinite' }} />
              <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-2)' }}>Verifying Payment</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                Connecting to payment provider to confirm transaction clearance...
              </p>
            </div>
          ) : paymentSuccess ? (
            <div>
              <CheckCircle2 size={56} color="var(--color-success)" style={{ margin: '0 auto var(--space-4)' }} />
              <span className="eyebrow" style={{ color: 'var(--color-success)' }}>Transaction Confirmed</span>
              <h2 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--space-2)' }}>Payment Successful!</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-6)' }}>
                Your order <strong>{orderNumber}</strong> has been confirmed and transferred to the AFRIDI RANGOONA master ateliers for fulfillment.
              </p>

              <div style={{ backgroundColor: 'var(--color-surface-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-4)', textAlign: 'left', marginBottom: 'var(--space-6)', fontSize: 'var(--font-size-xs)' }}>
                <div className="flex-between" style={{ marginBottom: '6px' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Order Reference:</span>
                  <strong>{orderNumber}</strong>
                </div>
                <div className="flex-between" style={{ marginBottom: '6px' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Gateway Reference:</span>
                  <code>{sessionId}</code>
                </div>
                <div className="flex-between">
                  <span style={{ color: 'var(--color-text-muted)' }}>Payment Status:</span>
                  <strong style={{ color: 'var(--color-success)' }}>PAID &amp; CONFIRMED</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
                <Link to={`/order-confirmation/${orderNumber}`}>
                  <Button variant="primary">
                    View Order Receipt <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link to="/orders">
                  <Button variant="outline">My Orders</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <XCircle size={56} color="var(--color-danger)" style={{ margin: '0 auto var(--space-4)' }} />
              <span className="eyebrow" style={{ color: 'var(--color-danger)' }}>Payment Notice</span>
              <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-2)' }}>Payment Unsuccessful</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-6)' }}>
                {errorMessage || 'The payment could not be validated. No charges were made to your account.'}
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
                <Link to="/checkout">
                  <Button variant="primary">Return to Checkout</Button>
                </Link>
                <Link to="/contact">
                  <Button variant="ghost">Contact Support</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;

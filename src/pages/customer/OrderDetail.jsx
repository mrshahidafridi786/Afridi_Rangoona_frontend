import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Truck, CheckCircle2, Clock, XCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';

const STATUS_STEPS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

const OrderDetail = () => {
  const { id } = useParams();
  const { addToast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      if (res.success && res.data?.order) {
        setOrder(res.data.order);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      const res = await api.put(`/orders/${id}/cancel`, { reason: cancelReason });
      if (res.success) {
        addToast('Order has been cancelled and stock restored.', 'info');
        setOrder(res.data.order);
        setCancelModalOpen(false);
      }
    } catch (err) {
      addToast(err.data?.message || err.message || 'Failed to cancel order.', 'error');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="section-spacing container" style={{ textAlign: 'center' }}>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="section-spacing container" style={{ textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <p style={{ margin: 'var(--space-4) 0' }}>The requested order record does not exist or you lack authorization.</p>
        <Link to="/orders" className="btn btn-primary">
          Return to My Orders
        </Link>
      </div>
    );
  }

  const currentStepIdx = STATUS_STEPS.indexOf(order.orderStatus);
  const canCancel = ['Pending', 'Confirmed'].includes(order.orderStatus);

  return (
    <div className="section-spacing-sm">
      <div className="container container-narrow" style={{ maxWidth: '840px' }}>
        
        {/* Back navigation */}
        <BackButton to="/orders" label="Back to My Orders" style={{ marginBottom: 'var(--space-4)' }} />

        {/* Title Header */}
        <div className="flex-between" style={{ marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <span className="eyebrow">Order Inspection</span>
            <h2>Order {order.orderNumber}</h2>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Commissioned on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <Badge status={order.orderStatus}>{order.orderStatus}</Badge>
            {canCancel && (
              <button
                type="button"
                onClick={() => setCancelModalOpen(true)}
                className="btn btn-outline btn-sm"
                style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>

        {/* Status Stepper Progression */}
        {order.orderStatus !== 'Cancelled' ? (
          <div className="card" style={{ padding: 'clamp(var(--space-4), 3vw, var(--space-6))', marginBottom: 'var(--space-8)' }}>
            <h4 style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-6)' }}>
              Fulfillment Journey
            </h4>
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 'var(--space-2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', minWidth: '440px' }}>
                {/* Connecting line */}
                <div style={{ position: 'absolute', top: '14px', left: '20px', right: '20px', height: '2px', backgroundColor: 'var(--color-border)', zIndex: 1 }} />
              
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;
                return (
                  <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        backgroundColor: isPassed ? 'var(--color-primary)' : '#E0DCD3',
                        color: isPassed ? 'var(--color-gold)' : '#888',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        marginBottom: 'var(--space-2)'
                      }}
                    >
                      {isPassed ? '✓' : idx + 1}
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: isCurrent ? 'bold' : 'normal', color: isPassed ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
            </div>

            {order.trackingNumber && (
              <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-3)', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-xs)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={16} color="var(--color-accent)" />
                <span>Courier Waybill Tracking: <strong>{order.trackingNumber}</strong></span>
              </div>
            )}
          </div>
        ) : (
          <div className="card" style={{ padding: 'var(--space-6)', backgroundColor: '#FDF2F2', borderColor: '#FCA5A5', marginBottom: 'var(--space-8)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <XCircle size={32} color="var(--color-danger)" />
            <div>
              <h4 style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-sm)' }}>Order Cancelled</h4>
              <p style={{ fontSize: 'var(--font-size-xs)', color: '#7F1D1D' }}>
                Reason: {order.cancelReason || 'Cancelled by customer'}
              </p>
            </div>
          </div>
        )}

        {/* Items Card */}
        <div className="card" style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-8)' }}>
          <h3 style={{ fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-border)' }}>
            Commissioned Items ({order.items.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=300&q=80'}
                  alt=""
                  style={{ width: '64px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=300&q=80';
                  }}
                />
                <div style={{ flexGrow: 1 }}>
                  <Link to={`/product/${item.product}`} style={{ fontWeight: 'bold', fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)' }}>
                    {item.name}
                  </Link>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {item.color} {item.size ? `• Size: ${item.size}` : ''} • Qty: {item.quantity}
                  </p>

                  {/* Review Button if Delivered */}
                  {order.orderStatus === 'Delivered' && (
                    <Link
                      to={`/product/${item.product}`}
                      style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 'bold', textDecoration: 'underline', display: 'inline-block', marginTop: '4px' }}
                    >
                      Write Verified Purchase Review &rarr;
                    </Link>
                  )}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 'bold', fontSize: 'var(--font-size-sm)' }}>
                    PKR {Number(item.subtotal || 0).toLocaleString()}
                  </p>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    PKR {Number(item.price || 0).toLocaleString()} each
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', fontSize: 'var(--font-size-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <div className="flex-between">
              <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
              <span>PKR {Number(order.subtotal || 0).toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex-between" style={{ color: 'var(--color-success)' }}>
                <span>Discount ({order.couponApplied})</span>
                <span>-PKR {Number(order.discount || 0).toLocaleString()}</span>
              </div>
            )}
            <div className="flex-between">
              <span style={{ color: 'var(--color-text-secondary)' }}>Insured Courier</span>
              <span>{order.shippingFee === 0 ? 'FREE' : `PKR ${Number(order.shippingFee || 0).toLocaleString()}`}</span>
            </div>
            <div className="flex-between" style={{ borderTop: '1px dashed var(--color-border)', paddingTop: 'var(--space-3)', fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
              <span>Total Amount</span>
              <span>PKR {Number(order.totalAmount || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Meta Grid */}
        <div className="grid-2">
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h4 style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-3)' }}>
              Shipping Address
            </h4>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              <p style={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{order.shippingAddress.recipientName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
              <p>Contact: {order.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h4 style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-3)' }}>
              Payment Ledger
            </h4>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div className="flex-between">
                <span>Method:</span>
                <strong>{order.paymentMethod}</strong>
              </div>
              <div className="flex-between">
                <span>Status:</span>
                <strong style={{ color: order.paymentStatus === 'Paid' ? 'var(--color-success)' : 'var(--color-warning)' }}>
                  {order.paymentStatus}
                </strong>
              </div>
              {order.paymentReference && (
                <div className="flex-between">
                  <span>Reference:</span>
                  <code>{order.paymentReference}</code>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Dialog Modal */}
      {cancelModalOpen && (
        <div className="overlay anim-fade-in" onClick={() => setCancelModalOpen(false)}>
          <div className="card anim-slide-up" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', width: '90%', margin: '15vh auto', padding: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>Cancel Order</h3>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
              Are you sure you wish to cancel order <strong>{order.orderNumber}</strong>? Reserved inventory will be returned to the catalog immediately.
            </p>

            <div className="form-group">
              <label className="form-label">Reason for cancellation (optional)</label>
              <input
                type="text"
                placeholder="e.g. Ordered incorrect size, changed mind"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
              <button type="button" onClick={() => setCancelModalOpen(false)} className="btn btn-ghost">
                Keep Order
              </button>
              <Button variant="accent" loading={cancelling} onClick={handleCancelOrder}>
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;

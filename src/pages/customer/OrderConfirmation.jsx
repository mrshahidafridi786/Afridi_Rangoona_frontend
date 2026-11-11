import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, ArrowRight, Printer } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';

const OrderConfirmation = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Look up directly by order number or via my-orders
    api.get(`/orders/${orderNumber}`)
      .then((res) => {
        if (res.success && res.data?.order) {
          setOrder(res.data.order);
        } else {
          return api.get('/orders/my-orders').then((mRes) => {
            if (mRes.success) {
              const match = mRes.data.orders?.find((o) => o.orderNumber === orderNumber);
              setOrder(match || null);
            }
          });
        }
      })
      .catch(() => {
        api.get('/orders/my-orders')
          .then((res) => {
            if (res.success) {
              const match = res.data.orders?.find((o) => o.orderNumber === orderNumber);
              setOrder(match || null);
            }
          })
          .catch((err) => console.error(err));
      })
      .finally(() => setLoading(false));
  }, [orderNumber]);

  return (
    <div className="section-spacing-sm">
      <div className="container container-narrow" style={{ maxWidth: '780px' }}>
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <BackButton to="/shop" label="Continue Exploring Catalog" />
        </div>
        
        {/* Success Header */}
        <div className="card anim-slide-up" style={{ textAlign: 'center', padding: 'clamp(var(--space-5), 4vw, var(--space-10))', marginBottom: 'var(--space-8)' }}>
          <CheckCircle size={60} color="var(--color-gold)" style={{ margin: '0 auto var(--space-4)' }} />
          <span className="eyebrow">Pakhair &bull; Order Confirmed</span>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, var(--font-size-3xl))', marginBottom: 'var(--space-2)' }}>
            Manana! Thank You For Your Trust
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-base)', maxWidth: '520px', margin: '0 auto var(--space-6)' }}>
            Your order has been safely placed under reference <strong>{orderNumber}</strong>. Our KPK team is preparing your package with genuine care and will dispatch it to your doorstep.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <Link to="/orders">
              <Button variant="primary">View In My Orders</Button>
            </Link>
            <button type="button" onClick={() => window.print()} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Printer size={16} /> Print Receipt
            </button>
          </div>
        </div>

        {/* Detailed Receipt Card if loaded */}
        {order && (
          <div className="card" style={{ padding: 'clamp(var(--space-4), 3vw, var(--space-8))' }}>
            <div className="flex-between" style={{ flexWrap: 'wrap', gap: 'var(--space-3)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--space-6)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-base)' }}>Order {order.orderNumber}</h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                  Placed on {new Date(order.createdAt).toLocaleDateString()} &bull; Payment Method: {order.paymentMethod}
                </p>
              </div>
              <Badge status={order.orderStatus}>{order.orderStatus}</Badge>
            </div>

            {/* Items Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
              {order.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=300&q=80'}
                    alt=""
                    style={{ width: '54px', height: '68px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=300&q=80';
                    }}
                  />
                  <div style={{ flexGrow: 1 }}>
                    <h5 style={{ fontSize: 'var(--font-size-sm)' }}>{item.name}</h5>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      {item.color} {item.size ? `• Size: ${item.size}` : ''} • Qty: {item.quantity}
                    </p>
                  </div>
                  <span style={{ fontWeight: 'bold', fontSize: 'var(--font-size-sm)' }}>
                    PKR {Number(item.subtotal || 0).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtotal & Breakdown */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', fontSize: 'var(--font-size-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <div className="flex-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
                <span>PKR {Number(order.subtotal || 0).toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex-between" style={{ color: 'var(--color-success)' }}>
                  <span>Discount Applied ({order.couponApplied})</span>
                  <span>-PKR {Number(order.discount || 0).toLocaleString()}</span>
                </div>
              )}
              <div className="flex-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>Insured Courier</span>
                <span>{order.shippingFee === 0 ? 'FREE' : `PKR ${Number(order.shippingFee || 0).toLocaleString()}`}</span>
              </div>
              <div className="flex-between" style={{ borderTop: '1px dashed var(--color-border)', paddingTop: 'var(--space-3)', fontWeight: 'bold', fontSize: 'var(--font-size-lg)' }}>
                <span>Total Paid</span>
                <span style={{ color: 'var(--color-primary)' }}>PKR {Number(order.totalAmount || 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Delivery Destination */}
            <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
              <h5 style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', marginBottom: '4px' }}>Shipping Address</h5>
              <p style={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{order.shippingAddress?.recipientName}</p>
              <p>{order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
              <p>Phone: {order.shippingAddress?.phone}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmation;

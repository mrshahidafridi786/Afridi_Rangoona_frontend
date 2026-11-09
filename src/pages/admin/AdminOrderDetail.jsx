import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Truck, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import BackButton from '../../components/common/BackButton';

const AdminOrderDetail = () => {
  const { id } = useParams();
  const { addToast } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then((res) => {
        if (res.success && res.data?.order) {
          const o = res.data.order;
          setOrder(o);
          setOrderStatus(o.orderStatus);
          setPaymentStatus(o.paymentStatus);
          setTrackingNumber(o.trackingNumber || '');
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put(`/admin/orders/${id}/status`, {
        orderStatus,
        paymentStatus,
        trackingNumber
      });

      if (res.success) {
        addToast('Order fulfillment parameters updated.', 'success');
        setOrder(res.data.order);
      }
    } catch (err) {
      addToast(err.data?.message || err.message || 'Failed to update order.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ color: '#FFF', padding: 'var(--space-8)' }}>Retrieving order ledger...</div>;
  }

  if (!order) {
    return <div style={{ color: '#FFF', padding: 'var(--space-8)' }}>Order record not found.</div>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <BackButton to="/admin/orders" label="Back to Orders Management" isDark style={{ marginBottom: 'var(--space-4)' }} />

      <div className="flex-between" style={{ marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <span className="eyebrow" style={{ color: 'var(--color-gold)' }}>Commission Ledger</span>
          <h1 style={{ color: '#FFF', fontSize: 'var(--font-size-3xl)' }}>Manage Order {order.orderNumber}</h1>
          <p style={{ color: '#888', fontSize: 'var(--font-size-xs)' }}>Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <Badge status={order.orderStatus}>{order.orderStatus}</Badge>
      </div>

      {/* Status Update Form */}
      <form onSubmit={handleUpdate} style={{ backgroundColor: '#212121', border: '1px solid #333', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <h3 style={{ color: '#FFF', fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-4)' }}>Fulfillment &amp; Payment Controls</h3>
        
        <div className="grid-3">
          <div className="form-group">
            <label className="form-label" style={{ color: '#CCC' }}>Order Status</label>
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="form-select"
              style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040' }}
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: '#CCC' }}>Payment Status</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="form-select"
              style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040' }}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: '#CCC' }}>Courier Tracking #</label>
            <input
              type="text"
              placeholder="e.g. TCS-99482019"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="form-input"
              style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
          <Button type="submit" variant="gold" loading={saving} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Save size={16} /> Save Status Changes
          </Button>
        </div>
      </form>

      {/* Snapshot Items List */}
      <div style={{ backgroundColor: '#212121', border: '1px solid #333', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <h3 style={{ color: '#FFF', fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid #333' }}>
          Historical Items Snapshot ({order.items.length})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {order.items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', borderBottom: '1px solid #2B2B2B', paddingBottom: 'var(--space-3)' }}>
              <img src={item.image} alt="" style={{ width: '50px', height: '64px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }} />
              <div style={{ flexGrow: 1, fontSize: 'var(--font-size-xs)' }}>
                <p style={{ fontWeight: 'bold', color: '#FFF' }}>{item.name}</p>
                <p style={{ color: '#888' }}>
                  {item.color} {item.size ? `• Size: ${item.size}` : ''} • SKU: {item.variantSku || 'Standard'}
                </p>
                <p style={{ color: '#AAA' }}>
                  Quantity: {item.quantity} &bull; PKR {item.price.toLocaleString()} each
                </p>
              </div>
              <span style={{ fontWeight: 'bold', color: '#FFF', fontSize: 'var(--font-size-sm)' }}>
                PKR {item.subtotal.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div style={{ paddingTop: 'var(--space-4)', fontSize: 'var(--font-size-xs)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', color: '#BBB' }}>
          <div className="flex-between">
            <span>Subtotal:</span>
            <span>PKR {order.subtotal.toLocaleString()}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex-between" style={{ color: '#4ADE80' }}>
              <span>Discount ({order.couponApplied}):</span>
              <span>-PKR {order.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex-between">
            <span>Shipping Fee:</span>
            <span>{order.shippingFee === 0 ? 'FREE' : `PKR ${order.shippingFee.toLocaleString()}`}</span>
          </div>
          <div className="flex-between" style={{ borderTop: '1px dashed #444', paddingTop: 'var(--space-2)', fontSize: 'var(--font-size-base)', fontWeight: 'bold', color: '#FFF' }}>
            <span>Final Cleared Total:</span>
            <span>PKR {order.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Recipient & Payment Ledger */}
      <div className="grid-2">
        <div style={{ backgroundColor: '#212121', border: '1px solid #333', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
          <h4 style={{ color: '#FFF', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', marginBottom: 'var(--space-3)' }}>
            Delivery Recipient
          </h4>
          <div style={{ fontSize: 'var(--font-size-xs)', color: '#AAA', lineHeight: 1.6 }}>
            <p style={{ fontWeight: 'bold', color: '#FFF' }}>{order.shippingAddress.recipientName}</p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
            <p>Phone: {order.shippingAddress.phone}</p>
            <p>Email: {order.shippingAddress.email}</p>
          </div>
        </div>

        <div style={{ backgroundColor: '#212121', border: '1px solid #333', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
          <h4 style={{ color: '#FFF', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', marginBottom: 'var(--space-3)' }}>
            Transaction Information
          </h4>
          <div style={{ fontSize: 'var(--font-size-xs)', color: '#AAA', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="flex-between">
              <span>Provider:</span>
              <strong style={{ color: '#FFF' }}>{order.paymentMethod}</strong>
            </div>
            <div className="flex-between">
              <span>Gateway Ref:</span>
              <code>{order.paymentReference || 'None'}</code>
            </div>
            <div className="flex-between">
              <span>Status:</span>
              <strong style={{ color: order.paymentStatus === 'Paid' ? '#4ADE80' : '#FBBF24' }}>
                {order.paymentStatus}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;

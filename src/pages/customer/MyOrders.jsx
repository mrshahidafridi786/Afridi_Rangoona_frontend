import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Eye, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my-orders')
      .then((res) => {
        if (res.success) setOrders(res.data.orders || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section-spacing-sm">
      <div className="container">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <BackButton to="/account" label="Back to My Account" style={{ marginBottom: 'var(--space-3)' }} />
          <span className="eyebrow">Patron Purchases</span>
          <h2>My Order History ({orders.length})</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
            Track your artisanal commissions, courier milestones, and past invoices.
          </p>
        </div>

        {loading ? (
          <div className="card skeleton" style={{ height: '300px' }} />
        ) : orders.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
            <Package size={52} color="var(--color-gold)" style={{ margin: '0 auto var(--space-4)', opacity: 0.5 }} />
            <h3>No Orders Placed Yet</h3>
            <p style={{ color: 'var(--color-text-muted)', margin: 'var(--space-3) 0 var(--space-6)' }}>
              Explore the AFRIDI RANGOONA catalog to acquire your first heirloom piece.
            </p>
            <Link to="/shop">
              <Button variant="primary">Explore Collections</Button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {orders.map((order) => (
              <div key={order._id} className="card" style={{ padding: 'var(--space-6)' }}>
                {/* Header Row */}
                <div className="flex-between" style={{ paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'bold' }}>
                      {order.orderNumber}
                    </h3>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      Commissioned on {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <Badge status={order.orderStatus}>{order.orderStatus}</Badge>
                    <Link to={`/order/${order._id}`} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Eye size={14} /> View Details
                    </Link>
                  </div>
                </div>

                {/* Items Preview */}
                <div style={{ padding: 'var(--space-4) 0', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'center' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=300&q=80'}
                        alt=""
                        style={{ width: '50px', height: '62px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                      <div style={{ fontSize: 'var(--font-size-xs)' }}>
                        <p style={{ fontWeight: 'bold' }}>{item.name}</p>
                        <p style={{ color: 'var(--color-text-muted)' }}>Qty: {item.quantity} &bull; PKR {Number(item.price || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Row */}
                <div className="flex-between" style={{ paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                  <div>
                    <span>Payment Status: </span>
                    <strong style={{ color: order.paymentStatus === 'Paid' ? 'var(--color-success)' : 'var(--color-warning)' }}>
                      {order.paymentStatus}
                    </strong>
                    {order.trackingNumber && (
                      <span style={{ marginLeft: '12px' }}>
                        Tracking: <strong>{order.trackingNumber}</strong>
                      </span>
                    )}
                  </div>
                  <div>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                      Total: PKR {Number(order.totalAmount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;

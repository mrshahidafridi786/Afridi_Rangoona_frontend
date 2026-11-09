import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, Package, Heart, Key, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import BackButton from '../../components/common/BackButton';

const MyAccount = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    api.get('/orders/my-orders')
      .then((res) => {
        if (res.success) setOrders(res.data.orders || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingOrders(false));
  }, []);

  if (!user) return null;

  return (
    <div className="section-spacing-sm">
      <div className="container">
        {/* Header Banner */}
        <div className="flex-between" style={{ marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <BackButton to="/shop" label="Continue Shopping" style={{ marginBottom: 'var(--space-3)' }} />
            <span className="eyebrow">Pakhair Raghlay &bull; Account Dashboard</span>
            <h2>Welcome, {user.name}</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              Member since {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <Link to="/edit-profile">
              <Button variant="outline" size="sm">
                Edit Personal Info
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout} style={{ color: 'var(--color-danger)' }}>
              <LogOut size={16} /> Sign Out
            </Button>
          </div>
        </div>

        {/* 3 Overview Info Cards */}
        <div className="grid-3" style={{ marginBottom: 'var(--space-10)' }}>
          {/* Card 1: Contact Details */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
              <User size={20} color="var(--color-accent)" />
              <h4 style={{ fontSize: 'var(--font-size-base)' }}>Patron Information</h4>
            </div>
            <p style={{ fontWeight: 'bold', fontSize: 'var(--font-size-sm)' }}>{user.name}</p>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>{user.email}</p>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', marginTop: '2px' }}>
              {user.phone || 'No phone registered'}
            </p>
            <Link to="/edit-profile" style={{ display: 'inline-block', marginTop: 'var(--space-4)', fontSize: 'var(--font-size-xs)', color: 'var(--color-accent)', fontWeight: 'bold' }}>
              Update Profile &rarr;
            </Link>
          </div>

          {/* Card 2: Saved Shipping Address */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
              <MapPin size={20} color="var(--color-accent)" />
              <h4 style={{ fontSize: 'var(--font-size-base)' }}>Primary Address</h4>
            </div>
            {user.addresses && user.addresses.length > 0 ? (
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                <p style={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{user.addresses[0].recipientName}</p>
                <p>{user.addresses[0].street}</p>
                <p>{user.addresses[0].city}, {user.addresses[0].postalCode}</p>
                <p>{user.addresses[0].country}</p>
                <p>Tel: {user.addresses[0].phone}</p>
              </div>
            ) : (
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                No shipping address saved yet.
              </p>
            )}
            <Link to="/edit-profile" style={{ display: 'inline-block', marginTop: 'var(--space-4)', fontSize: 'var(--font-size-xs)', color: 'var(--color-accent)', fontWeight: 'bold' }}>
              Manage Address Book &rarr;
            </Link>
          </div>

          {/* Card 3: Quick Navigation */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
              <Package size={20} color="var(--color-accent)" />
              <h4 style={{ fontSize: 'var(--font-size-base)' }}>Quick Access</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--font-size-xs)' }}>
              <Link to="/orders" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 0', borderBottom: '1px solid var(--color-border)' }}>
                <Package size={16} /> View Order History ({orders.length})
              </Link>
              <Link to="/wishlist" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 0', borderBottom: '1px solid var(--color-border)' }}>
                <Heart size={16} /> My Curated Wishlist
              </Link>
              <Link to="/edit-profile" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 0' }}>
                <Key size={16} /> Change Account Password
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Orders Overview */}
        <div className="card">
          <div className="flex-between" style={{ marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: 'var(--font-size-lg)' }}>Recent Atelier Orders</h3>
            <Link to="/orders" className="btn btn-outline btn-sm">
              View All Orders
            </Link>
          </div>

          {loadingOrders ? (
            <p style={{ padding: 'var(--space-4)', color: 'var(--color-text-muted)' }}>Loading recent orders...</p>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>You haven't commissioned any orders yet.</p>
              <Link to="/shop" className="btn btn-primary btn-sm">
                Explore The Collections
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', minWidth: '580px', fontSize: 'var(--font-size-sm)', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)', textTransform: 'uppercase', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    <th style={{ padding: '10px 12px' }}>Order #</th>
                    <th style={{ padding: '10px 12px' }}>Date</th>
                    <th style={{ padding: '10px 12px' }}>Items</th>
                    <th style={{ padding: '10px 12px' }}>Total Amount</th>
                    <th style={{ padding: '10px 12px' }}>Fulfillment Status</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{order.orderNumber}</td>
                      <td style={{ padding: '12px', color: 'var(--color-text-secondary)' }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {order.items?.length || 1} {order.items?.length === 1 ? 'item' : 'items'}
                      </td>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>
                        PKR {order.totalAmount.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <Badge status={order.orderStatus}>{order.orderStatus}</Badge>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <Link to={`/order/${order._id}`} className="btn btn-outline btn-sm" style={{ padding: '4px 10px' }}>
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAccount;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Filter, Truck } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import BackButton from '../../components/common/BackButton';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/orders', {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: search.trim() || undefined
      });
      if (res.success) setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search]);

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <BackButton to="/admin" label="Back to Dashboard" isDark style={{ marginBottom: 'var(--space-3)' }} />
        <span className="eyebrow" style={{ color: 'var(--color-gold)' }}>Fulfillment Control</span>
        <h1 style={{ color: '#FFF', fontSize: 'var(--font-size-3xl)' }}>Client Commissions ({orders.length})</h1>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ backgroundColor: '#212121', border: '1px solid #333', borderRadius: 'var(--radius-sm)', padding: 'var(--space-4)', marginBottom: 'var(--space-6)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by order #, patron name, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input"
          style={{ backgroundColor: '#1A1A1A', color: '#FFF', borderColor: '#404040', maxWidth: '360px' }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', color: '#888' }}>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ backgroundColor: '#1A1A1A', color: '#FFF', borderColor: '#404040', width: 'auto', padding: '8px 12px' }}
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ backgroundColor: '#212121', border: '1px solid #333', borderRadius: 'var(--radius-md)', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', minWidth: '720px', fontSize: 'var(--font-size-xs)', borderCollapse: 'collapse', textAlign: 'left', color: '#DDD' }}>
          <thead>
            <tr style={{ color: '#888', textTransform: 'uppercase', borderBottom: '1px solid #333' }}>
              <th style={{ padding: '12px 14px' }}>Order #</th>
              <th style={{ padding: '12px 14px' }}>Date</th>
              <th style={{ padding: '12px 14px' }}>Patron</th>
              <th style={{ padding: '12px 14px' }}>Items</th>
              <th style={{ padding: '12px 14px' }}>Total Amount</th>
              <th style={{ padding: '12px 14px' }}>Payment</th>
              <th style={{ padding: '12px 14px' }}>Fulfillment</th>
              <th style={{ padding: '12px 14px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ padding: 'var(--space-8)', textAlign: 'center', color: '#888' }}>
                  Loading order records...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: 'var(--space-8)', textAlign: 'center', color: '#888' }}>
                  No orders found matching the filter criteria.
                </td>
              </tr>
            ) : (
              orders.map((ord) => (
                <tr key={ord._id} style={{ borderBottom: '1px solid #2B2B2B' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 'bold' }}>{ord.orderNumber}</td>
                  <td style={{ padding: '12px 14px', color: '#888' }}>
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <strong style={{ color: '#FFF', display: 'block' }}>{ord.shippingAddress?.recipientName}</strong>
                    <span style={{ color: '#777', fontSize: '11px' }}>{ord.shippingAddress?.city}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>{ord.items?.length || 1} line items</td>
                  <td style={{ padding: '12px 14px', fontWeight: 'bold' }}>PKR {ord.totalAmount.toLocaleString()}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ color: ord.paymentStatus === 'Paid' ? '#4ADE80' : '#FBBF24', fontWeight: 'bold' }}>
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <Badge status={ord.orderStatus}>{ord.orderStatus}</Badge>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <Link
                      to={`/admin/orders/${ord._id}`}
                      className="btn btn-outline btn-sm"
                      style={{ color: 'var(--color-gold)', borderColor: 'var(--color-gold)', padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Eye size={14} /> Manage
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;

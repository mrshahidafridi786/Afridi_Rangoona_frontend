import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, Users, Package, AlertCircle, TrendingUp, Eye, ArrowUpRight } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import BackButton from '../../components/common/BackButton';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/metrics')
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ color: '#FFF', textAlign: 'center', padding: 'var(--space-12)' }}>
        <p>Synthesizing atelier operational telemetry...</p>
      </div>
    );
  }

  const { metrics, recentOrders = [], topSelling = [] } = data || {};

  return (
    <div>
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div>
          <BackButton to="/" label="Exit to Storefront" isDark style={{ marginBottom: 'var(--space-3)' }} />
          <span className="eyebrow" style={{ color: 'var(--color-gold)' }}>Central Command</span>
          <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(1.75rem, 4vw, var(--font-size-3xl))' }}>Operational Overview</h1>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Link to="/admin/products/new" className="btn btn-gold btn-sm">
            + New Couture Piece
          </Link>
          <Link to="/admin/orders" className="btn btn-outline btn-sm" style={{ color: '#FFF', borderColor: '#444' }}>
            All Orders
          </Link>
        </div>
      </div>

      {/* Metric Cards KPI Grid */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-8)' }}>
        {/* Metric 1: Revenue */}
        <div style={{ backgroundColor: '#212121', border: '1px solid #333', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
          <div className="flex-between" style={{ marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999' }}>Total Revenue</span>
            <span style={{ padding: '6px', backgroundColor: 'rgba(200, 165, 106, 0.15)', borderRadius: 'var(--radius-sm)', color: 'var(--color-gold)' }}>
              <DollarSign size={18} />
            </span>
          </div>
          <h3 style={{ color: '#FFFFFF', fontSize: 'var(--font-size-2xl)' }}>
            PKR {(metrics?.totalRevenue || 0).toLocaleString()}
          </h3>
          <p style={{ fontSize: '11px', color: '#22C55E', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={12} /> Verified Cleared Ledger
          </p>
        </div>

        {/* Metric 2: Orders */}
        <div style={{ backgroundColor: '#212121', border: '1px solid #333', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
          <div className="flex-between" style={{ marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999' }}>Commissions</span>
            <span style={{ padding: '6px', backgroundColor: 'rgba(59, 130, 246, 0.15)', borderRadius: 'var(--radius-sm)', color: '#60A5FA' }}>
              <ShoppingBag size={18} />
            </span>
          </div>
          <h3 style={{ color: '#FFFFFF', fontSize: 'var(--font-size-2xl)' }}>
            {metrics?.totalOrders || 0}
          </h3>
          <p style={{ fontSize: '11px', color: '#F59E0B', marginTop: '6px' }}>
            {metrics?.pendingOrders || 0} Pending Fulfillment
          </p>
        </div>

        {/* Metric 3: Patrons */}
        <div style={{ backgroundColor: '#212121', border: '1px solid #333', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
          <div className="flex-between" style={{ marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999' }}>Active Patrons</span>
            <span style={{ padding: '6px', backgroundColor: 'rgba(168, 85, 247, 0.15)', borderRadius: 'var(--radius-sm)', color: '#C084FC' }}>
              <Users size={18} />
            </span>
          </div>
          <h3 style={{ color: '#FFFFFF', fontSize: 'var(--font-size-2xl)' }}>
            {metrics?.totalCustomers || 0}
          </h3>
          <p style={{ fontSize: '11px', color: '#888', marginTop: '6px' }}>
            Registered Accounts
          </p>
        </div>

        {/* Metric 4: Low Stock Inventory Alert */}
        <div style={{ backgroundColor: '#212121', border: '1px solid #333', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
          <div className="flex-between" style={{ marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999' }}>Stock Critical</span>
            <span style={{ padding: '6px', backgroundColor: 'rgba(239, 68, 68, 0.15)', borderRadius: 'var(--radius-sm)', color: '#F87171' }}>
              <AlertCircle size={18} />
            </span>
          </div>
          <h3 style={{ color: metrics?.lowStockProducts > 0 ? '#F87171' : '#FFFFFF', fontSize: 'var(--font-size-2xl)' }}>
            {metrics?.lowStockProducts || 0}
          </h3>
          <p style={{ fontSize: '11px', color: '#AAA', marginTop: '6px' }}>
            <Link to="/admin/inventory" style={{ color: 'var(--color-gold)' }}>View Inventory &rarr;</Link>
          </p>
        </div>
      </div>

      {/* Two Columns: Recent Orders + Leaderboard */}
      <div className="admin-dashboard-grid">
        
        {/* Left: Recent Orders Table */}
        <div style={{ backgroundColor: '#212121', border: '1px solid #333', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
          <div className="flex-between" style={{ marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid #333' }}>
            <h3 style={{ color: '#FFF', fontSize: 'var(--font-size-base)' }}>Recent Client Commissions</h3>
            <Link to="/admin/orders" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gold)' }}>
              View All Orders &rarr;
            </Link>
          </div>

          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: '520px', fontSize: 'var(--font-size-xs)', borderCollapse: 'collapse', textAlign: 'left', color: '#DDD' }}>
              <thead>
                <tr style={{ color: '#777', textTransform: 'uppercase', borderBottom: '1px solid #333' }}>
                  <th style={{ padding: '8px 10px' }}>Order #</th>
                  <th style={{ padding: '8px 10px' }}>Patron</th>
                  <th style={{ padding: '8px 10px' }}>Amount</th>
                  <th style={{ padding: '8px 10px' }}>Status</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Inspect</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((ord) => (
                  <tr key={ord._id} style={{ borderBottom: '1px solid #2B2B2B' }}>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{ord.orderNumber}</td>
                    <td style={{ padding: '10px' }}>{ord.user?.name || ord.shippingAddress?.recipientName}</td>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>PKR {ord.totalAmount.toLocaleString()}</td>
                    <td style={{ padding: '10px' }}>
                      <Badge status={ord.orderStatus}>{ord.orderStatus}</Badge>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>
                      <Link to={`/admin/orders/${ord._id}`} style={{ color: 'var(--color-gold)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Eye size={14} /> Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Top Selling Products Leaderboard */}
        <div style={{ backgroundColor: '#212121', border: '1px solid #333', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
          <div className="flex-between" style={{ marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid #333' }}>
            <h3 style={{ color: '#FFF', fontSize: 'var(--font-size-base)' }}>Top Atelier Pieces</h3>
            <Link to="/admin/products" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gold)' }}>
              Catalog &rarr;
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {topSelling.map((prod) => (
              <div key={prod._id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid #292929' }}>
                <img src={prod.images?.[0]} alt="" style={{ width: '42px', height: '52px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }} />
                <div style={{ flexGrow: 1, fontSize: 'var(--font-size-xs)' }}>
                  <p style={{ fontWeight: 'bold', color: '#FFF' }}>{prod.name}</p>
                  <p style={{ color: '#888' }}>Stock: {prod.stock} &bull; PKR {prod.price.toLocaleString()}</p>
                </div>
                <Link to={`/admin/products/edit/${prod._id}`} style={{ color: '#AAA' }}>
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

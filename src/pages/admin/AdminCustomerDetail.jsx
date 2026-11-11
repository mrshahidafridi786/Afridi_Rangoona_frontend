import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Calendar, ShoppingBag, DollarSign } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import BackButton from '../../components/common/BackButton';

const AdminCustomerDetail = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/admin/customers/${id}`)
      .then((res) => {
        if (res.success) {
          setCustomer(res.data.customer);
          setOrders(res.data.orders || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div style={{ color: '#FFF', padding: 'var(--space-8)' }}>Retrieving patron profile...</div>;
  }

  if (!customer) {
    return <div style={{ color: '#FFF', padding: 'var(--space-8)' }}>Patron record not found.</div>;
  }

  const lifetimeSpend = orders
    .filter((o) => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <BackButton to="/admin/customers" label="Back to Customers" isDark style={{ marginBottom: 'var(--space-4)' }} />

      <div className="flex-between" style={{ marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <span className="eyebrow" style={{ color: 'var(--color-gold)' }}>Patron Dossier</span>
          <h1 style={{ color: '#FFF', fontSize: 'var(--font-size-3xl)' }}>{customer.name}</h1>
          <p style={{ color: '#888', fontSize: 'var(--font-size-xs)' }}>Account ID: {customer._id}</p>
        </div>
        <span style={{ padding: '6px 14px', borderRadius: 'var(--radius-pill)', backgroundColor: customer.accountStatus === 'active' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)', color: customer.accountStatus === 'active' ? '#4ADE80' : '#F87171', fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase' }}>
          {customer.accountStatus}
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid-3" style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{ backgroundColor: '#212121', border: '1px solid #333', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', color: '#888', textTransform: 'uppercase' }}>Lifetime Spend</span>
          <h3 style={{ color: 'var(--color-gold)', fontSize: 'var(--font-size-2xl)', marginTop: '6px' }}>
            PKR {lifetimeSpend.toLocaleString()}
          </h3>
        </div>

        <div style={{ backgroundColor: '#212121', border: '1px solid #333', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', color: '#888', textTransform: 'uppercase' }}>Total Commissions</span>
          <h3 style={{ color: '#FFF', fontSize: 'var(--font-size-2xl)', marginTop: '6px' }}>
            {orders.length} Orders
          </h3>
        </div>

        <div style={{ backgroundColor: '#212121', border: '1px solid #333', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', color: '#888', textTransform: 'uppercase' }}>Patron Since</span>
          <h3 style={{ color: '#FFF', fontSize: 'var(--font-size-lg)', marginTop: '6px' }}>
            {new Date(customer.createdAt).toLocaleDateString()}
          </h3>
        </div>
      </div>

      {/* Order History */}
      <div style={{ backgroundColor: '#212121', border: '1px solid #333', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
        <h3 style={{ color: '#FFF', fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid #333' }}>
          Commission History ({orders.length})
        </h3>

        {orders.length === 0 ? (
          <p style={{ color: '#888', fontSize: 'var(--font-size-xs)' }}>No orders placed by this customer yet.</p>
        ) : (
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: '520px', fontSize: 'var(--font-size-xs)', borderCollapse: 'collapse', textAlign: 'left', color: '#DDD' }}>
              <thead>
                <tr style={{ color: '#888', textTransform: 'uppercase', borderBottom: '1px solid #333' }}>
                  <th style={{ padding: '8px 10px' }}>Order #</th>
                  <th style={{ padding: '8px 10px' }}>Date</th>
                  <th style={{ padding: '8px 10px' }}>Amount</th>
                  <th style={{ padding: '8px 10px' }}>Status</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Inspect</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} style={{ borderBottom: '1px solid #2B2B2B' }}>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{o.orderNumber}</td>
                    <td style={{ padding: '10px', color: '#888' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>PKR {o.totalAmount.toLocaleString()}</td>
                    <td style={{ padding: '10px' }}>
                      <Badge status={o.orderStatus}>{o.orderStatus}</Badge>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>
                      <Link to={`/admin/orders/${o._id}`} style={{ color: 'var(--color-gold)' }}>
                        View Order &rarr;
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
  );
};

export default AdminCustomerDetail;

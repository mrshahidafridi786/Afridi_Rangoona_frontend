import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, UserX, UserCheck } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/common/Badge';
import BackButton from '../../components/common/BackButton';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/customers', { search: search.trim() || undefined });
      if (res.success) setCustomers(res.data.customers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const toggleStatus = async (id, currentStatus, name) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    if (!window.confirm(`Set status of ${name} to ${newStatus}?`)) return;

    try {
      const res = await api.put(`/admin/customers/${id}/status`, { accountStatus: newStatus });
      if (res.success) {
        addToast(`Patron ${name} is now ${newStatus}.`, 'info');
        setCustomers(customers.map((c) => (c._id === id ? { ...c, accountStatus: newStatus } : c)));
      }
    } catch (err) {
      addToast(err.data?.message || err.message || 'Status update failed.', 'error');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <BackButton to="/admin" label="Back to Dashboard" isDark style={{ marginBottom: 'var(--space-3)' }} />
        <span className="eyebrow" style={{ color: 'var(--color-gold)' }}>Patron CRM</span>
        <h1 style={{ color: '#FFF', fontSize: 'var(--font-size-3xl)' }}>Registered Customers ({customers.length})</h1>
      </div>

      <div style={{ backgroundColor: '#212121', border: '1px solid #333', borderRadius: 'var(--radius-sm)', padding: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <input
          type="text"
          placeholder="Search by patron name, email, or telephone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input"
          style={{ backgroundColor: '#1A1A1A', color: '#FFF', borderColor: '#404040', maxWidth: '380px' }}
        />
      </div>

      <div style={{ backgroundColor: '#212121', border: '1px solid #333', borderRadius: 'var(--radius-md)', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', minWidth: '650px', fontSize: 'var(--font-size-xs)', borderCollapse: 'collapse', textAlign: 'left', color: '#DDD' }}>
          <thead>
            <tr style={{ color: '#888', textTransform: 'uppercase', borderBottom: '1px solid #333' }}>
              <th style={{ padding: '12px 14px' }}>Patron Name</th>
              <th style={{ padding: '12px 14px' }}>Email</th>
              <th style={{ padding: '12px 14px' }}>Phone</th>
              <th style={{ padding: '12px 14px' }}>Joined Date</th>
              <th style={{ padding: '12px 14px' }}>Account Status</th>
              <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: 'var(--space-8)', textAlign: 'center', color: '#888' }}>
                  Loading customer records...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 'var(--space-8)', textAlign: 'center', color: '#888' }}>
                  No customer records matched.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c._id} style={{ borderBottom: '1px solid #2B2B2B' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 'bold', color: '#FFF' }}>{c.name}</td>
                  <td style={{ padding: '12px 14px', color: '#AAA' }}>{c.email}</td>
                  <td style={{ padding: '12px 14px', color: '#888' }}>{c.phone || 'N/A'}</td>
                  <td style={{ padding: '12px 14px', color: '#888' }}>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ color: c.accountStatus === 'active' ? '#4ADE80' : '#F87171', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {c.accountStatus}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <Link
                        to={`/admin/customers/${c._id}`}
                        className="btn-icon"
                        style={{ color: 'var(--color-gold)' }}
                        title="View Orders History"
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleStatus(c._id, c.accountStatus, c.name)}
                        className="btn-icon"
                        style={{ color: c.accountStatus === 'active' ? '#F87171' : '#4ADE80' }}
                        title={c.accountStatus === 'active' ? 'Suspend Account' : 'Activate Account'}
                      >
                        {c.accountStatus === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
                      </button>
                    </div>
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

export default AdminCustomers;

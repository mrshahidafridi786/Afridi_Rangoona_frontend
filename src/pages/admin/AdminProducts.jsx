import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Edit2, Trash2, ExternalLink, Star } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products', { search, limit: 50 });
      if (res.success) setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you wish to archive "${name}"?`)) return;

    try {
      const res = await api.delete(`/products/${id}`);
      if (res.success) {
        addToast(`"${name}" has been archived.`, 'info');
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch (err) {
      addToast(err.data?.message || err.message || 'Failed to archive piece.', 'error');
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <BackButton to="/admin" label="Back to Dashboard" isDark style={{ marginBottom: 'var(--space-3)' }} />
          <span className="eyebrow" style={{ color: 'var(--color-gold)' }}>Atelier Management</span>
          <h1 style={{ color: '#FFF', fontSize: 'clamp(1.75rem, 4vw, var(--font-size-3xl))' }}>Product Catalog ({products.length})</h1>
        </div>

        <Link to="/admin/products/new">
          <Button variant="gold" size="md" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={18} /> Add New Creation
          </Button>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div style={{ backgroundColor: '#212121', border: '1px solid #333', borderRadius: 'var(--radius-sm)', padding: 'var(--space-4)', marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-3)' }}>
        <input
          type="text"
          placeholder="Filter by product title or keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input"
          style={{ backgroundColor: '#1A1A1A', color: '#FFF', borderColor: '#404040', maxWidth: '400px' }}
        />
      </div>

      {/* Products Table */}
      <div style={{ backgroundColor: '#212121', border: '1px solid #333', borderRadius: 'var(--radius-md)', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', minWidth: '680px', fontSize: 'var(--font-size-xs)', borderCollapse: 'collapse', textAlign: 'left', color: '#DDD' }}>
          <thead>
            <tr style={{ color: '#888', textTransform: 'uppercase', borderBottom: '1px solid #333' }}>
              <th style={{ padding: '12px 14px' }}>Creation</th>
              <th style={{ padding: '12px 14px' }}>Category</th>
              <th style={{ padding: '12px 14px' }}>Base Price</th>
              <th style={{ padding: '12px 14px' }}>Stock Units</th>
              <th style={{ padding: '12px 14px' }}>Featured</th>
              <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: 'var(--space-8)', textAlign: 'center', color: '#888' }}>
                  Loading catalog inventory...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 'var(--space-8)', textAlign: 'center', color: '#888' }}>
                  No matching creations found in atelier database.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} style={{ borderBottom: '1px solid #2B2B2B' }}>
                  <td style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <img src={p.images?.[0]} alt="" style={{ width: '42px', height: '54px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }} />
                    <div>
                      <strong style={{ color: '#FFF', display: 'block' }}>{p.name}</strong>
                      <span style={{ color: '#777', fontSize: '11px' }}>{p.slug}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>{p.category?.name || 'Unassigned'}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 'bold' }}>PKR {p.price.toLocaleString()}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ color: p.stock <= 5 ? '#F87171' : '#4ADE80', fontWeight: 'bold' }}>
                      {p.stock} units
                    </span>
                    {p.variants?.length > 0 && <span style={{ color: '#777', display: 'block', fontSize: '10px' }}>({p.variants.length} variants)</span>}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    {p.featured ? (
                      <span style={{ color: 'var(--color-gold)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <Star size={12} fill="var(--color-gold)" /> Featured
                      </span>
                    ) : (
                      <span style={{ color: '#666' }}>Standard</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <Link to={`/product/${p.slug}`} target="_blank" className="btn-icon" style={{ color: '#888' }} aria-label="View Storefront">
                        <ExternalLink size={16} />
                      </Link>
                      <Link to={`/admin/products/edit/${p._id}`} className="btn-icon" style={{ color: 'var(--color-gold)' }} aria-label="Edit Product">
                        <Edit2 size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p._id, p.name)}
                        className="btn-icon"
                        style={{ color: 'var(--color-danger)' }}
                        aria-label="Archive"
                      >
                        <Trash2 size={16} />
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

export default AdminProducts;

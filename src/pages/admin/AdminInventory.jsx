import React, { useState, useEffect } from 'react';
import { Warehouse, AlertTriangle, Check, Save } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockEdits, setStockEdits] = useState({});
  const [savingId, setSavingId] = useState(null);
  const { addToast } = useToast();

  const fetchInventory = async () => {
    try {
      const res = await api.get('/admin/inventory');
      if (res.success) {
        setProducts(res.data.products || []);
        const initial = {};
        res.data.products?.forEach((p) => {
          initial[p._id] = p.stock;
        });
        setStockEdits(initial);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockChange = (productId, val) => {
    setStockEdits({ ...stockEdits, [productId]: Number(val) || 0 });
  };

  const handleSaveStock = async (productId) => {
    setSavingId(productId);
    try {
      const res = await api.put(`/admin/inventory/${productId}`, {
        stock: stockEdits[productId]
      });

      if (res.success) {
        addToast('Stock level updated successfully.', 'success');
        setProducts(products.map((p) => (p._id === productId ? { ...p, stock: stockEdits[productId] } : p)));
      }
    } catch (err) {
      addToast(err.data?.message || err.message || 'Failed to update stock.', 'error');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <BackButton to="/admin" label="Back to Dashboard" isDark style={{ marginBottom: 'var(--space-3)' }} />
        <span className="eyebrow" style={{ color: 'var(--color-gold)' }}>Warehousing Telemetry</span>
        <h1 style={{ color: '#FFF', fontSize: 'var(--font-size-3xl)' }}>Inventory Control Grid ({products.length})</h1>
      </div>

      <div style={{ backgroundColor: '#212121', border: '1px solid #333', borderRadius: 'var(--radius-md)', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', minWidth: '680px', fontSize: 'var(--font-size-xs)', borderCollapse: 'collapse', textAlign: 'left', color: '#DDD' }}>
          <thead>
            <tr style={{ color: '#888', textTransform: 'uppercase', borderBottom: '1px solid #333' }}>
              <th style={{ padding: '12px 14px' }}>Artisanal Creation</th>
              <th style={{ padding: '12px 14px' }}>Category</th>
              <th style={{ padding: '12px 14px' }}>Base Price</th>
              <th style={{ padding: '12px 14px' }}>Inventory Status</th>
              <th style={{ padding: '12px 14px' }}>Update Stock Units</th>
              <th style={{ padding: '12px 14px', textAlign: 'right' }}>Save</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: 'var(--space-8)', textAlign: 'center', color: '#888' }}>
                  Loading warehouse status...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 'var(--space-8)', textAlign: 'center', color: '#888' }}>
                  No inventory pieces logged.
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const isCritical = p.stock <= 5;
                const isChanged = stockEdits[p._id] !== p.stock;
                return (
                  <tr key={p._id} style={{ borderBottom: '1px solid #2B2B2B', backgroundColor: isCritical ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
                    <td style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <img src={p.images?.[0]} alt="" style={{ width: '38px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }} />
                      <div>
                        <strong style={{ color: '#FFF', display: 'block' }}>{p.name}</strong>
                        <span style={{ color: '#777', fontSize: '11px' }}>{p.slug}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>{p.category?.name || 'Unassigned'}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 'bold' }}>PKR {p.price.toLocaleString()}</td>
                    <td style={{ padding: '12px 14px' }}>
                      {isCritical ? (
                        <span style={{ color: '#F87171', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                          <AlertTriangle size={14} /> Low: {p.stock} units
                        </span>
                      ) : (
                        <span style={{ color: '#4ADE80', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={14} /> Healthy ({p.stock})
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <input
                        type="number"
                        min="0"
                        value={stockEdits[p._id] ?? p.stock}
                        onChange={(e) => handleStockChange(p._id, e.target.value)}
                        className="form-input"
                        style={{ backgroundColor: '#181818', color: '#FFF', borderColor: isChanged ? 'var(--color-gold)' : '#404040', width: '90px', padding: '6px' }}
                      />
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <button
                        type="button"
                        disabled={savingId === p._id || !isChanged}
                        onClick={() => handleSaveStock(p._id)}
                        className={`btn btn-sm ${isChanged ? 'btn-gold' : 'btn-ghost'}`}
                        style={{ padding: '6px 12px', fontSize: '11px' }}
                      >
                        {savingId === p._id ? 'Saving...' : 'Apply'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInventory;

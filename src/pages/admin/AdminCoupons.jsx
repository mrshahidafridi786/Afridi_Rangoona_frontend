import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Tag, Calendar, Percent } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { addToast } = useToast();

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minSpend: '5000',
    maxDiscount: '',
    expiresAt: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/coupons');
      if (res.success) setCoupons(res.data.coupons || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/coupons', newCoupon);
      if (res.success) {
        addToast(`Promotional code "${newCoupon.code.toUpperCase()}" published.`, 'success');
        setCoupons([res.data.coupon, ...coupons]);
        setModalOpen(false);
        setNewCoupon({
          code: '',
          discountType: 'percentage',
          discountValue: '',
          minSpend: '5000',
          maxDiscount: '',
          expiresAt: ''
        });
      }
    } catch (err) {
      addToast(err.data?.message || err.message || 'Failed to create coupon.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    try {
      const res = await api.delete(`/coupons/${id}`);
      if (res.success) {
        addToast(`Coupon "${code}" deleted.`, 'info');
        setCoupons(coupons.filter((c) => c._id !== id));
      }
    } catch (err) {
      addToast('Failed to delete coupon.', 'error');
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div>
          <BackButton to="/admin" label="Back to Dashboard" isDark style={{ marginBottom: 'var(--space-3)' }} />
          <span className="eyebrow" style={{ color: 'var(--color-gold)' }}>Promotions</span>
          <h1 style={{ color: '#FFF', fontSize: 'clamp(1.75rem, 4vw, var(--font-size-3xl))' }}>Promotional Coupons ({coupons.length})</h1>
        </div>

        <Button variant="gold" size="md" onClick={() => setModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Create New Code
        </Button>
      </div>

      <div className="grid-3">
        {coupons.map((c) => (
          <div key={c._id} style={{ backgroundColor: '#212121', border: '1px solid #333', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', position: 'relative' }}>
            <div className="flex-between" style={{ marginBottom: 'var(--space-3)' }}>
              <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'bold', letterSpacing: '0.1em', color: 'var(--color-gold)', fontFamily: 'var(--font-display)' }}>
                {c.code}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(c._id, c.code)}
                className="btn-icon"
                style={{ color: 'var(--color-danger)' }}
              >
                <Trash2 size={16} />
              </button>
            </div>

            <p style={{ color: '#FFF', fontSize: 'var(--font-size-base)', fontWeight: 'bold', marginBottom: '8px' }}>
              {c.discountType === 'percentage' ? `${c.discountValue}% OFF Entire Order` : `PKR ${c.discountValue.toLocaleString()} Fixed Reduction`}
            </p>

            <div style={{ fontSize: 'var(--font-size-xs)', color: '#888', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <p>Min Spend: PKR {c.minSpend?.toLocaleString() || 0}</p>
              {c.maxDiscount && <p>Max Discount: PKR {c.maxDiscount.toLocaleString()}</p>}
              <p style={{ color: '#AAA', marginTop: '4px' }}>
                Expires: {new Date(c.expiresAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="overlay anim-fade-in" onClick={() => setModalOpen(false)} style={{ padding: 'var(--space-4)', overflowY: 'auto' }}>
          <div className="card anim-slide-up" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', width: '100%', margin: '6vh auto', padding: 'clamp(var(--space-4), 4vw, var(--space-6))', maxHeight: '88vh', overflowY: 'auto', backgroundColor: '#222', color: '#FFF', borderColor: '#444' }}>
            <h3 style={{ marginBottom: 'var(--space-4)', color: '#FFF' }}>Create Promotional Coupon</h3>

            <form onSubmit={handleCreateCoupon}>
              <div className="form-group">
                <label className="form-label" style={{ color: '#CCC' }}>Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HERITAGE15"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  className="form-input"
                  style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040' }}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" style={{ color: '#CCC' }}>Discount Type</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                    className="form-select"
                    style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040' }}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed PKR Amount</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#CCC' }}>Discount Value *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="15"
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: e.target.value })}
                    className="form-input"
                    style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040' }}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" style={{ color: '#CCC' }}>Minimum Spend (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="10000"
                    value={newCoupon.minSpend}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minSpend: e.target.value })}
                    className="form-input"
                    style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#CCC' }}>Max Discount Cap (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Optional"
                    value={newCoupon.maxDiscount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: e.target.value })}
                    className="form-input"
                    style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#CCC' }}>Expiration Date *</label>
                <input
                  type="date"
                  required
                  value={newCoupon.expiresAt}
                  onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
                  className="form-input"
                  style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-ghost" style={{ color: '#AAA' }}>
                  Cancel
                </button>
                <Button type="submit" variant="gold" loading={submitting}>
                  Activate Coupon
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;

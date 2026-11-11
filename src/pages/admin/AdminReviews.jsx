import React, { useState, useEffect } from 'react';
import { Trash2, Star, CheckCircle, Flag } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StarRating from '../../components/common/StarRating';
import BackButton from '../../components/common/BackButton';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchReviews = async () => {
    try {
      const res = await api.get('/admin/reviews');
      if (res.success) setReviews(res.data.reviews || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await api.put(`/admin/reviews/${id}/status`, { status });
      if (res.success) {
        addToast(`Review marked as ${status}.`, 'info');
        setReviews(reviews.map((r) => (r._id === id ? { ...r, status } : r)));
      }
    } catch (err) {
      addToast('Failed to update status.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently remove this review?')) return;
    try {
      const res = await api.delete(`/reviews/${id}`);
      if (res.success) {
        addToast('Review deleted from catalog.', 'info');
        setReviews(reviews.filter((r) => r._id !== id));
      }
    } catch (err) {
      addToast('Deletion failed.', 'error');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <BackButton to="/admin" label="Back to Dashboard" isDark style={{ marginBottom: 'var(--space-3)' }} />
        <span className="eyebrow" style={{ color: 'var(--color-gold)' }}>Moderation Suite</span>
        <h1 style={{ color: '#FFF', fontSize: 'var(--font-size-3xl)' }}>Patron Reflections ({reviews.length})</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {loading ? (
          <div style={{ color: '#888', padding: 'var(--space-8)' }}>Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div style={{ backgroundColor: '#212121', border: '1px solid #333', borderRadius: 'var(--radius-md)', padding: 'var(--space-8)', textAlign: 'center', color: '#888' }}>
            No reviews submitted across the platform yet.
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev._id} style={{ backgroundColor: '#212121', border: '1px solid #333', borderRadius: 'var(--radius-md)', padding: 'clamp(var(--space-4), 3vw, var(--space-6))' }}>
              <div className="flex-between" style={{ marginBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minWidth: 0 }}>
                  <img
                    src={rev.product?.images?.[0] || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=120&q=80'}
                    alt=""
                    style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius-xs)', flexShrink: 0 }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <h4 style={{ color: '#FFF', fontSize: 'var(--font-size-sm)' }}>{rev.product?.name}</h4>
                    <p style={{ color: '#888', fontSize: '11px' }}>
                      By {rev.user?.name || 'Patron'} &bull; {new Date(rev.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexShrink: 0 }}>
                  <StarRating rating={rev.rating} size={14} />
                  <span style={{ padding: '3px 8px', borderRadius: 'var(--radius-pill)', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: rev.status === 'approved' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(251, 191, 36, 0.2)', color: rev.status === 'approved' ? '#4ADE80' : '#FBBF24' }}>
                    {rev.status}
                  </span>
                </div>
              </div>

              {rev.title && <h5 style={{ color: '#E0E0E0', fontSize: 'var(--font-size-sm)', marginBottom: '4px' }}>{rev.title}</h5>}
              <p style={{ color: '#AAA', fontSize: 'var(--font-size-xs)', lineHeight: 1.5 }}>{rev.comment}</p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-4)', paddingTop: 'var(--space-2)', borderTop: '1px solid #2B2B2B' }}>
                {rev.status !== 'approved' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(rev._id, 'approved')}
                    className="btn btn-outline btn-sm"
                    style={{ color: '#4ADE80', borderColor: '#4ADE80', fontSize: '11px' }}
                  >
                    Approve
                  </button>
                )}
                {rev.status !== 'flagged' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(rev._id, 'flagged')}
                    className="btn btn-outline btn-sm"
                    style={{ color: '#FBBF24', borderColor: '#FBBF24', fontSize: '11px' }}
                  >
                    Flag
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(rev._id)}
                  className="btn btn-outline btn-sm"
                  style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)', fontSize: '11px' }}
                >
                  <Trash2 size={12} /> Purge
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminReviews;

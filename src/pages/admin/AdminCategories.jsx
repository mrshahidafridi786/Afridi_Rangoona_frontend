import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Layers } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', description: '', image: '' });
  const [creating, setCreating] = useState(false);
  const { addToast } = useToast();

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.success) setCategories(res.data.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCat.name.trim()) return;

    setCreating(true);
    try {
      const res = await api.post('/categories', newCat);
      if (res.success) {
        addToast(`Category "${newCat.name}" created.`, 'success');
        setCategories([...categories, res.data.category]);
        setNewCat({ name: '', description: '', image: '' });
        setModalOpen(false);
      }
    } catch (err) {
      addToast(err.data?.message || err.message || 'Failed to create category.', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      const res = await api.delete(`/categories/${id}`);
      if (res.success) {
        addToast('Category deleted.', 'info');
        setCategories(categories.filter((c) => c._id !== id));
      }
    } catch (err) {
      addToast(err.data?.message || err.message || 'Deletion failed.', 'error');
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div>
          <BackButton to="/admin" label="Back to Dashboard" isDark style={{ marginBottom: 'var(--space-3)' }} />
          <span className="eyebrow" style={{ color: 'var(--color-gold)' }}>Taxonomy</span>
          <h1 style={{ color: '#FFF', fontSize: 'clamp(1.75rem, 4vw, var(--font-size-3xl))' }}>Categories Matrix ({categories.length})</h1>
        </div>

        <Button variant="gold" size="md" onClick={() => setModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add Category
        </Button>
      </div>

      <div className="grid-3">
        {categories.map((c) => (
          <div key={c._id} style={{ backgroundColor: '#212121', border: '1px solid #333', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <img
              src={c.image || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80'}
              alt={c.name}
              style={{ width: '100%', height: '160px', objectFit: 'cover' }}
            />
            <div style={{ padding: 'var(--space-5)' }}>
              <div className="flex-between" style={{ marginBottom: 'var(--space-2)' }}>
                <h3 style={{ color: '#FFF', fontSize: 'var(--font-size-base)' }}>{c.name}</h3>
                <button
                  type="button"
                  onClick={() => handleDelete(c._id, c.name)}
                  className="btn-icon"
                  style={{ color: 'var(--color-danger)' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p style={{ color: 'var(--color-gold)', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px' }}>
                Slug: {c.slug}
              </p>
              <p style={{ color: '#888', fontSize: 'var(--font-size-xs)', lineHeight: 1.5 }}>
                {c.description || 'No description provided.'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="overlay anim-fade-in" onClick={() => setModalOpen(false)}>
          <div className="card anim-slide-up" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', width: '90%', margin: '15vh auto', padding: 'var(--space-6)', backgroundColor: '#222', color: '#FFF', borderColor: '#444' }}>
            <h3 style={{ marginBottom: 'var(--space-4)', color: '#FFF' }}>Create New Category</h3>

            <form onSubmit={handleCreateCategory}>
              <div className="form-group">
                <label className="form-label" style={{ color: '#CCC' }}>Category Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heirloom Rugs &amp; Tapestries"
                  value={newCat.name}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  className="form-input"
                  style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#CCC' }}>Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newCat.image}
                  onChange={(e) => setNewCat({ ...newCat, image: e.target.value })}
                  className="form-input"
                  style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#CCC' }}>Description</label>
                <textarea
                  rows={3}
                  placeholder="Short description for storefront banners..."
                  value={newCat.description}
                  onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                  className="form-textarea"
                  style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-ghost" style={{ color: '#AAA' }}>
                  Cancel
                </button>
                <Button type="submit" variant="gold" loading={creating}>
                  Create Category
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;

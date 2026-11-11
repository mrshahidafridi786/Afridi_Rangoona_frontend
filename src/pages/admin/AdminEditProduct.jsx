import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    discountPrice: '',
    description: '',
    images: '',
    featured: false,
    status: 'active',
    tags: ''
  });

  const [variants, setVariants] = useState([]);
  const [specifications, setSpecifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get(`/products/${id}`)
        ]);

        if (catRes.success) setCategories(catRes.data.categories || []);

        if (prodRes.success && prodRes.data?.product) {
          const p = prodRes.data.product;
          setFormData({
            name: p.name,
            category: p.category?._id || p.category,
            price: p.price,
            discountPrice: p.discountPrice || '',
            description: p.description,
            images: p.images?.join(', ') || '',
            featured: p.featured || false,
            status: p.status || 'active',
            tags: p.tags?.join(', ') || ''
          });
          setVariants(p.variants || []);
          setSpecifications(p.specifications || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      { sku: `SKU-${Date.now().toString().slice(-4)}`, color: '', size: '', stock: 5, priceAdjustment: 0 }
    ]);
  };

  const handleRemoveVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleAddSpec = () => {
    setSpecifications([...specifications, { label: '', value: '' }]);
  };

  const handleRemoveSpec = (index) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index, field, value) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price),
        discountPrice: Number(formData.discountPrice) || 0,
        description: formData.description.trim(),
        images: formData.images.split(',').map((u) => u.trim()).filter(Boolean),
        status: formData.status,
        featured: formData.featured,
        variants: variants.map((v) => ({
          ...v,
          stock: Number(v.stock) || 0,
          priceAdjustment: Number(v.priceAdjustment) || 0
        })),
        specifications: specifications.filter((s) => s.label && s.value),
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      };

      const res = await api.put(`/products/${id}`, payload);
      if (res.success) {
        addToast(`"${formData.name}" updated successfully.`, 'success');
        navigate('/admin/products');
      }
    } catch (err) {
      setError(err.data?.message || err.message || 'Failed to update piece.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ color: '#FFF', padding: 'var(--space-8)' }}>Loading product specifications...</div>;
  }

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
      <BackButton to="/admin/products" label="Back to Products" isDark style={{ marginBottom: 'var(--space-4)' }} />

      <div style={{ marginBottom: 'var(--space-6)' }}>
        <span className="eyebrow" style={{ color: 'var(--color-gold)' }}>Atelier Revision</span>
        <h1 style={{ color: '#FFF', fontSize: 'var(--font-size-3xl)' }}>Edit Creation: {formData.name}</h1>
      </div>

      {error && (
        <div style={{ backgroundColor: 'rgba(197, 48, 48, 0.25)', border: '1px solid var(--color-danger)', color: '#FFB8B8', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-6)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ backgroundColor: '#212121', border: '1px solid #333', borderRadius: 'var(--radius-md)', padding: 'var(--space-8)' }}>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label" style={{ color: '#CCC' }}>Product Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: '#CCC' }}>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="form-select"
              style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040' }}
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid-3">
          <div className="form-group">
            <label className="form-label" style={{ color: '#CCC' }}>Price (PKR)</label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="form-input"
              style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: '#CCC' }}>Discount Price (PKR)</label>
            <input
              type="number"
              value={formData.discountPrice}
              onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
              className="form-input"
              style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: '#CCC' }}>Publication Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="form-select"
              style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040' }}
            >
              <option value="active">Active (Visible)</option>
              <option value="draft">Draft (Hidden)</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ color: '#CCC' }}>Description</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="form-textarea"
            style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label" style={{ color: '#CCC' }}>Image URLs (comma separated)</label>
          <input
            type="text"
            value={formData.images}
            onChange={(e) => setFormData({ ...formData, images: e.target.value })}
            className="form-input"
            style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 'var(--space-4) 0' }}>
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
          />
          <label htmlFor="featured" style={{ color: '#FFF', fontSize: 'var(--font-size-sm)', cursor: 'pointer' }}>
            Feature on Homepage Highlights
          </label>
        </div>

        <hr style={{ borderColor: '#333', margin: 'var(--space-6) 0' }} />

        {/* Variants */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div className="flex-between" style={{ marginBottom: 'var(--space-3)' }}>
            <h3 style={{ color: '#FFF', fontSize: 'var(--font-size-base)' }}>Variants Matrix</h3>
            <button
              type="button"
              onClick={handleAddVariant}
              className="btn btn-outline btn-sm"
              style={{ color: 'var(--color-gold)', borderColor: 'var(--color-gold)' }}
            >
              <Plus size={14} /> Add Variant
            </button>
          </div>

          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 'var(--space-2)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', minWidth: '560px' }}>
              {variants.map((v, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr 40px', gap: 'var(--space-2)', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="SKU"
                    value={v.sku}
                    onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)}
                    className="form-input"
                    style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040', padding: '6px' }}
                  />
                  <input
                    type="text"
                    placeholder="Color"
                    value={v.color}
                    onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                    className="form-input"
                    style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040', padding: '6px' }}
                  />
                  <input
                    type="text"
                    placeholder="Size"
                    value={v.size}
                    onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                    className="form-input"
                    style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040', padding: '6px' }}
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={v.stock}
                    onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)}
                    className="form-input"
                    style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040', padding: '6px' }}
                  />
                  <input
                    type="number"
                    placeholder="+Price (PKR)"
                    value={v.priceAdjustment}
                    onChange={(e) => handleVariantChange(idx, 'priceAdjustment', e.target.value)}
                    className="form-input"
                    style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040', padding: '6px' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    className="btn-icon"
                    style={{ color: 'var(--color-danger)' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-4)', marginTop: 'var(--space-8)' }}>
          <Link to="/admin/products" className="btn btn-ghost" style={{ color: '#AAA' }}>
            Cancel
          </Link>
          <Button type="submit" variant="gold" size="lg" loading={submitting} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Save size={18} /> Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditProduct;

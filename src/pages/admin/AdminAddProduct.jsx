import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import BackButton from '../../components/common/BackButton';

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    discountPrice: '',
    description: '',
    images: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    featured: false,
    tags: 'Couture, Heritage, Artisanal'
  });

  // Dynamic Variants List
  const [variants, setVariants] = useState([
    { sku: 'HEIR-001-S', color: 'Midnight Gold', size: 'Small', stock: 5, priceAdjustment: 0 },
    { sku: 'HEIR-001-M', color: 'Midnight Gold', size: 'Medium', stock: 8, priceAdjustment: 0 }
  ]);

  // Specifications
  const [specifications, setSpecifications] = useState([
    { label: 'Fabric Composition', value: '100% Pure Raw Silk' },
    { label: 'Craft Lineage', value: 'Hand-done Zardozi Needlework' }
  ]);

  useEffect(() => {
    api.get('/categories')
      .then((res) => {
        if (res.success && res.data?.categories) {
          setCategories(res.data.categories);
          if (res.data.categories.length > 0) {
            setFormData((prev) => ({ ...prev, category: res.data.categories[0]._id }));
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingCats(false));
  }, []);

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
    setError('');

    if (!formData.name.trim() || !formData.price || !formData.category) {
      setError('Product title, category, and price are mandatory fields.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price),
        discountPrice: Number(formData.discountPrice) || 0,
        description: formData.description.trim(),
        images: formData.images.split(',').map((url) => url.trim()).filter(Boolean),
        variants: variants.map((v) => ({
          ...v,
          stock: Number(v.stock) || 0,
          priceAdjustment: Number(v.priceAdjustment) || 0
        })),
        specifications: specifications.filter((s) => s.label && s.value),
        featured: formData.featured,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      };

      const res = await api.post('/products', payload);
      if (res.success) {
        addToast(`"${formData.name}" added to the collection.`, 'success');
        navigate('/admin/products');
      }
    } catch (err) {
      setError(err.data?.message || err.message || 'Failed to create product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
      <BackButton to="/admin/products" label="Back to Products List" isDark style={{ marginBottom: 'var(--space-4)' }} />

      <div style={{ marginBottom: 'var(--space-6)' }}>
        <span className="eyebrow" style={{ color: 'var(--color-gold)' }}>Atelier Creation</span>
        <h1 style={{ color: '#FFF', fontSize: 'var(--font-size-3xl)' }}>Commission New Product</h1>
      </div>

      {error && (
        <div style={{ backgroundColor: 'rgba(197, 48, 48, 0.25)', border: '1px solid var(--color-danger)', color: '#FFB8B8', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-6)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ backgroundColor: '#212121', border: '1px solid #333', borderRadius: 'var(--radius-md)', padding: 'var(--space-8)' }}>
        
        {/* Core Attributes */}
        <h3 style={{ color: '#FFF', fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-4)' }}>Basic Information</h3>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label" style={{ color: '#CCC' }}>Product Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Imperial Emerald Raw Silk Sherwani"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: '#CCC' }}>Category *</label>
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

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label" style={{ color: '#CCC' }}>Regular Price (PKR) *</label>
            <input
              type="number"
              required
              min="0"
              placeholder="185000"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="form-input"
              style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: '#CCC' }}>Discounted Price (PKR)</label>
            <input
              type="number"
              min="0"
              placeholder="165000 (Optional)"
              value={formData.discountPrice}
              onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
              className="form-input"
              style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040' }}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ color: '#CCC' }}>Product Description *</label>
          <textarea
            required
            rows={4}
            placeholder="Detailed narrative regarding tailoring, history, and craft..."
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

        {/* Dynamic Variants Matrix */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div className="flex-between" style={{ marginBottom: 'var(--space-3)' }}>
            <h3 style={{ color: '#FFF', fontSize: 'var(--font-size-base)' }}>Inventory Variants Matrix</h3>
            <button
              type="button"
              onClick={handleAddVariant}
              className="btn btn-outline btn-sm"
              style={{ color: 'var(--color-gold)', borderColor: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Plus size={14} /> Add Variant Option
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

        <hr style={{ borderColor: '#333', margin: 'var(--space-6) 0' }} />

        {/* Specifications */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div className="flex-between" style={{ marginBottom: 'var(--space-3)' }}>
            <h3 style={{ color: '#FFF', fontSize: 'var(--font-size-base)' }}>Craft Specifications</h3>
            <button
              type="button"
              onClick={handleAddSpec}
              className="btn btn-outline btn-sm"
              style={{ color: 'var(--color-gold)', borderColor: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Plus size={14} /> Add Spec Row
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {specifications.map((s, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 40px', gap: 'var(--space-2)', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Label (e.g. Origin)"
                  value={s.label}
                  onChange={(e) => handleSpecChange(idx, 'label', e.target.value)}
                  className="form-input"
                  style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040', padding: '6px' }}
                />
                <input
                  type="text"
                  placeholder="Value (e.g. Northern Khyber Valley)"
                  value={s.value}
                  onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                  className="form-input"
                  style={{ backgroundColor: '#181818', color: '#FFF', borderColor: '#404040', padding: '6px' }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpec(idx)}
                  className="btn-icon"
                  style={{ color: 'var(--color-danger)' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-4)', marginTop: 'var(--space-8)' }}>
          <Link to="/admin/products" className="btn btn-ghost" style={{ color: '#AAA' }}>
            Cancel
          </Link>
          <Button type="submit" variant="gold" size="lg" loading={submitting} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Save size={18} /> Publish Creation To Store
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddProduct;

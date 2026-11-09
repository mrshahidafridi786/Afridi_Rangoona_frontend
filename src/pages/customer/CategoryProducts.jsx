import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import BackButton from '../../components/common/BackButton';
import ProductCard from '../../components/product/ProductCard';

const CategoryProducts = () => {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products', { category: categorySlug, sort })
        ]);

        if (catRes.success) {
          const match = catRes.data.categories?.find((c) => c.slug === categorySlug);
          setCategory(match || { name: categorySlug.replace(/-/g, ' ').toUpperCase(), description: '' });
        }

        if (prodRes.success) {
          setProducts(prodRes.data.products || []);
        }
      } catch (err) {
        console.error('[Category Products Error]', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [categorySlug, sort]);

  return (
    <div>
      {/* Category Header Hero */}
      <section
        style={{
          backgroundColor: 'var(--color-primary)',
          color: '#F8F5EF',
          padding: 'var(--space-16) 0',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <BackButton to="/shop" label="Back to All Collections" isDark />
            <nav style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-gold)' }}>
              <Link to="/" style={{ color: 'var(--color-gold)' }}>Home</Link> &bull;{' '}
              <Link to="/shop" style={{ color: 'var(--color-gold)' }}>Catalog</Link> &bull;{' '}
              <span style={{ color: '#FFFFFF' }}>{category?.name}</span>
            </nav>
          </div>
          <h1 style={{ color: '#F8F5EF', fontSize: 'clamp(1.75rem, 5vw, var(--font-size-4xl))', marginBottom: 'var(--space-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {category?.name}
          </h1>
          {category?.description && (
            <p style={{ maxWidth: '640px', margin: '0 auto', color: '#D0CAC0', fontSize: 'var(--font-size-base)' }}>
              {category.description}
            </p>
          )}
        </div>
      </section>

      {/* Products Grid & Sorting */}
      <div className="container section-spacing-sm">
        <div className="flex-between" style={{ marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            Curated pieces: <strong>{products.length}</strong>
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <label htmlFor="cat-sort" style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Sort:
            </label>
            <select
              id="cat-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '6px 12px', fontSize: 'var(--font-size-xs)' }}
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid-products">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="card skeleton" style={{ height: '360px' }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
            <h3>No Products in this Category</h3>
            <p style={{ color: 'var(--color-text-muted)', margin: 'var(--space-3) 0' }}>
              Check back soon as new atelier pieces are being tailored.
            </p>
            <Link to="/shop" className="btn btn-outline btn-sm">
              Explore All Collections
            </Link>
          </div>
        ) : (
          <div className="grid-products">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;

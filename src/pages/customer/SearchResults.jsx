import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import BackButton from '../../components/common/BackButton';
import ProductCard from '../../components/product/ProductCard';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    api.get('/products', { search: query })
      .then((res) => {
        if (res.success) setProducts(res.data.products || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="section-spacing-sm">
      <div className="container">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <BackButton to="/shop" label="Back to Catalog" style={{ marginBottom: 'var(--space-3)' }} />
          <span className="eyebrow">Search Discoveries</span>
          <h2>Results for "{query}"</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
            Found {products.length} {products.length === 1 ? 'creation' : 'creations'} matching your search
          </p>
        </div>

        {loading ? (
          <div className="grid-products">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card skeleton" style={{ height: '360px' }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
            <h3>No Exact Matches Found</h3>
            <p style={{ color: 'var(--color-text-muted)', margin: 'var(--space-3) 0 var(--space-6)' }}>
              We could not find any products matching "{query}". Try checking your spelling or browsing our categories.
            </p>
            <Link to="/shop" className="btn btn-primary">
              Browse Entire Collection
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

export default SearchResults;

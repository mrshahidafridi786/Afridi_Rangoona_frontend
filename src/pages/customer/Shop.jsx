import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, RefreshCcw, Search } from 'lucide-react';
import api from '../../services/api';
import ProductCard from '../../components/product/ProductCard';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [inStock, setInStock] = useState(searchParams.get('inStock') === 'true');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state when URL params change (e.g. from navbar clicks)
  useEffect(() => {
    setSearch(searchParams.get('q') || '');
    setSelectedCategory(searchParams.get('category') || '');
    setSort(searchParams.get('sort') || 'newest');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setInStock(searchParams.get('inStock') === 'true');
  }, [searchParams]);

  // Fetch Categories on mount
  useEffect(() => {
    api.get('/categories')
      .then((res) => {
        if (res.success) setCategories(res.data.categories || []);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch Products whenever filters change
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const queryParams = {
          page: searchParams.get('page') || 1,
          limit: 12,
          sort: searchParams.get('sort') || sort,
          category: searchParams.get('category') !== null ? searchParams.get('category') : selectedCategory,
          search: (searchParams.get('q') !== null ? searchParams.get('q') : search).trim() || undefined,
          minPrice: searchParams.get('minPrice') || minPrice || undefined,
          maxPrice: searchParams.get('maxPrice') || maxPrice || undefined,
          inStock: (searchParams.has('inStock') ? searchParams.get('inStock') === 'true' : inStock) ? 'true' : undefined
        };

        const res = await api.get('/products', queryParams);
        if (res.success) {
          setProducts(res.data.products || []);
          setPagination(res.data.pagination);
        }
      } catch (err) {
        console.error('[Shop Catalog Fetch Error]', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [searchParams, selectedCategory, sort, inStock]);

  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    const newParams = new URLSearchParams();
    if (search) newParams.set('q', search);
    if (selectedCategory) newParams.set('category', selectedCategory);
    if (sort) newParams.set('sort', sort);
    if (minPrice) newParams.set('minPrice', minPrice);
    if (maxPrice) newParams.set('maxPrice', maxPrice);
    if (inStock) newParams.set('inStock', 'true');
    newParams.set('page', '1');
    setSearchParams(newParams);
    setMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSort('newest');
    setMinPrice('');
    setMaxPrice('');
    setInStock(false);
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    const updated = new URLSearchParams(searchParams);
    updated.set('page', newPage.toString());
    setSearchParams(updated);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="section-spacing-sm">
      <div className="container">
        {/* Breadcrumb & Title */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <BackButton to="/" label="Back to Home" style={{ marginBottom: 'var(--space-3)' }} />
          <span className="eyebrow">Khyber Hujra Collection</span>
          <h2>All Traditional Creations</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
            Showing {pagination.total} handcrafted pieces from Swat, Charsadda, and Peshawar
          </p>
        </div>

        {/* Top Controls: Search Bar & Sort Dropdown */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--space-4)',
            backgroundColor: 'var(--color-surface)',
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            marginBottom: 'var(--space-8)'
          }}
        >
          {/* Quick Search */}
          <form onSubmit={handleApplyFilters} style={{ display: 'flex', gap: 'var(--space-2)', flex: '1 1 260px', width: '100%', maxWidth: '460px', minWidth: 0 }}>
            <input
              type="text"
              placeholder="Search by name, fabric, or style (e.g. Swat, Charsadda, Kaptaan)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ padding: '8px 12px', minWidth: 0, flexGrow: 1 }}
            />
            <button type="submit" className="btn btn-primary btn-sm" aria-label="Search" style={{ flexShrink: 0 }}>
              <Search size={16} />
            </button>
          </form>

          {/* Mobile Filter Toggle & Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="btn btn-outline btn-sm mobile-only"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <SlidersHorizontal size={14} /> {mobileFilterOpen ? 'Hide Filters' : 'Filter Catalog'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <label htmlFor="sort-select" style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-secondary)' }}>
                Sort:
              </label>
              <select
                id="sort-select"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  const updated = new URLSearchParams(searchParams);
                  updated.set('sort', e.target.value);
                  setSearchParams(updated);
                }}
                className="form-select"
                style={{ width: 'auto', padding: '8px 12px', fontSize: 'var(--font-size-xs)' }}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popularity">Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar Filters + Products Grid */}
        <div className="shop-layout-grid">
          {/* Left Column: Filter Sidebar */}
          <aside className={`shop-sidebar ${mobileFilterOpen ? 'is-open' : ''}`}>
            <div className="flex-between" style={{ marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: 'var(--font-size-sm)', textTransform: 'uppercase' }}>
                <SlidersHorizontal size={16} color="var(--color-accent)" /> Filter Catalog
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
              >
                <RefreshCcw size={12} /> Reset
              </button>
            </div>

            {/* Category Filter */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <h4 style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-3)' }}>
                Categories
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <label style={{ fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="category"
                    checked={!selectedCategory}
                    onChange={() => setSelectedCategory('')}
                  />
                  <span>All Categories</span>
                </label>
                {categories.map((c) => (
                  <label key={c._id} style={{ fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === c.slug || selectedCategory === c._id}
                      onChange={() => setSelectedCategory(c.slug)}
                    />
                    <span>{c.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <h4 style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-3)' }}>
                Price Range (PKR)
              </h4>
              <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="form-input"
                  style={{ padding: '6px 10px', fontSize: 'var(--font-size-xs)' }}
                />
                <span style={{ alignSelf: 'center', color: 'var(--color-text-muted)' }}>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="form-input"
                  style={{ padding: '6px 10px', fontSize: 'var(--font-size-xs)' }}
                />
              </div>
              <Button variant="primary" size="sm" fullWidth onClick={handleApplyFilters}>
                Apply Price Filter
              </Button>
            </div>

            {/* In-Stock Filter */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                />
                <span>In-Stock Items Only</span>
              </label>
            </div>
          </aside>

          {/* Right Column: Products Grid */}
          <div>
            {loading ? (
              <div className="grid-3">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="card skeleton" style={{ height: '380px' }} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
                <h3>No Items Found</h3>
                <p style={{ color: 'var(--color-text-muted)', margin: 'var(--space-3) 0 var(--space-6)' }}>
                  There are no products matching your selected criteria. Try adjusting your filters or search terms.
                </p>
                <Button variant="outline" onClick={handleResetFilters}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid-products">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-12)' }}>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        onClick={() => handlePageChange(pg)}
                        className={`btn btn-sm ${pg === pagination.page ? 'btn-primary' : 'btn-outline'}`}
                        style={{ minWidth: '40px' }}
                      >
                        {pg}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;

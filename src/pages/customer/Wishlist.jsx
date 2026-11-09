import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';

const Wishlist = () => {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToBag = (product) => {
    addToCart(product, 1, product.variants?.[0] || null);
  };

  return (
    <div className="section-spacing-sm">
      <div className="container">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <BackButton to="/shop" label="Continue Shopping" style={{ marginBottom: 'var(--space-3)' }} />
          <span className="eyebrow">Curated Vault</span>
          <h2>My Wishlist ({wishlistItems.length})</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
            Your saved couture pieces and artisanal heirlooms.
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
            <Heart size={48} color="var(--color-gold)" style={{ margin: '0 auto var(--space-4)', opacity: 0.5 }} />
            <h3>Your Wishlist is Empty</h3>
            <p style={{ color: 'var(--color-text-muted)', margin: 'var(--space-3) 0 var(--space-6)' }}>
              Explore our collections and tap the heart icon on any piece to preserve it here.
            </p>
            <Link to="/shop">
              <Button variant="primary">Explore The Catalog</Button>
            </Link>
          </div>
        ) : (
          <div className="grid-products">
            {wishlistItems.map((product) => {
              const currentPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
              return (
                <div key={product._id} className="product-card">
                  <div className="product-card__image-wrap">
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80'}
                      alt={product.name}
                      className="product-card__image"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <button
                      type="button"
                      className="product-card__wishlist-btn active"
                      onClick={() => toggleWishlist(product)}
                      aria-label="Remove from Wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="product-card__content">
                    <span className="product-card__category">{product.category?.name || 'Heritage'}</span>
                    <Link to={`/product/${product.slug}`} className="product-card__title">
                      {product.name}
                    </Link>

                    <div className="product-card__footer">
                      <div className="price-display">
                        <span>PKR {Number(currentPrice || 0).toLocaleString()}</span>
                      </div>

                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleMoveToBag(product)}
                        style={{ padding: '6px 12px' }}
                      >
                        <ShoppingBag size={14} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

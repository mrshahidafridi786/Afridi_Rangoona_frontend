import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import StarRating from '../common/StarRating';

const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!product) return null;

  const inWish = isInWishlist(product._id);
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const currentPrice = hasDiscount ? product.discountPrice : product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Use first variant if exists
    const defaultVariant = product.variants?.[0] || null;
    addToCart(product, 1, defaultVariant);
  };

  return (
    <div className="product-card">
      {/* Image Wrap */}
      <Link to={`/product/${product.slug}`} className="product-card__image-wrap">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="product-card__image"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Wishlist Button */}
        <button
          type="button"
          className={`product-card__wishlist-btn ${inWish ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={inWish ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={18} fill={inWish ? 'var(--color-accent)' : 'none'} />
        </button>

        {/* Discount Badge */}
        {hasDiscount && (
          <div style={{ position: 'absolute', bottom: 'var(--space-3)', left: 'var(--space-3)', zIndex: 2 }}>
            <span className="discount-badge">SAVE {discountPercent}%</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="product-card__content">
        <span className="product-card__category">
          {product.category?.name || 'Heritage Collection'}
        </span>

        <Link to={`/product/${product.slug}`} className="product-card__title">
          {product.name}
        </Link>

        {/* Ratings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
          <StarRating rating={product.averageRating || 5} size={13} />
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            ({product.reviewCount || 1})
          </span>
        </div>

        {/* Footer with Price and Quick Add */}
        <div className="product-card__footer">
          <div className="price-display">
            <span>PKR {Number(currentPrice || 0).toLocaleString()}</span>
            {hasDiscount && (
              <span className="price-original">PKR {Number(product.price || 0).toLocaleString()}</span>
            )}
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleQuickAdd}
            aria-label="Add to Bag"
            style={{ padding: '6px 12px' }}
          >
            <ShoppingBag size={14} /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

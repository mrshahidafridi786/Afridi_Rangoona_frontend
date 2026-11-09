import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Star, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StarRating from '../../components/common/StarRating';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';
import ProductCard from '../../components/product/ProductCard';

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Review Submission Modal State
  const [canReview, setCanReview] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/slug/${slug}`);
        if (res.success && res.data?.product) {
          const prod = res.data.product;
          setProduct(prod);
          setSelectedImage(0);

          // Select default variant if exists
          if (prod.variants && prod.variants.length > 0) {
            setSelectedVariant(prod.variants[0]);
          } else {
            setSelectedVariant(null);
          }

          // Fetch related products and reviews in parallel
          const [relRes, revRes] = await Promise.all([
            api.get(`/products/${prod._id}/related`),
            api.get(`/reviews/product/${prod._id}`)
          ]);

          if (relRes.success) setRelatedProducts(relRes.data.products || []);
          if (revRes.success) setReviews(revRes.data.reviews || []);

          // Check eligibility for reviews if authenticated
          if (isAuthenticated) {
            api.get(`/reviews/eligibility/${prod._id}`).then((eligRes) => {
              if (eligRes.success) {
                setCanReview(eligRes.data.canReview);
              }
            }).catch(() => setCanReview(false));
          }
        }
      } catch (err) {
        console.error('[Product Detail Fetch Error]', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [slug, isAuthenticated]);

  if (loading) {
    return (
      <div className="container section-spacing" style={{ textAlign: 'center' }}>
        <p>Loading artisanal heirloom details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container section-spacing" style={{ textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <p style={{ margin: 'var(--space-4) 0' }}>The requested piece may have been retired or sold out.</p>
        <Link to="/shop">
          <Button variant="primary">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  const inWish = isInWishlist(product._id);
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  let activePrice = hasDiscount ? product.discountPrice : product.price;

  if (selectedVariant && selectedVariant.priceAdjustment) {
    activePrice += selectedVariant.priceAdjustment;
  }

  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      addToast('Please write a review comment.', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.post('/reviews', {
        productId: product._id,
        rating: newRating,
        title: newTitle,
        comment: newComment
      });

      if (res.success) {
        addToast('Your review has been verified and posted.', 'success');
        setReviews([res.data.review, ...reviews]);
        setReviewModalOpen(false);
        setCanReview(false);
        setNewComment('');
        setNewTitle('');
      }
    } catch (err) {
      addToast(err.data?.message || err.message || 'Review submission failed.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="section-spacing-sm">
      <div className="container">
        {/* Back navigation & Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
          <BackButton
            to={product.category?.slug ? `/category/${product.category.slug}` : '/shop'}
            label={product.category?.name ? `Back to ${product.category.name}` : 'Back to Catalog'}
          />
          <nav style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)' }}>
            <Link to="/" style={{ color: 'var(--color-text-muted)' }}>Home</Link> &bull;{' '}
            <Link to="/shop" style={{ color: 'var(--color-text-muted)' }}>Catalog</Link> &bull;{' '}
            {product.category?.name && (
              <>
                <Link to={`/category/${product.category.slug}`} style={{ color: 'var(--color-text-muted)' }}>{product.category.name}</Link> &bull;{' '}
              </>
            )}
            <span style={{ color: 'var(--color-primary)' }}>{product.name}</span>
          </nav>
        </div>

        {/* Top Product Presentation */}
        <div className="product-detail-grid">
          
          {/* Left: Product Images Gallery */}
          <div>
            {/* Main Primary Image */}
            <div style={{ width: '100%', height: 'clamp(320px, 55vw, 540px)', backgroundColor: '#F0ECE3', borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative', marginBottom: 'var(--space-4)' }}>
              <img
                src={product.images?.[selectedImage] || product.images?.[0] || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80'}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80';
                }}
              />

              {hasDiscount && (
                <div style={{ position: 'absolute', top: 'var(--space-4)', left: 'var(--space-4)' }}>
                  <span className="discount-badge" style={{ padding: '4px 10px', fontSize: 'var(--font-size-xs)' }}>
                    SPECIAL SAVINGS
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Carousel */}
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: 'var(--space-3)', overflowX: 'auto', paddingBottom: '4px' }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    style={{
                      width: '72px',
                      height: '86px',
                      flexShrink: 0,
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: selectedImage === idx ? '2px solid var(--color-gold)' : '1px solid var(--color-border)',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <img
                      src={img}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Buying Actions & Details */}
          <div>
            <span className="eyebrow">{product.category?.name || 'Exclusive Atelier'}</span>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--space-3)' }}>{product.name}</h1>

            {/* Star Rating Overview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <StarRating rating={product.averageRating || 5} size={18} />
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                {product.averageRating || 5} ({reviews.length} Verified Reviews)
              </span>
            </div>

            {/* Price Presentation */}
            <div className="price-display" style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-6)' }}>
              <span>PKR {Number(activePrice || 0).toLocaleString()}</span>
              {hasDiscount && (
                <span className="price-original" style={{ fontSize: 'var(--font-size-lg)' }}>
                  PKR {Number(product.price || 0).toLocaleString()}
                </span>
              )}
            </div>

            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)', marginBottom: 'var(--space-6)' }}>
              {product.description}
            </p>

            <hr style={{ borderColor: 'var(--color-border)', margin: 'var(--space-6) 0' }} />

            {/* Variant Selector (Size / Color) */}
            {product.variants && product.variants.length > 0 && (
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <div className="flex-between" style={{ marginBottom: 'var(--space-2)' }}>
                  <label style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Select Size / Option:
                  </label>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: currentStock > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                    {currentStock > 5 ? `${currentStock} In Stock` : currentStock > 0 ? `Only ${currentStock} Remaining!` : 'Out of Stock'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                  {product.variants.map((v) => (
                    <button
                      key={v.sku}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        border: selectedVariant?.sku === v.sku ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                        backgroundColor: selectedVariant?.sku === v.sku ? 'var(--color-primary)' : 'var(--color-surface)',
                        color: selectedVariant?.sku === v.sku ? '#FFFFFF' : 'var(--color-primary)',
                        cursor: 'pointer'
                      }}
                    >
                      {v.size || v.color || v.sku}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & CTAs */}
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface)' }}>
                <button
                  type="button"
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '12px 16px', cursor: 'pointer' }}
                >
                  -
                </button>
                <span style={{ padding: '0 16px', fontWeight: 'bold', fontSize: 'var(--font-size-sm)' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= currentStock || isOutOfStock}
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  style={{ padding: '12px 16px', cursor: 'pointer' }}
                >
                  +
                </button>
              </div>

              <div style={{ flexGrow: 1, minWidth: '200px' }}>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                >
                  <ShoppingBag size={18} /> {isOutOfStock ? 'Sold Out' : 'Add To Shopping Bag'}
                </Button>
              </div>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => toggleWishlist(product)}
                aria-label="Wishlist"
                style={{ padding: '0 18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Heart size={20} fill={inWish ? 'var(--color-accent)' : 'none'} color={inWish ? 'var(--color-accent)' : 'currentColor'} />
              </button>
            </div>

            {/* Value Guarantees Accordion/Pillars */}
            <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4) var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--font-size-xs)' }}>
                <Truck size={18} color="var(--color-gold)" />
                <span>Fast KPK delivery with Cash on Delivery (Free over PKR 5,000).</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--font-size-xs)' }}>
                <ShieldCheck size={18} color="var(--color-gold)" />
                <span>100% Genuine KPK craft &mdash; Swat wool, pure leather &amp; original stitching.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--font-size-xs)' }}>
                <RefreshCw size={18} color="var(--color-gold)" />
                <span>7-Day friendly size exchange under our Pakhtun Melmastia guarantee.</span>
              </div>
            </div>

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div style={{ marginTop: 'var(--space-8)' }}>
                <h4 style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-3)' }}>
                  Craft &amp; Material Specifications
                </h4>
                <table style={{ width: '100%', fontSize: 'var(--font-size-xs)', borderCollapse: 'collapse' }}>
                  <tbody>
                    {product.specifications.map((spec, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '8px 0', color: 'var(--color-text-secondary)', width: '40%' }}>{spec.label}</td>
                        <td style={{ padding: '8px 0', fontWeight: 'bold' }}>{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Verified Customer Reviews Section */}
        <section style={{ marginTop: 'var(--space-20)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-12)' }}>
          <div className="flex-between" style={{ marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <div>
              <span className="eyebrow">Verified Patron Reflections</span>
              <h3>Customer Reviews ({reviews.length})</h3>
            </div>

            {canReview && (
              <Button variant="accent" size="sm" onClick={() => setReviewModalOpen(true)}>
                Write A Verified Review
              </Button>
            )}
          </div>

          {reviews.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
              <p style={{ color: 'var(--color-text-muted)' }}>There are no verified customer reviews yet for this piece.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {reviews.map((rev) => (
                <div key={rev._id} className="card" style={{ padding: 'var(--space-6)' }}>
                  <div className="flex-between" style={{ marginBottom: 'var(--space-2)' }}>
                    <div>
                      <span style={{ fontWeight: 'bold', fontSize: 'var(--font-size-sm)' }}>
                        {rev.user?.name || 'Patron'}
                      </span>
                      {rev.verifiedPurchase && (
                        <span style={{ marginLeft: '8px', color: 'var(--color-success)', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 'bold' }}>
                          <CheckCircle size={12} /> Verified Purchase
                        </span>
                      )}
                    </div>
                    <StarRating rating={rev.rating} size={14} />
                  </div>

                  {rev.title && <h5 style={{ fontSize: 'var(--font-size-sm)', marginBottom: '4px' }}>{rev.title}</h5>}
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Related Products Recommendations */}
        {relatedProducts.length > 0 && (
          <section style={{ marginTop: 'var(--space-20)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-12)' }}>
            <div className="section-header">
              <span className="eyebrow">Curated Complements</span>
              <h3>You May Also Admire</h3>
            </div>
            <div className="grid-products">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Review Submission Modal */}
      {reviewModalOpen && (
        <div className="overlay anim-fade-in" onClick={() => setReviewModalOpen(false)}>
          <div
            className="card anim-slide-up"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '520px', width: '90%', margin: '10vh auto', padding: 'var(--space-8)' }}
          >
            <h3 style={{ marginBottom: 'var(--space-2)' }}>Write A Review</h3>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
              As a verified patron of "{product.name}", please share your reflections on the tailoring and craftsmanship.
            </p>

            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label className="form-label">Star Rating</label>
                <StarRating rating={newRating} size={24} interactive onRatingChange={(r) => setNewRating(r)} />
              </div>

              <div className="form-group">
                <label className="form-label">Review Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Majestic craftsmanship and fit"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Written Reflections *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the fabric weight, embroidery detail, comfort, and presentation..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
                <button type="button" onClick={() => setReviewModalOpen(false)} className="btn btn-ghost">
                  Cancel
                </button>
                <Button variant="primary" type="submit" loading={submittingReview}>
                  Submit Verified Review
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

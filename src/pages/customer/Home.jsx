import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Compass, HeartHandshake } from 'lucide-react';
import api from '../../services/api';
import ProductCard from '../../components/product/ProductCard';
import Button from '../../components/common/Button';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featRes, newRes, catRes] = await Promise.all([
          api.get('/products/featured'),
          api.get('/products/new-arrivals'),
          api.get('/categories')
        ]);

        if (featRes.success) setFeaturedProducts(featRes.data.products || []);
        if (newRes.success) setNewArrivals(newRes.data.products || []);
        if (catRes.success) setCategories(catRes.data.categories || []);
      } catch (err) {
        console.error('[Home Data Error]', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div>
      {/* 1. Masterpiece Hero Section */}
      <section
        style={{
          position: 'relative',
          minHeight: 'clamp(520px, 80vh, 85vh)',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#171717',
          color: '#F8F5EF',
          backgroundImage: 'linear-gradient(rgba(23, 23, 23, 0.45), rgba(23, 23, 23, 0.8)), url(/assets/images/bab-e-khyber.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          overflow: 'hidden',
          padding: 'var(--space-12) 0'
        }}
      >
        <div className="container anim-slide-up" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '720px' }}>
            <span className="eyebrow" style={{ color: 'var(--color-gold)', letterSpacing: '0.25em' }}>
              &bull; KHYBER PAKHTUNKHWA HERITAGE &bull; PAKHAIR RAGHLAY &bull;
            </span>

            <h1 style={{ color: '#F8F5EF', fontSize: 'clamp(2rem, 6.5vw, 4.25rem)', lineHeight: 1.15, marginBottom: 'var(--space-6)', fontWeight: 700 }}>
              The Pride of Khyber, <br />
              <span style={{ color: 'var(--color-gold)', fontStyle: 'italic', fontWeight: 400 }}>Crafted for KPK</span>
            </h1>

            <p className="text-lead" style={{ color: '#E4DFD5', fontSize: 'clamp(0.95rem, 2.5vw, 1.125rem)', marginBottom: 'var(--space-8)', maxWidth: '580px' }}>
              Authentic Swati wool shawls, legendary Charsadda and Peshawari Kaptaan chappals, and regal attire. Handcrafted by master ustads across Khyber Pakhtunkhwa with traditional Pakhtun dignity.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              <Link to="/shop">
                <Button variant="accent" size="lg" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  Explore Hujra Collection <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/category/artisanal-shawls">
                <Button variant="outline" size="lg" style={{ color: '#F8F5EF', borderColor: 'var(--color-gold)' }}>
                  Swati Wool Shawls
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative corner crest watermark */}
        <div
          className="anim-float"
          style={{
            position: 'absolute',
            bottom: '-40px',
            right: '-40px',
            opacity: 0.08,
            pointerEvents: 'none',
            transform: 'rotate(-15deg)'
          }}
        >
          <img src="/assets/logo/logo-icon.svg" alt="" style={{ width: 'clamp(220px, 35vw, 450px)', height: 'clamp(220px, 35vw, 450px)' }} />
        </div>
      </section>

      {/* 2. Brand Ethos Highlights Bar */}
      <section style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-8) 0' }}>
        <div className="container">
          <div className="grid-3" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Sparkles size={28} color="var(--color-accent)" />
              <h4 style={{ fontSize: 'var(--font-size-base)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Ustad Craftsmanship</h4>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', maxWidth: '280px' }}>
                Hand-stitched with care by generational artisans from Peshawar, Charsadda, and Swat.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Shield size={28} color="var(--color-gold)" />
              <h4 style={{ fontSize: 'var(--font-size-base)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Pure KPK Materials</h4>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', maxWidth: '280px' }}>
                Genuine mountain wool from Swat, pure raw silk, and thick vegetable-tanned cowhide leather.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Compass size={28} color="var(--color-accent)" />
              <h4 style={{ fontSize: 'var(--font-size-base)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>KPK Express Delivery</h4>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', maxWidth: '280px' }}>
                Quick doorstep delivery across Peshawar, Mardan, Swat, Kohat, Bannu, and all KPK cities with COD.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Categories Grid */}
      <section className="section-spacing">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Khyber Traditions</span>
            <h2>KPK Heritage Categories</h2>
            <p>Explore our traditional craft &mdash; from handmade Kaptaan chappals to cozy Swati wool shawls.</p>
          </div>

          <div className="grid-3">
            {categories.slice(0, 3).map((cat) => (
              <Link
                key={cat._id}
                to={`/category/${cat.slug}`}
                className="category-card"
              >
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80'}
                  alt={cat.name}
                  className="category-card__image"
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(23, 23, 23, 0.88) 0%, rgba(23, 23, 23, 0.3) 60%, transparent 100%)',
                    zIndex: 1
                  }}
                />
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <h3 style={{ color: '#FFFFFF', fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-2)' }}>
                    {cat.name}
                  </h3>
                  <p className="category-card__arrow" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gold-light)' }}>
                    Explore Category <ArrowRight size={14} />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Best-Selling Products Showcase */}
      <section className="section-spacing" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container">
          <div className="flex-between" style={{ marginBottom: 'var(--space-10)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <div>
              <span className="eyebrow">Hujra Favorites</span>
              <h2>Khyber Bestsellers</h2>
            </div>
            <Link to="/shop" className="btn btn-outline btn-sm">
              View All Creations
            </Link>
          </div>

          <div className="grid-products">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Promotional Heritage Banner */}
      <section
        style={{
          backgroundColor: 'var(--color-primary)',
          color: '#F8F5EF',
          padding: 'clamp(var(--space-10), 8vw, var(--space-20)) 0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: 'var(--space-8)' }}>
            <div>
              <span className="eyebrow" style={{ color: 'var(--color-gold)' }}>KPK Winter Craft</span>
              <h2 style={{ color: '#F8F5EF', fontSize: 'clamp(1.75rem, 5vw, var(--font-size-4xl))', marginBottom: 'var(--space-6)' }}>
                The Swati &amp; Tirah <br /> Wool Archive
              </h2>
              <p style={{ color: '#C8C2B5', fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-relaxed)', marginBottom: 'var(--space-8)' }}>
                Spun from pure mountain sheep wool to keep you warm through Northern winters. Loomed with classic border motifs, each chadar represents generations of Pakhtun warmth and hospitality.
              </p>
              <Link to="/category/artisanal-shawls">
                <Button variant="gold" size="lg">
                  Shop Swati Shawls
                </Button>
              </Link>
            </div>

            <div style={{ position: 'relative' }}>
              <img
                src="/assets/images/products/swati_white.jpg"
                alt="Swati Shawl Handloom"
                style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', width: '100%', maxHeight: '480px', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  backgroundColor: 'var(--color-accent)',
                  color: '#FFFFFF',
                  padding: 'var(--space-3) var(--space-5)',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                <p style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Swat Valley Origin</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-base)', fontWeight: 'bold' }}>100% Pure Hand-Loomed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. New Arrivals Section */}
      <section className="section-spacing">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Fresh From The Ustads</span>
            <h2>New Khyber Arrivals</h2>
            <p>The newest traditional cuts, Kaptaan designs, and festive attires crafted in limited batches.</p>
          </div>

          <div className="grid-products">
            {newArrivals.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="section-spacing-sm" style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Voices of KPK Patrons</span>
            <h2>Warmth from Our Guests</h2>
          </div>

          <div className="grid-3">
            <div className="card" style={{ padding: 'clamp(var(--space-5), 4vw, var(--space-8))' }}>
              <div style={{ color: 'var(--color-gold)', marginBottom: 'var(--space-3)' }}>★★★★★</div>
              <p style={{ fontStyle: 'italic', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-sm)' }}>
                "The Double-Sole Kaptaan Chappal has the genuine weight and thick tyre sole we wear in the Hujra. Rugged, comfortable, and truly majestic."
              </p>
              <h5 style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Malik Jahangir Afridi</h5>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Khyber / Jamrud, KPK</span>
            </div>

            <div className="card" style={{ padding: 'clamp(var(--space-5), 4vw, var(--space-8))' }}>
              <div style={{ color: 'var(--color-gold)', marginBottom: 'var(--space-3)' }}>★★★★★</div>
              <p style={{ fontStyle: 'italic', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-sm)' }}>
                "Got my pure Swati wool chadar delivered to Mardan in two days via cash on delivery. The warmth and pure wool finish prove the authenticity."
              </p>
              <h5 style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Khanzada Bilal Khattak</h5>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Mardan, KPK</span>
            </div>

            <div className="card" style={{ padding: 'clamp(var(--space-5), 4vw, var(--space-8))' }}>
              <div style={{ color: 'var(--color-gold)', marginBottom: 'var(--space-3)' }}>★★★★★</div>
              <p style={{ fontStyle: 'italic', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-sm)' }}>
                "Oud Al-Afridi is rich and long-lasting, perfect for Jummah and Eid gatherings. Afridi Rangoona honors the dignity and hospitality of Pakhtunkhwa."
              </p>
              <h5 style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Dr. Asfandyar Shinwari</h5>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Peshawar, KPK</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

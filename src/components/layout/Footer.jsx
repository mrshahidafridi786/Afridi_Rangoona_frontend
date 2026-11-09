import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { addToast } = useToast();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      addToast('Thank you for subscribing to the AFRIDI RANGOONA Privé Gazette.', 'success');
      setNewsletterEmail('');
    }
  };

  return (
    <footer style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-background)', borderTop: '1px solid #2B2B2B', marginTop: 'var(--space-20)' }}>
      {/* Brand Value Pillars Bar */}
      <div style={{ borderBottom: '1px solid #282828', padding: 'var(--space-8) 0' }}>
        <div className="container">
          <div className="grid-4" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Award size={26} color="var(--color-gold)" />
              <h5 style={{ color: 'var(--color-gold-light)', fontSize: 'var(--font-size-sm)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Ustad Craftsmanship</h5>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>100% authentic Swati wool, pure leather &amp; handcrafted in KPK</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Truck size={26} color="var(--color-gold)" />
              <h5 style={{ color: 'var(--color-gold-light)', fontSize: 'var(--font-size-sm)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>KPK Express Delivery</h5>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Peshawar, Swat, Mardan, Kohat &amp; all KPK districts</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
              <ShieldCheck size={26} color="var(--color-gold)" />
              <h5 style={{ color: 'var(--color-gold-light)', fontSize: 'var(--font-size-sm)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Melmastia &amp; Amanat</h5>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Honest Pakhtun service with Cash on Delivery</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
              <RefreshCw size={26} color="var(--color-gold)" />
              <h5 style={{ color: 'var(--color-gold-light)', fontSize: 'var(--font-size-sm)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Hujra Khidmat</h5>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Friendly size adjustments &amp; custom fitting support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="section-spacing-sm">
        <div className="container">
          <div className="grid-4" style={{ gap: 'var(--space-10)' }}>
            
            {/* Col 1: Brand & Logo */}
            <div style={{ gridColumn: 'span 1' }}>
              <img
                src="/assets/logo/logo-light.svg"
                alt="AFRIDI RANGOONA"
                style={{ height: '48px', marginBottom: 'var(--space-4)' }}
              />
              <p style={{ fontSize: 'var(--font-size-sm)', color: '#A0A0A0', lineHeight: 'var(--line-height-relaxed)' }}>
                AFRIDI RANGOONA celebrates the living heritage of Khyber, Swat, and Peshawar. From legendary Kaptaan chappals to pure Swati wool shawls, we bring the timeless dignity and craft of Pakhtunkhwa to your doorstep.
              </p>
            </div>

            {/* Col 2: The Collections */}
            <div>
              <h4 style={{ color: 'var(--color-gold)', fontSize: 'var(--font-size-sm)', letterSpacing: 'var(--letter-spacing-widest)', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>
                Khyber Collections
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--font-size-sm)', color: '#A0A0A0' }}>
                <li><Link to="/category/luxury-pret" style={{ color: '#C0C0C0' }}>KPK Kurta &amp; Festive Pret</Link></li>
                <li><Link to="/category/artisanal-shawls" style={{ color: '#C0C0C0' }}>Pure Swati Wool Shawls</Link></li>
                <li><Link to="/category/heritage-footwear" style={{ color: '#C0C0C0' }}>Peshawari &amp; Kaptaan Chappals</Link></li>
                <li><Link to="/category/signature-fragrances" style={{ color: '#C0C0C0' }}>Pure Khyber Oud &amp; Attar</Link></li>
                <li><Link to="/category/handcrafted-accessories" style={{ color: '#C0C0C0' }}>Traditional Accessories</Link></li>
              </ul>
            </div>

            {/* Col 3: Concierge & Policies */}
            <div>
              <h4 style={{ color: 'var(--color-gold)', fontSize: 'var(--font-size-sm)', letterSpacing: 'var(--letter-spacing-widest)', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>
                Khidmat &amp; Trust
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--font-size-sm)', color: '#A0A0A0' }}>
                <li><Link to="/about" style={{ color: '#C0C0C0' }}>Our Khyber Heritage</Link></li>
                <li><Link to="/contact" style={{ color: '#C0C0C0' }}>KPK Khidmat &amp; Hujra</Link></li>
                <li><Link to="/shipping-returns" style={{ color: '#C0C0C0' }}>Delivery Across KPK &amp; Exchanges</Link></li>
                <li><Link to="/privacy-policy" style={{ color: '#C0C0C0' }}>Amanat &amp; Privacy</Link></li>
                <li><Link to="/terms-conditions" style={{ color: '#C0C0C0' }}>Terms of Service</Link></li>
              </ul>
            </div>

            {/* Col 4: Newsletter */}
            <div>
              <h4 style={{ color: 'var(--color-gold)', fontSize: 'var(--font-size-sm)', letterSpacing: 'var(--letter-spacing-widest)', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>
                Khyber Dispatch
              </h4>
              <p style={{ fontSize: 'var(--font-size-xs)', color: '#A0A0A0', marginBottom: 'var(--space-3)' }}>
                Get early updates for new Eid collections, seasonal Swati shawls, and artisan releases.
              </p>
              <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  style={{
                    backgroundColor: '#222222',
                    border: '1px solid #383838',
                    color: '#F8F5EF',
                    padding: '8px 12px',
                    fontSize: 'var(--font-size-xs)',
                    borderRadius: 'var(--radius-sm)',
                    flexGrow: 1
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-gold btn-sm"
                  aria-label="Subscribe"
                  style={{ padding: '8px 14px' }}
                >
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Copyright & Badges */}
          <div style={{ marginTop: 'var(--space-12)', paddingTop: 'var(--space-6)', borderTop: '1px solid #242424', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)', fontSize: 'var(--font-size-xs)', color: '#777777' }}>
            <p>&copy; {new Date().getFullYear()} AFRIDI RANGOONA. Crafted with Pakhtun Heritage, Dignity &amp; Pride for Khyber Pakhtunkhwa.</p>
            <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
              <span>Verified 256-Bit SSL</span>
              <span>PCI-DSS Compliant</span>
              <span>Stripe Test Mode Ready</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

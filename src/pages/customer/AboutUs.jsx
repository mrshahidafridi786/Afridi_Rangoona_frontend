import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Compass, Sparkles, Feather } from 'lucide-react';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';

const AboutUs = () => {
  return (
    <div>
      {/* Hero */}
      <section
        style={{
          backgroundColor: 'var(--color-primary)',
          color: '#F8F5EF',
          padding: 'var(--space-20) 0',
          textAlign: 'center',
          backgroundImage: 'linear-gradient(rgba(23, 23, 23, 0.7), rgba(23, 23, 23, 0.9)), url(https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container container-narrow">
          <BackButton to="/" label="Back to Home" isDark style={{ marginBottom: 'var(--space-6)' }} />
          <span className="eyebrow" style={{ color: 'var(--color-gold)' }}>Our Khyber Heritage</span>
          <h1 style={{ color: '#F8F5EF', fontSize: 'var(--font-size-5xl)', marginBottom: 'var(--space-4)' }}>
            The Heritage &amp; Dignity <br /> of Khyber
          </h1>
          <p className="text-lead" style={{ color: '#D5CFC2', maxWidth: '640px', margin: '0 auto' }}>
            Rooted in the timeless traditions of Peshawar, Swat, and Charsadda &mdash; celebrating true Pakhtun pride.
          </p>
        </div>
      </section>

      {/* Philosophy Body */}
      <section className="section-spacing">
        <div className="container container-narrow">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-relaxed)', color: 'var(--color-text-secondary)' }}>
            <p style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-primary)', fontFamily: 'var(--font-display)', lineHeight: '1.4' }}>
              AFRIDI RANGOONA was born from a deep love for Khyber Pakhtunkhwa &mdash; from the historic storytellers of Qissa Khwani Bazaar to the master chappal ustads of Charsadda and the handloom weavers of Swat Valley.
            </p>

            <p>
              In Pakhtun culture, what you wear carries <strong>Izzat (Honor)</strong> and <strong>Waqar (Dignity)</strong>. Our mission is to preserve these authentic crafts with absolute honesty (Amanat). Every Swati chadar is woven on traditional wooden pit looms with pure mountain wool, and our Kaptaan and Peshawari chappals are hand-stitched from sturdy, full-grain cowhide leather that lasts for years.
            </p>

            <div className="grid-2" style={{ margin: 'var(--space-6) 0' }}>
              <img
                src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=800&q=80"
                alt="Swati Handloom Weaving"
                style={{ borderRadius: 'var(--radius-md)', width: '100%', height: '320px', objectFit: 'cover' }}
              />
              <img
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80"
                alt="Charsadda & Peshawari Chappal Craft"
                style={{ borderRadius: 'var(--radius-md)', width: '100%', height: '320px', objectFit: 'cover' }}
              />
            </div>

            <h3 style={{ color: 'var(--color-primary)', marginTop: 'var(--space-4)' }}>Melmastia (Pakhtun Hospitality)</h3>
            <p>
              In our culture, the guest (Mehman) is a blessing. We treat every customer across Peshawar, Mardan, Swat, Kohat, and all of KPK not just as a buyer, but as an honored guest in our Hujra. That means straightforward pricing, sincere advice, cash on delivery, and effortless size exchanges whenever you need them.
            </p>

            <div style={{ backgroundColor: 'var(--color-surface)', borderLeft: '4px solid var(--color-gold)', padding: 'var(--space-6)', borderRadius: 'var(--radius-sm)', margin: 'var(--space-4) 0' }}>
              <p style={{ fontStyle: 'italic', color: 'var(--color-primary)', fontWeight: '500' }}>
                "We do not make ordinary clothes. We craft garments that represent the soul, warmth, and courage of Khyber Pakhtunkhwa."
              </p>
              <span style={{ display: 'block', marginTop: 'var(--space-2)', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-accent)' }}>
                &mdash; The Founders of AFRIDI RANGOONA
              </span>
            </div>

            <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
              <Link to="/shop">
                <Button variant="accent" size="lg">
                  Explore The Khyber Collection
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

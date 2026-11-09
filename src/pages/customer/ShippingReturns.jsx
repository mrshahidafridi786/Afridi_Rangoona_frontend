import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Clock } from 'lucide-react';
import BackButton from '../../components/common/BackButton';

const ShippingReturns = () => {
  return (
    <div className="section-spacing-sm">
      <div className="container container-narrow">
        <BackButton to="/" label="Back to Home" style={{ marginBottom: 'var(--space-4)' }} />
        <span className="eyebrow">Melmastia &amp; Trust Across KPK</span>
        <h1 style={{ marginBottom: 'var(--space-6)' }}>Delivery in KPK &amp; Exchange Policies</h1>

        <div className="grid-2" style={{ marginBottom: 'var(--space-8)' }}>
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <Truck size={28} color="var(--color-accent)" style={{ marginBottom: 'var(--space-3)' }} />
            <h3 style={{ fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-2)' }}>Fast KPK Courier</h3>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Free delivery on all orders over PKR 5,000. 1&ndash;3 days delivery across Peshawar, Swat, Mardan, Charsadda, Kohat, Abbottabad, Bannu, and all KPK districts with Cash on Delivery.
            </p>
          </div>

          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <RotateCcw size={28} color="var(--color-gold)" style={{ marginBottom: 'var(--space-3)' }} />
            <h3 style={{ fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-2)' }}>7-Day Friendly Exchange</h3>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              If your Kaptaan chappal size or kurta fit isn't perfect, our Pakhtun Melmastia guarantees a hassle-free size replacement within 7 days.
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', lineHeight: 'var(--line-height-relaxed)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          <section>
            <h3 style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-2)' }}>
              1. Delivery Coverage in Khyber Pakhtunkhwa
            </h3>
            <p>
              We deliver directly to your home or Hujra in all KPK cities including Peshawar, Charsadda, Mardan, Swabi, Swat, Abbottabad, Mansehra, Haripur, Kohat, Karak, Bannu, Lakki Marwat, Dera Ismail Khan, Nowshera, Malakand, Dir, and Khyber District.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-2)' }}>
              2. Cash on Delivery (COD) &amp; Amanat
            </h3>
            <p>
              Under our Amanat promise, Cash on Delivery is available for all orders across KPK. You can inspect the package upon arrival and pay the courier rider with full peace of mind.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-2)' }}>
              3. Traditional Box Presentation
            </h3>
            <p>
              Every Kaptaan chappal and Swati shawl comes packed in an authentic rigid presentation box with custom dust wraps, ensuring your items arrive in pristine condition.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-2)' }}>
              4. How to Request a Size Exchange
            </h3>
            <p>
              Simply contact our Peshawar Khidmat team on WhatsApp or phone at <strong>+92 300 1234567</strong> or email <strong>khidmat@afridirangoona.com</strong> with your order number. We will gladly send your replacement.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingReturns;

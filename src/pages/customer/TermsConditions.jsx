import React from 'react';
import BackButton from '../../components/common/BackButton';

const TermsConditions = () => {
  return (
    <div className="section-spacing-sm">
      <div className="container container-narrow">
        <BackButton to="/" label="Back to Home" style={{ marginBottom: 'var(--space-4)' }} />
        <span className="eyebrow">Legal Framework</span>
        <h1 style={{ marginBottom: 'var(--space-6)' }}>Terms and Conditions</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-8)' }}>
          Last Updated: November 5, 2026 &bull; AFRIDI RANGOONA
        </p>

        <div className="card" style={{ padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', lineHeight: 'var(--line-height-relaxed)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          <section>
            <h3 style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-2)' }}>
              1. Acceptance of Terms
            </h3>
            <p>
              By accessing the AFRIDI RANGOONA platform or placing an order, you agree to be bound by these Terms and Conditions. These terms govern the acquisition of all ready-to-wear pieces, bespoke couture, fragrances, and handcrafted accessories.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-2)' }}>
              2. Artisanal Variance &amp; Authenticity
            </h3>
            <p>
              Due to the authentic hand-spun, hand-dyed, and hand-embroidered nature of our products, subtle variations in thread texture, needlework tension, and organic dye hues are intrinsic hallmarks of artisanal individuality, not defects.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-2)' }}>
              3. Order Confirmation &amp; Pricing
            </h3>
            <p>
              Prices listed are in Pakistani Rupees (PKR) and are verified at the time of order placement. In the rare event of an unforeseen inventory or technical discrepancy, AFRIDI RANGOONA reserves the right to cancel an order and immediately refund the patron in full.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-2)' }}>
              4. Intellectual Property
            </h3>
            <p>
              All trademarks, crests, brand assets, imagery, and text featured across this platform are the exclusive intellectual property of AFRIDI RANGOONA. Unauthorized reproduction or commercial emulation is strictly prohibited.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;

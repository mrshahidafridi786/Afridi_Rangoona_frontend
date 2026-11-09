import React from 'react';
import BackButton from '../../components/common/BackButton';

const PrivacyPolicy = () => {
  return (
    <div className="section-spacing-sm">
      <div className="container container-narrow">
        <BackButton to="/" label="Back to Home" style={{ marginBottom: 'var(--space-4)' }} />
        <span className="eyebrow">Legal &amp; Privacy Safeguards</span>
        <h1 style={{ marginBottom: 'var(--space-6)' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-8)' }}>
          Effective Date: November 5, 2026 &bull; AFRIDI RANGOONA
        </p>

        <div className="card" style={{ padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', lineHeight: 'var(--line-height-relaxed)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          <section>
            <h3 style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-2)' }}>
              1. Our Commitment to Client Confidentiality
            </h3>
            <p>
              At AFRIDI RANGOONA, we honor the privacy of our patrons with the highest standard of fiduciary care. This policy describes how we collect, store, and safeguard your personal data when engaging with our digital storefront and bespoke concierge services.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-2)' }}>
              2. Data We Collect
            </h3>
            <p>
              We collect information strictly necessary to fulfill your orders and provide an exquisite bespoke shopping experience:
            </p>
            <ul style={{ listStyle: 'disc', paddingLeft: 'var(--space-6)', marginTop: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Contact details: Name, email address, phone number, and delivery destinations.</li>
              <li>Order records: Item specifications, variant choices, historical commission ledger.</li>
              <li>Technical identifiers: IP addresses, session cookies for cart persistence, and browser analytics.</li>
            </ul>
          </section>

          <section>
            <h3 style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-2)' }}>
              3. Payment Security &amp; Non-Storage of Financial Instruments
            </h3>
            <p>
              AFRIDI RANGOONA never stores, logs, or processes credit card numbers, CVV codes, or full banking credentials. All transactions are handled directly through certified, PCI-DSS Level 1 compliant payment gateways (e.g. Stripe, Safepay) with 256-bit TLS cryptographic transmission.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-2)' }}>
              4. Patron Data Rights
            </h3>
            <p>
              You maintain the absolute right to inspect, update, or request the permanent deletion of your customer profile and delivery address books. To exercise these rights, contact our Data Protection Officer at privacy@afridirangoona.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

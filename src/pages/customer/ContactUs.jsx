import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';

const ContactUs = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      addToast('Manana (Thank you)! Your message has been received. Our KPK team will contact you shortly.', 'success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitting(false);
    }, 800);
  };

  return (
    <div className="section-spacing-sm">
      <div className="container">
        <BackButton to="/" label="Back to Home" style={{ marginBottom: 'var(--space-4)' }} />
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto var(--space-12)' }}>
          <span className="eyebrow">Pakhair Raghlay • KPK Khidmat</span>
          <h2>Visit Our Hujra &amp; Atelier</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
            Have a question about custom sizing, Kaptaan chappal fittings, or bulk orders for weddings? Our doors and lines are always open.
          </p>
        </div>

        <div className="contact-layout-grid">
          
          {/* Left Column: Direct Atelier Information */}
          <div className="card" style={{ padding: 'clamp(var(--space-5), 4vw, var(--space-8))' }}>
            <h3 style={{ fontSize: 'var(--font-size-base)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-6)' }}>
              Peshawar Hujra &amp; Workshop
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', fontSize: 'var(--font-size-sm)' }}>
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <MapPin size={22} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                <div>
                  <h5 style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', marginBottom: '2px' }}>Flagship Hujra</h5>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    AFRIDI RANGOONA Heritage Hujra<br />
                    University Road, Near Jamrud Gate<br />
                    Peshawar 25000, Khyber Pakhtunkhwa
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <Phone size={22} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                <div>
                  <h5 style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', marginBottom: '2px' }}>KPK Khidmat Hotline</h5>
                  <p style={{ color: 'var(--color-text-secondary)' }}>+92 300 1234567</p>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>Mon &ndash; Sat, 09:00 &ndash; 20:00 PKT (Call or WhatsApp)</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <Mail size={22} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                <div>
                  <h5 style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', marginBottom: '2px' }}>Direct Inquiries</h5>
                  <p style={{ color: 'var(--color-text-secondary)', wordBreak: 'break-word' }}>khidmat@afridirangoona.com</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <Clock size={22} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                <div>
                  <h5 style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', marginBottom: '2px' }}>Melmastia &amp; Fittings</h5>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                    Drop in anytime for warm green tea (Kahwa) and custom measurement consultations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Dispatch Form */}
          <form onSubmit={handleSubmit} className="card" style={{ padding: 'clamp(var(--space-5), 4vw, var(--space-8))' }}>
            <h3 style={{ fontSize: 'var(--font-size-base)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-6)' }}>
              Send Us A Message
            </h3>

            <div className="grid-2">
              <Input
                label="Your Name"
                required
                placeholder="e.g. Taimur Khan"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Email Address"
                type="email"
                required
                placeholder="patron@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="grid-2">
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+92 300 0000000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <Input
                label="Subject"
                required
                placeholder="e.g. Bespoke Sherwani Sizing"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message Details *</label>
              <textarea
                required
                rows={5}
                placeholder="Please describe your garment preferences, custom sizing requirements, or courier questions..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="form-textarea"
              />
            </div>

            <Button type="submit" variant="primary" size="lg" loading={submitting} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Send size={16} /> Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

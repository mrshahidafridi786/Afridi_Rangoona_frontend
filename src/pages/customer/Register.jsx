import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      navigate('/account');
    } else {
      setError(result.message || 'Registration failed.');
    }
  };

  return (
    <div className="section-spacing" style={{ backgroundColor: 'var(--color-surface-subtle)', minHeight: '85vh', display: 'flex', alignItems: 'center' }}>
      <div className="container container-narrow" style={{ maxWidth: '520px' }}>
        <div className="card anim-slide-up" style={{ padding: 'var(--space-8)' }}>
          <BackButton to="/login" label="Back to Sign In" style={{ marginBottom: 'var(--space-4)' }} />
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <img src="/assets/logo/logo-primary.svg" alt="AFRIDI RANGOONA" style={{ height: '42px', margin: '0 auto var(--space-4)' }} />
            <span className="eyebrow">Join Our Khyber Family</span>
            <h2>Create Your Account</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
              Enjoy fast KPK checkout, tracked orders, and early Eid collection previews.
            </p>
          </div>

          {error && (
            <div style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-4)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              name="name"
              required
              placeholder="e.g. Sardar Taimur Afridi"
              value={formData.name}
              onChange={handleChange}
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              required
              placeholder="patron@example.com"
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              placeholder="+92 300 1234567"
              value={formData.phone}
              onChange={handleChange}
            />

            <Input
              label="Password (min 6 characters)"
              type="password"
              name="password"
              required
              placeholder="••••••••••••"
              value={formData.password}
              onChange={handleChange}
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              required
              placeholder="••••••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <div style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              By registering, you agree to AFRIDI RANGOONA’s{' '}
              <Link to="/terms-conditions" style={{ color: 'var(--color-accent)' }}>Terms &amp; Conditions</Link>{' '}
              and{' '}
              <Link to="/privacy-policy" style={{ color: 'var(--color-accent)' }}>Privacy Policy</Link>.
            </div>

            <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
              Create Patron Account
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
            Already a registered patron?{' '}
            <Link to="/login" style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

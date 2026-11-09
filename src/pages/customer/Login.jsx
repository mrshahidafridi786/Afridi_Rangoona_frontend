import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = location.state?.from || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      if (result.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirectPath);
      }
    } else {
      setError(result.message || 'Invalid email or password.');
    }
  };

  const fillDemoCustomer = () => {
    setEmail('customer@afridirangoona.com');
    setPassword('Customer@2026');
  };

  return (
    <div className="section-spacing" style={{ backgroundColor: 'var(--color-surface-subtle)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container container-narrow" style={{ maxWidth: '480px' }}>
        <div className="card anim-slide-up" style={{ padding: 'var(--space-8)' }}>
          <BackButton to="/" label="Back to Storefront" style={{ marginBottom: 'var(--space-4)' }} />
          
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <img src="/assets/logo/logo-primary.svg" alt="AFRIDI RANGOONA" style={{ height: '42px', margin: '0 auto var(--space-4)' }} />
            <span className="eyebrow">Pakhair Raghlay &bull; Welcome</span>
            <h2>Sign In</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
              Welcome back. Access your orders, saved favorites, and Khyber privileges.
            </p>
          </div>

          {error && (
            <div style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-4)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="patron@afridirangoona.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div style={{ position: 'relative' }}>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '34px', color: 'var(--color-text-muted)' }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex-between" style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--font-size-xs)' }}>
              <Link to="/forgot-password" style={{ color: 'var(--color-accent)' }}>
                Forgot your password?
              </Link>
            </div>

            <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
              Sign In To Account
            </Button>
          </form>

          {/* Quick One-Click Demo Login Helper */}
          <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
              Quick Evaluation Access:
            </p>
            <button
              type="button"
              onClick={fillDemoCustomer}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '11px', textTransform: 'none' }}
            >
              Fill Demo Patron Credentials
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
            New to AFRIDI RANGOONA?{' '}
            <Link to="/register" style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

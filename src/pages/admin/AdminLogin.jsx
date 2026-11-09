import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        setError('Access denied. This account does not possess administrative privileges.');
      }
    } else {
      setError(result.message || 'Invalid administrator credentials.');
    }
  };

  const fillAdminCredentials = () => {
    setEmail('admin@afridirangoona.com');
    setPassword('Admin@Afridi2026');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#121212', color: '#F0F0F0', padding: 'var(--space-4)' }}>
      <div style={{ maxWidth: '440px', width: '100%', backgroundColor: '#1E1E1E', border: '1px solid #333', borderRadius: 'var(--radius-md)', padding: 'var(--space-8)', boxShadow: 'var(--shadow-xl)' }}>
        <BackButton to="/" label="Back to Storefront" isDark style={{ marginBottom: 'var(--space-4)' }} />
        
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <img
            src="/assets/logo/logo-light.svg"
            alt="AFRIDI RANGOONA"
            style={{ height: '42px', margin: '0 auto var(--space-4)' }}
          />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: 'rgba(200, 165, 106, 0.2)', border: '1px solid var(--color-gold)', borderRadius: 'var(--radius-pill)', color: 'var(--color-gold)', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <ShieldCheck size={14} /> Administrative Gate
          </div>
          <h2 style={{ color: '#FFFFFF', marginTop: 'var(--space-3)', fontSize: 'var(--font-size-2xl)' }}>Command Login</h2>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(197, 48, 48, 0.2)', border: '1px solid var(--color-danger)', color: '#FFB8B8', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-4)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ color: '#CCC' }}>Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@afridirangoona.com"
              className="form-input"
              style={{ backgroundColor: '#262626', color: '#FFF', borderColor: '#404040' }}
            />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label" style={{ color: '#CCC' }}>Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="form-input"
              style={{ backgroundColor: '#262626', color: '#FFF', borderColor: '#404040' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '12px', top: '34px', color: '#888' }}
              aria-label="Toggle password view"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button type="submit" variant="gold" fullWidth size="lg" loading={loading} style={{ marginTop: 'var(--space-4)' }}>
            Authenticate Console
          </Button>
        </form>

        <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid #303030', textAlign: 'center' }}>
          <button
            type="button"
            onClick={fillAdminCredentials}
            className="btn btn-outline btn-sm"
            style={{ color: 'var(--color-gold)', borderColor: 'var(--color-gold)', fontSize: '11px', textTransform: 'none' }}
          >
            Fill Demo Administrator Key
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--font-size-xs)', color: '#888' }}>
          <Link to="/" style={{ color: '#AAA' }}>&larr; Return to Public Storefront</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [devToken, setDevToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.success) {
        setSubmitted(true);
        if (res.data?.devResetToken) {
          setDevToken(res.data.devResetToken);
        }
      }
    } catch (err) {
      setError(err.data?.message || err.message || 'Failed to dispatch reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-spacing" style={{ backgroundColor: 'var(--color-surface-subtle)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container container-narrow" style={{ maxWidth: '480px' }}>
        <div className="card anim-slide-up" style={{ padding: 'var(--space-8)' }}>
          <BackButton to="/login" label="Back to Sign In" style={{ marginBottom: 'var(--space-4)' }} />
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <span className="eyebrow">Account Recovery</span>
            <h2>Password Reset</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
              Enter your registered email address and we will dispatch a secure link to reset your credentials.
            </p>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', padding: 'var(--space-4)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>
                If an account exists for {email}, a recovery link has been generated.
              </div>

              {devToken && (
                <div style={{ backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5', padding: 'var(--space-4)', borderRadius: 'var(--radius-sm)', margin: 'var(--space-4) 0', textAlign: 'left', fontSize: 'var(--font-size-xs)' }}>
                  <p style={{ fontWeight: 'bold', color: '#9A3412', marginBottom: '4px' }}>Development Test Shortcut:</p>
                  <p style={{ wordBreak: 'break-all', marginBottom: '8px' }}>Token: <code>{devToken}</code></p>
                  <Link to={`/reset-password?token=${devToken}`} className="btn btn-accent btn-sm">
                    Click to Reset Password Now
                  </Link>
                </div>
              )}

              <Link to="/login" className="btn btn-outline btn-sm" style={{ marginTop: 'var(--space-4)' }}>
                Return To Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-4)' }}>
                  {error}
                </div>
              )}

              <Input
                label="Registered Email Address"
                type="email"
                required
                placeholder="patron@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Button type="submit" variant="primary" fullWidth size="lg" loading={loading} style={{ marginTop: 'var(--space-4)' }}>
                Dispatch Recovery Link
              </Button>

              <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--font-size-xs)' }}>
                <Link to="/login" style={{ color: 'var(--color-text-secondary)' }}>
                  &larr; Return to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

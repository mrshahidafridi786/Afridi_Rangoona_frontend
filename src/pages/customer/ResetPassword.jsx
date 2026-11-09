import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';
import { useToast } from '../../context/ToastContext';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', {
        token,
        newPassword,
        confirmNewPassword
      });

      if (res.success) {
        addToast('Your password has been reset successfully. Please sign in.', 'success');
        navigate('/login');
      }
    } catch (err) {
      setError(err.data?.message || err.message || 'Password reset failed. The token may be invalid or expired.');
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
            <span className="eyebrow">Security Credentials</span>
            <h2>Create New Password</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
              Choose a strong, memorable passphrase for your account.
            </p>
          </div>

          {error && (
            <div style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-4)' }}>
              {error}
            </div>
          )}

          {!token ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>
                No reset token provided. Please request a new recovery link.
              </p>
              <Link to="/forgot-password" className="btn btn-primary btn-sm">
                Request Password Reset
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <Input
                label="New Password"
                type="password"
                required
                placeholder="••••••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <Input
                label="Confirm New Password"
                type="password"
                required
                placeholder="••••••••••••"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />

              <Button type="submit" variant="primary" fullWidth size="lg" loading={loading} style={{ marginTop: 'var(--space-4)' }}>
                Update Password &amp; Sign In
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

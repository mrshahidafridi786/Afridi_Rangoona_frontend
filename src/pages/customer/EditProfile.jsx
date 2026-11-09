import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';

const EditProfile = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password'

  // Personal Info & Address State
  const defaultAddress = user?.addresses?.[0] || {};
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [recipientName, setRecipientName] = useState(defaultAddress.recipientName || user?.name || '');
  const [addressPhone, setAddressPhone] = useState(defaultAddress.phone || user?.phone || '');
  const [street, setStreet] = useState(defaultAddress.street || '');
  const [city, setCity] = useState(defaultAddress.city || '');
  const [state, setState] = useState(defaultAddress.state || '');
  const [postalCode, setPostalCode] = useState(defaultAddress.postalCode || '');
  const [country, setCountry] = useState(defaultAddress.country || 'Pakistan');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);

    const updatedAddresses = [{
      isDefault: true,
      recipientName: recipientName.trim(),
      phone: addressPhone.trim(),
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country.trim()
    }];

    const res = await updateProfile({
      name: name.trim(),
      phone: phone.trim(),
      addresses: updatedAddresses
    });

    setSavingProfile(false);
    if (res.success) {
      navigate('/account');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters in length.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
        confirmNewPassword
      });

      if (res.success) {
        addToast('Password changed successfully.', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setActiveTab('profile');
      }
    } catch (err) {
      setPasswordError(err.data?.message || err.message || 'Failed to change password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="section-spacing-sm">
      <div className="container container-narrow" style={{ maxWidth: '680px' }}>
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <BackButton to="/account" label="Back to Patron Dashboard" style={{ marginBottom: 'var(--space-3)' }} />
          <h2>Edit Account Settings</h2>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--space-6)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '12px 16px',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderBottom: activeTab === 'profile' ? '2px solid var(--color-gold)' : '2px solid transparent',
              color: activeTab === 'profile' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer'
            }}
          >
            Personal &amp; Address Book
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('password')}
            style={{
              padding: '12px 16px',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderBottom: activeTab === 'password' ? '2px solid var(--color-gold)' : '2px solid transparent',
              color: activeTab === 'password' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer'
            }}
          >
            Security &amp; Password
          </button>
        </div>

        {activeTab === 'profile' ? (
          <form onSubmit={handleProfileSubmit} className="card" style={{ padding: 'var(--space-8)' }}>
            <h3 style={{ fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-4)' }}>Contact Information</h3>
            <div className="grid-2">
              <Input
                label="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Primary Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <hr style={{ margin: 'var(--space-6) 0', borderColor: 'var(--color-border)' }} />

            <h3 style={{ fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-4)' }}>Default Courier Address</h3>
            <div className="grid-2">
              <Input
                label="Recipient Full Name"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              />
              <Input
                label="Delivery Contact Phone"
                required
                value={addressPhone}
                onChange={(e) => setAddressPhone(e.target.value)}
              />
            </div>

            <Input
              label="Street Address / Residence"
              required
              placeholder="e.g. Bungalow 12, Khyber Road"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />

            <div className="grid-3">
              <Input
                label="City"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Input
                label="State / Province"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
              <Input
                label="Postal Code"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>

            <Input
              label="Country"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
              <Link to="/account" className="btn btn-ghost">
                Cancel
              </Link>
              <Button type="submit" variant="primary" loading={savingProfile}>
                Save Profile Changes
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="card" style={{ padding: 'var(--space-8)' }}>
            <h3 style={{ fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-4)' }}>Rotate Account Password</h3>
            
            {passwordError && (
              <div style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-4)' }}>
                {passwordError}
              </div>
            )}

            <Input
              label="Current Password"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <Input
              label="New Password"
              type="password"
              required
              placeholder="Min 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <Input
              label="Confirm New Password"
              type="password"
              required
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
              <Button type="submit" variant="primary" loading={savingPassword}>
                Update Password
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProfile;

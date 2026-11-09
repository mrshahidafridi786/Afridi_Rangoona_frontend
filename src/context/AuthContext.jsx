import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('ar_auth_token'));
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const loadCurrentUser = useCallback(async () => {
    const savedToken = localStorage.getItem('ar_auth_token');
    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      api.setToken(savedToken);
      const res = await api.get('/auth/me');
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        setToken(savedToken);
      } else {
        api.setToken(null);
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      console.warn('[Auth] Session restoration failed:', err.message);
      api.setToken(null);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success) {
        const { user: loggedInUser, token: authToken } = res.data;
        setUser(loggedInUser);
        setToken(authToken);
        api.setToken(authToken);
        addToast(`Welcome back, ${loggedInUser.name}.`, 'success');
        return { success: true, user: loggedInUser };
      }
      return { success: false, message: res.message };
    } catch (err) {
      const msg = err.data?.message || err.message || 'Login failed. Please check credentials.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      if (res.success) {
        const { user: registeredUser, token: authToken } = res.data;
        setUser(registeredUser);
        setToken(authToken);
        api.setToken(authToken);
        addToast(`Account created successfully. Welcome to AFRIDI RANGOONA!`, 'success');
        return { success: true, user: registeredUser };
      }
      return { success: false, message: res.message };
    } catch (err) {
      const msg = err.data?.message || err.message || 'Registration failed.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore logout endpoint error
    } finally {
      api.setToken(null);
      setUser(null);
      setToken(null);
      addToast('You have been logged out.', 'info');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.success) {
        setUser(res.data.user);
        addToast('Profile updated successfully.', 'success');
        return { success: true, user: res.data.user };
      }
      return { success: false, message: res.message };
    } catch (err) {
      const msg = err.data?.message || err.message || 'Failed to update profile.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
        refreshUser: loadCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

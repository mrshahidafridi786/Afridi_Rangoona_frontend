import React, { useState } from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { Menu, ShieldCheck, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#141414', color: '#FFF' }}>
        <p>Verifying administrative credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return (
    <div className="admin-layout-container">
      {/* Sidebar (Desktop Persistent + Mobile Drawer) */}
      <AdminSidebar
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0, width: '100%' }}>
        {/* Mobile Admin Topbar Header */}
        <header className="admin-mobile-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="btn-icon"
              aria-label="Open Admin Menu"
              style={{ color: '#E0E0E0' }}
            >
              <Menu size={22} />
            </button>
            <img
              src="/assets/logo/logo-light.svg"
              alt="AFRIDI RANGOONA"
              style={{ height: '26px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Link
              to="/"
              target="_blank"
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}
            >
              <ExternalLink size={14} /> Storefront
            </Link>
          </div>
        </header>

        {/* Main Routed Outlet View */}
        <main className="admin-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Star,
  Tag,
  Warehouse,
  PlusCircle,
  ExternalLink,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Overview Metrics', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'All Products', path: '/admin/products', icon: Package },
    { label: 'Add New Product', path: '/admin/products/new', icon: PlusCircle },
    { label: 'Categories Matrix', path: '/admin/categories', icon: Layers },
    { label: 'Order Fulfillment', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Customer Roster', path: '/admin/customers', icon: Users },
    { label: 'Review Moderation', path: '/admin/reviews', icon: Star },
    { label: 'Promotional Coupons', path: '/admin/coupons', icon: Tag },
    { label: 'Live Inventory', path: '/admin/inventory', icon: Warehouse },
  ];

  const renderNavContent = () => (
    <>
      {/* Brand Header */}
      <div style={{ marginBottom: 'var(--space-6)', paddingLeft: 'var(--space-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <img
            src="/assets/logo/logo-light.svg"
            alt="AFRIDI RANGOONA Admin"
            style={{ height: '34px', marginBottom: 'var(--space-2)' }}
          />
          <div style={{ display: 'inline-block', padding: '2px 8px', backgroundColor: 'var(--color-accent)', color: '#FFF', fontSize: '9px', fontWeight: 'bold', letterSpacing: '0.15em', borderRadius: 'var(--radius-xs)', textTransform: 'uppercase' }}>
            COMMAND CONSOLE
          </div>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="btn-icon mobile-only"
            aria-label="Close Admin Navigation"
            style={{ color: '#E0E0E0' }}
          >
            <X size={22} />
          </button>
        )}
      </div>

      {/* Nav List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={onCloseMobile}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: isActive ? '600' : '400',
                color: isActive ? '#FFFFFF' : '#A0A0A0',
                backgroundColor: isActive ? 'rgba(200, 165, 106, 0.15)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--color-gold)' : '3px solid transparent',
                transition: 'all var(--duration-fast) var(--ease-luxury)'
              })}
            >
              <Icon size={18} color="currentColor" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Utilities */}
      <div style={{ paddingTop: 'var(--space-4)', borderTop: '1px solid #262626', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <Link
          to="/"
          target="_blank"
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '8px 14px', color: '#858585', fontSize: 'var(--font-size-xs)' }}
        >
          <ExternalLink size={16} /> View Live Storefront
        </Link>
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '8px 14px', color: 'var(--color-danger)', fontSize: 'var(--font-size-xs)', cursor: 'pointer', textAlign: 'left' }}
        >
          <LogOut size={16} /> End Admin Session
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Persistent Rail */}
      <aside className="admin-sidebar-desktop">
        {renderNavContent()}
      </aside>

      {/* Mobile Off-Canvas Drawer */}
      {isMobileOpen && (
        <div className="overlay mobile-only" onClick={onCloseMobile} style={{ zIndex: 'var(--z-drawer-backdrop)' }}>
          <div className="admin-sidebar-drawer anim-slide-right" onClick={(e) => e.stopPropagation()}>
            {renderNavContent()}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;

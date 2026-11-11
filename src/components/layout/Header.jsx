import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Header = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount, openDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-sticky)',
        backgroundColor: isScrolled ? 'rgba(248, 245, 239, 0.95)' : 'var(--color-background)',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        borderBottom: '1px solid var(--color-border)',
        transition: 'all var(--duration-base) var(--ease-luxury)'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 'var(--header-height)',
          flexWrap: 'nowrap',
          gap: 'var(--space-2)'
        }}
      >
        
        {/* Left: Mobile Menu Toggle & Brand Logo with Project Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 1.2vw, 12px)', flexShrink: 0, minWidth: 0 }}>
          <button
            className="btn-icon mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link
            to="/"
            className="navbar-logo"
            aria-label="AFRIDI RANGOONA Home"
            style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.2vw, 10px)', textDecoration: 'none', flexShrink: 0 }}
          >
            <img
              src="/assets/logo/logo-icon.svg"
              alt="Afridi Rangoona Logo"
              className="header-logo-img"
            />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, flexShrink: 0 }}>
              <span className="navbar-brand-title">
                AFRIDI <span style={{ color: 'var(--color-accent, #C66A32)' }}>RANGOONA</span>
              </span>
              <span className="navbar-brand-sub">
                Khyber Heritage
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Primary Desktop Navigation */}
        <nav
          className="desktop-nav"
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(8px, 1.1vw, 20px)',
            flexShrink: 1,
            flexWrap: 'nowrap'
          }}
        >
          <NavLink to="/shop" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Collections
          </NavLink>
          <NavLink to="/category/luxury-pret" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Kurta &amp; Pret
          </NavLink>
          <NavLink to="/category/artisanal-shawls" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Swati Shawls
          </NavLink>
          <NavLink to="/category/heritage-footwear" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Chappals
          </NavLink>
          <NavLink to="/category/signature-fragrances" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Fragrances
          </NavLink>
        </nav>

        {/* Right: Search, Account, Wishlist, Cart */}
        <div className="header-actions">
          {/* Search Trigger */}
          <button
            className="header-action-btn"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search Catalog"
          >
            <Search size={20} />
          </button>

          {/* User Account Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              className="header-action-btn"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              aria-label="User Account"
            >
              <User size={20} />
            </button>

            {userDropdownOpen && (
              <div className="navbar-dropdown-card">
                {isAuthenticated ? (
                  <div>
                    <div style={{ padding: 'var(--space-2) var(--space-3)', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--space-2)' }}>
                      <p style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-sm)' }}>{user.name}</p>
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{user.email}</p>
                    </div>

                    <Link
                      to="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="dropdown-link"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="dropdown-link"
                    >
                      My Orders
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="dropdown-link"
                        style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}
                      >
                        <ShieldCheck size={16} /> Admin Command
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="dropdown-danger-btn"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div>
                    <Link
                      to="/login"
                      onClick={() => setUserDropdownOpen(false)}
                      className="btn btn-primary btn-sm btn-full"
                      style={{ marginBottom: 'var(--space-2)' }}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setUserDropdownOpen(false)}
                      className="btn btn-outline btn-sm btn-full"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="header-action-btn"
            aria-label={`Wishlist containing ${wishlistCount} items`}
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="header-badge header-badge-accent">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Bag Drawer Trigger */}
          <button
            className="header-action-btn"
            onClick={openDrawer}
            aria-label={`Shopping bag with ${itemCount} items`}
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="header-badge header-badge-gold">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Quick Search Bar */}
      {isSearchOpen && (
        <div style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', padding: 'var(--space-3) 0' }}>
          <div className="container">
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              <input
                type="text"
                autoFocus
                placeholder="Search Swati shawls, Peshawari chappals, Khyber kurtas, pure oud..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ flex: '1 1 200px', minWidth: 0 }}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Search
              </button>
              <button type="button" onClick={() => setIsSearchOpen(false)} className="btn btn-ghost btn-sm">
                Close
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div
          className="overlay"
          onClick={() => setMobileMenuOpen(false)}
          style={{ zIndex: 'var(--z-drawer-backdrop)' }}
        >
          <div
            className="drawer anim-slide-right"
            onClick={(e) => e.stopPropagation()}
            style={{ left: 0, right: 'auto', padding: 'var(--space-6)', width: '320px', maxWidth: '85vw', overflowY: 'auto' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <img src="/assets/logo/logo-primary.svg" alt="AFRIDI RANGOONA" style={{ height: '32px' }} />
              <button onClick={() => setMobileMenuOpen(false)} className="btn-icon" aria-label="Close Navigation">
                <X size={22} />
              </button>
            </div>

            {/* Mobile User Quick Info */}
            <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-5)' }}>
              {isAuthenticated ? (
                <div>
                  <p style={{ fontWeight: 'bold', fontSize: 'var(--font-size-sm)' }}>Pakhair, {user.name}</p>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>{user.email}</p>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline btn-sm" style={{ flex: 1, padding: '4px 8px', fontSize: '11px' }}>
                      Profile
                    </Link>
                    <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline btn-sm" style={{ flex: 1, padding: '4px 8px', fontSize: '11px' }}>
                      Orders
                    </Link>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-sm" style={{ flex: 1, padding: '6px 12px', fontSize: '11px' }}>
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline btn-sm" style={{ flex: 1, padding: '6px 12px', fontSize: '11px' }}>
                    Join KPK Family
                  </Link>
                </div>
              )}
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-muted)' }}>Khyber Collections</span>
              <Link to="/shop" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 'var(--font-size-base)', fontWeight: 'bold' }}>
                All Creations
              </Link>
              <Link to="/category/luxury-pret" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 'var(--font-size-sm)' }}>
                KPK Kurta &amp; Pret
              </Link>
              <Link to="/category/artisanal-shawls" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 'var(--font-size-sm)' }}>
                Swati Wool &amp; Pashmina Shawls
              </Link>
              <Link to="/category/heritage-footwear" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 'var(--font-size-sm)' }}>
                Peshawari &amp; Kaptaan Chappals
              </Link>
              <Link to="/category/signature-fragrances" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 'var(--font-size-sm)' }}>
                Pure Fragrances &amp; Oud
              </Link>
              <Link to="/category/handcrafted-accessories" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 'var(--font-size-sm)' }}>
                Traditional Accessories
              </Link>

              <hr style={{ margin: 'var(--space-3) 0', borderColor: 'var(--color-border)' }} />

              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-muted)' }}>Hujra &amp; Hospitality</span>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 'var(--font-size-sm)' }}>Our Khyber Heritage</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 'var(--font-size-sm)' }}>KPK Khidmat &amp; Hujra</Link>
              <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 'var(--font-size-sm)' }}>My Wishlist ({wishlistCount})</Link>

              {isAdmin && (
                <>
                  <hr style={{ margin: 'var(--space-3) 0', borderColor: 'var(--color-border)' }} />
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--color-accent)', fontWeight: 'bold', fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={16} /> Admin Command Center
                  </Link>
                </>
              )}

              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  style={{ textAlign: 'left', color: 'var(--color-danger)', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', marginTop: 'var(--space-4)', cursor: 'pointer' }}
                >
                  Sign Out
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

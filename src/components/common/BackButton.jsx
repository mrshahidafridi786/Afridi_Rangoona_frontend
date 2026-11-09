import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Reusable BackButton component for AFRIDI RANGOONA
 * @param {string} to - Optional route path to navigate to. If omitted, uses navigate(-1).
 * @param {string} label - Text label to display alongside arrow (default: 'Back').
 * @param {string} variant - 'subtle' (inline text link), 'button' (pill/card button), 'outline' (bordered button).
 * @param {boolean} isDark - Dark mode theme for admin dashboard or dark sections.
 * @param {string} className - Additional CSS class names.
 * @param {object} style - Additional inline styles.
 */
const BackButton = ({
  to,
  label = 'Back',
  variant = 'subtle',
  isDark = false,
  className = '',
  style = {},
  onClick
}) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
      return;
    }
    if (!to) {
      e.preventDefault();
      // If history exists, go back, else fallback to home
      if (window.history.state && window.history.state.idx > 0) {
        navigate(-1);
      } else {
        navigate('/');
      }
    }
  };

  // Base luxury styling
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: 'var(--font-size-xs, 0.75rem)',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    textDecoration: 'none',
    userSelect: 'none',
    ...style
  };

  // Variant styling
  const variantStyles = {
    subtle: {
      color: isDark ? 'var(--color-gold, #C8A56A)' : 'var(--color-text-secondary, #666)',
      padding: '4px 0',
      background: 'transparent',
      border: 'none',
    },
    button: {
      color: isDark ? '#FFFFFF' : 'var(--color-primary, #171717)',
      backgroundColor: isDark ? '#262626' : 'var(--color-surface, #FFFFFF)',
      border: `1px solid ${isDark ? '#404040' : 'var(--color-border, #E6E1D8)'}`,
      padding: '8px 16px',
      borderRadius: 'var(--radius-sm, 3px)',
      boxShadow: 'var(--shadow-xs, 0 1px 2px rgba(0,0,0,0.05))',
    },
    outline: {
      color: isDark ? 'var(--color-gold, #C8A56A)' : 'var(--color-primary, #171717)',
      backgroundColor: 'transparent',
      border: `1px solid ${isDark ? 'var(--color-gold, #C8A56A)' : 'var(--color-border-dark, #D1C9BA)'}`,
      padding: '6px 14px',
      borderRadius: 'var(--radius-sm, 3px)',
    }
  };

  const combinedStyles = {
    ...baseStyles,
    ...(variantStyles[variant] || variantStyles.subtle)
  };

  const content = (
    <>
      <ArrowLeft size={15} className="back-btn-arrow" style={{ transition: 'transform 0.2s ease' }} />
      <span>{label}</span>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={`back-button ${className}`}
        style={combinedStyles}
        aria-label={label}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`back-button ${className}`}
      style={combinedStyles}
      aria-label={label}
    >
      {content}
    </button>
  );
};

export default BackButton;

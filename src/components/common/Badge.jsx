import React from 'react';

const Badge = ({ children, status = 'default', className = '' }) => {
  const normalizedStatus = status.toLowerCase();
  return (
    <span className={`badge badge-${normalizedStatus} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;

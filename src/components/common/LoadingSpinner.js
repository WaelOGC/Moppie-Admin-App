import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '', 'aria-label': ariaLabel = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'loading-spinner-sm',
    md: 'loading-spinner-md',
    lg: 'loading-spinner-lg',
    xl: 'loading-spinner-xl',
  };

  return (
    <div className={`loading-spinner-container ${className}`} role="status" aria-label={ariaLabel}>
      <div className={`loading-spinner ${sizeClasses[size]}`} aria-hidden="true" />
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};

export default LoadingSpinner;
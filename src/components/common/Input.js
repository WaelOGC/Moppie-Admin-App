import React from 'react';

const Input = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  const inputClasses = `form-input ${error ? 'form-input-error' : ''} ${className}`;

  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
        </label>
      )}
      <input
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="form-error">{error}</p>
      )}
      {helperText && !error && (
        <p className="form-helper-text">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
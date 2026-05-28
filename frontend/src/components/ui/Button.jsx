import React from 'react';
import './Button.css';

const Button = ({
  children, variant = 'primary', size = 'md',
  loading = false, fullWidth = false, className = '', ...props
}) => (
  <button
    className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${className}`}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading ? <span className="btn-spinner" /> : children}
  </button>
);

export default Button;

import React from 'react';
import './Input.css';

export const Input = ({ label, error, className = '', ...props }) => (
  <div className={`form-group ${className}`}>
    {label && <label className="form-label">{label}</label>}
    <input className={`form-input ${error ? 'form-input-error' : ''}`} {...props} />
    {error && <p className="form-error">{error}</p>}
  </div>
);

export const Textarea = ({ label, error, className = '', ...props }) => (
  <div className={`form-group ${className}`}>
    {label && <label className="form-label">{label}</label>}
    <textarea className={`form-input form-textarea ${error ? 'form-input-error' : ''}`} {...props} />
    {error && <p className="form-error">{error}</p>}
  </div>
);

export const Select = ({ label, error, children, className = '', ...props }) => (
  <div className={`form-group ${className}`}>
    {label && <label className="form-label">{label}</label>}
    <select className={`form-input form-select ${error ? 'form-input-error' : ''}`} {...props}>
      {children}
    </select>
    {error && <p className="form-error">{error}</p>}
  </div>
);

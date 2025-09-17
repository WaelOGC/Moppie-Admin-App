import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { MdSecurity, MdArrowBack } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';

const TwoFactorAuth = () => {
  const { verify2FA, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    clearError(); // Clear any previous errors
    const result = await verify2FA(data.code);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError('root', {
        type: 'manual',
        message: result.error || '2FA verification failed. Please try again.',
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <MdSecurity className="auth-logo-text" style={{ fontSize: '24px' }} />
          </div>
          <h2 className="auth-title">Two-Factor Authentication</h2>
          <p className="auth-subtitle">Enter the verification code from your authenticator app.</p>
        </div>

        {/* 2FA Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {(errors.root || error) && (
            <div className="auth-error">
              <p>{errors.root?.message || error}</p>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Verification Code</label>
            <input
              type="text"
              {...register('code', {
                required: 'Verification code is required',
                pattern: {
                  value: /^\d{6}$/,
                  message: 'Code must be 6 digits',
                },
              })}
              className="form-input"
              placeholder="000000"
              maxLength="6"
              style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }}
            />
            {errors.code && (
              <p className="form-error">{errors.code.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>

        <div className="auth-footer">
          <div style={{ marginBottom: '16px' }}>
            <p className="auth-footer-text">
              Don't have access to your authenticator app?
            </p>
            <button className="auth-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              Use backup code
            </button>
          </div>
          
          <Link to="/login" className="auth-link">
            <MdArrowBack style={{ marginRight: '4px', display: 'inline' }} />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;
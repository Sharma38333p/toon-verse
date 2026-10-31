import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User as UserIcon,
  Shield,
  Sparkles,
  ArrowRight,
  Trash2,
  CheckSquare,
  Square,
  AlertCircle,
  Tv,
  Film,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AuthGatePage.css';

function AuthGatePage() {
  const {
    login,
    register,
    loading,
    savedAccounts,
    quickSignIn,
    removeSavedAccount,
  } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [quickLoadingEmail, setQuickLoadingEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      const res = await login({ emailOrUsername: email, password }, rememberMe);
      if (!res.success) {
        setError(res.message);
      }
    } else {
      if (!username || !email || !password) {
        setError('Please fill out all required fields');
        return;
      }
      const res = await register({ username, email, password }, rememberMe);
      if (!res.success) {
        setError(res.message);
      }
    }
  };

  const handleQuickLogin = async (account) => {
    setError('');
    setQuickLoadingEmail(account.email);
    const res = await quickSignIn(account);
    if (!res.success) {
      setError(res.message);
    }
    setQuickLoadingEmail('');
  };

  const fillForm = (emailVal, passVal) => {
    setEmail(emailVal);
    setPassword(passVal);
    setMode('login');
    setError('');
  };

  return (
    <div className="auth-gate-page">
      {/* Background Animated Floating Geometric Shapes */}
      <div className="auth-gate-bg">
        <div className="gate-shape gate-shape--1" />
        <div className="gate-shape gate-shape--2" />
        <div className="gate-shape gate-shape--3" />
        <div className="gate-shape gate-shape--grid" />
      </div>

      <div className="auth-gate-container">
        {/* Left Branding Showcase Hero */}
        <div className="auth-gate-branding">
          <div className="gate-brand-logo">
            <span className="gate-logo-icon">🎬</span>
            <span className="gate-logo-text">Toon<span className="logo-accent">Verse</span></span>
          </div>

          <h1 className="gate-hero-title">
            The Ultimate <br />
            <span className="title-highlight">Cartoon Universe</span> <br />
            Awaits You!
          </h1>

          <p className="gate-hero-desc">
            Stream, watch official trailers, and download hundreds of full cartoon episodes from
            Cartoon Network, Disney, Nickelodeon, Pogo, and Hungama TV directly from your local cloud storage.
          </p>

          <div className="gate-feature-chips">
            <div className="gate-chip">
              <Tv size={16} /> 6+ Broadcast Networks
            </div>
            <div className="gate-chip">
              <Film size={16} /> 500+ MB Full Movie Streaming
            </div>
            <div className="gate-chip">
              <Shield size={16} /> Fast & Secure Local Cloud
            </div>
          </div>

          {/* Quick Demo Switcher */}
          <div className="gate-demo-box">
            <span className="demo-box-label">⚡ 1-Click Fast Access Demo Accounts:</span>
            <div className="demo-box-buttons">
              <button
                type="button"
                className="btn-demo-pill btn-demo-admin"
                onClick={() => fillForm('admin@toonverse.com', 'admin123')}
              >
                <Shield size={14} /> Admin Access (admin@toonverse.com)
              </button>
              <button
                type="button"
                className="btn-demo-pill"
                onClick={() => fillForm('user@toonverse.com', 'user123')}
              >
                <Sparkles size={14} /> User Access (user@toonverse.com)
              </button>
            </div>
          </div>
        </div>

        {/* Right Form Box */}
        <div className="auth-gate-card">
          {/* Saved Accounts Tray (Local Storage) */}
          {savedAccounts && savedAccounts.length > 0 && (
            <div className="saved-accounts-section">
              <div className="saved-accounts-header">
                <span className="saved-accounts-title">💾 Saved Accounts on this Device</span>
                <span className="saved-hint">1-Click Auto Sign In</span>
              </div>

              <div className="saved-accounts-list">
                {savedAccounts.map((acc) => (
                  <div key={acc.email} className="saved-account-card">
                    <button
                      type="button"
                      className="saved-account-btn"
                      onClick={() => handleQuickLogin(acc)}
                      disabled={loading || quickLoadingEmail === acc.email}
                      title={`Sign in as ${acc.username}`}
                    >
                      <div className="saved-avatar" style={{ background: acc.avatarColor || 'var(--gradient-primary)' }}>
                        {acc.username.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="saved-info">
                        <strong className="saved-name">{acc.username}</strong>
                        <span className="saved-email">{acc.email}</span>
                      </div>
                      {acc.role === 'admin' && (
                        <span className="saved-role-chip">ADMIN</span>
                      )}
                      <div className="saved-arrow">
                        {quickLoadingEmail === acc.email ? (
                          <div className="gate-spinner-small" />
                        ) : (
                          <ArrowRight size={16} />
                        )}
                      </div>
                    </button>

                    <button
                      type="button"
                      className="saved-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSavedAccount(acc.email);
                      }}
                      title="Remove from saved accounts"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Tabs */}
          <div className="gate-form-tabs">
            <button
              type="button"
              className={`gate-tab ${mode === 'login' ? 'gate-tab--active' : ''}`}
              onClick={() => {
                setMode('login');
                setError('');
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`gate-tab ${mode === 'register' ? 'gate-tab--active' : ''}`}
              onClick={() => {
                setMode('register');
                setError('');
              }}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="gate-error-banner">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form className="gate-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="gate-input-group">
                <label>Choose a Username</label>
                <div className="gate-input-wrapper">
                  <UserIcon size={18} className="gate-input-icon" />
                  <input
                    type="text"
                    placeholder="e.g. BenTennyson"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="gate-input-group">
              <label>{mode === 'login' ? 'Email or Username' : 'Email Address'}</label>
              <div className="gate-input-wrapper">
                <Mail size={18} className="gate-input-icon" />
                <input
                  type="text"
                  placeholder={mode === 'login' ? 'admin@toonverse.com' : 'you@example.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="gate-input-group">
              <label>Password</label>
              <div className="gate-input-wrapper">
                <Lock size={18} className="gate-input-icon" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Remember & Save Locally Checkbox */}
            <div className="gate-remember-row" onClick={() => setRememberMe(!rememberMe)}>
              <button type="button" className="checkbox-btn">
                {rememberMe ? (
                  <CheckSquare size={18} color="var(--color-secondary)" />
                ) : (
                  <Square size={18} color="var(--color-text-muted)" />
                )}
              </button>
              <span className="remember-text">
                Save login and remember on this computer
              </span>
            </div>

            <button type="submit" className="gate-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <div className="gate-spinner" />
                  <span>Verifying Credentials...</span>
                </>
              ) : mode === 'login' ? (
                <>
                  <Lock size={18} />
                  <span>Sign In & Unlock ToonVerse</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Create Account & Enter Free</span>
                </>
              )}
            </button>
          </form>

          <p className="gate-footer-note">
            🔒 Your account credentials are saved to MongoDB and stored locally on your device for fast 1-click re-entry.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthGatePage;

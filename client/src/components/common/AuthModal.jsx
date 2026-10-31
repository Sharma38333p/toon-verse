import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Shield, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AuthModal.css';

function AuthModal() {
  const { authModalOpen, authModalMode, closeAuth, setAuthModalMode, login, register, loading } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (authModalMode === 'login') {
      const res = await login({ emailOrUsername: email || username, password });
      if (!res.success) {
        setError(res.message);
      }
    } else {
      if (!username || !email || !password) {
        setError('Please fill in all fields');
        return;
      }
      const res = await register({ username, email, password });
      if (!res.success) {
        setError(res.message);
      }
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@toonverse.com');
    setPassword('admin123');
    setAuthModalMode('login');
    setError('');
  };

  const fillDemoUser = () => {
    setEmail('user@toonverse.com');
    setPassword('user123');
    setAuthModalMode('login');
    setError('');
  };

  return (
    <div className="auth-modal-backdrop" onClick={closeAuth}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <div className="auth-modal-tabs">
            <button
              className={`auth-modal-tab ${authModalMode === 'login' ? 'auth-modal-tab--active' : ''}`}
              onClick={() => {
                setAuthModalMode('login');
                setError('');
              }}
            >
              Sign In
            </button>
            <button
              className={`auth-modal-tab ${authModalMode === 'register' ? 'auth-modal-tab--active' : ''}`}
              onClick={() => {
                setAuthModalMode('register');
                setError('');
              }}
            >
              Create Account
            </button>
          </div>
          <button className="auth-modal-close" onClick={closeAuth} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form className="auth-modal-body" onSubmit={handleSubmit}>
          {error && (
            <div className="auth-error-banner">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {authModalMode === 'register' && (
            <div className="auth-input-group">
              <label>Username</label>
              <div className="auth-input-wrapper">
                <UserIcon size={18} className="auth-input-icon" />
                <input
                  type="text"
                  placeholder="e.g. CartoonNinja"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-input-group">
            <label>{authModalMode === 'login' ? 'Email or Username' : 'Email Address'}</label>
            <div className="auth-input-wrapper">
              <Mail size={18} className="auth-input-icon" />
              <input
                type="text"
                placeholder={authModalMode === 'login' ? 'admin@toonverse.com' : 'you@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label>Password</label>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <span>Authenticating...</span>
            ) : authModalMode === 'login' ? (
              <span>Sign In to ToonVerse</span>
            ) : (
              <span>Join ToonVerse Free</span>
            )}
          </button>

          {/* Quick Demo Credentials */}
          <div className="auth-demo-shortcuts">
            <span className="demo-label">⚡ 1-Click Demo Accounts:</span>
            <div className="demo-btns-row">
              <button type="button" className="demo-chip-btn demo-chip-admin" onClick={fillDemoAdmin}>
                <Shield size={14} /> Admin Demo
              </button>
              <button type="button" className="demo-chip-btn" onClick={fillDemoUser}>
                <Sparkles size={14} /> User Demo
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;

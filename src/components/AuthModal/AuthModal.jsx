import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AuthModal.css';

const AuthModal = ({ onClose }) => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'register' | 'forgot'
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (tab === 'login') {
      const res = await login(form.email, form.password);
      if (res.rateLimited) { setError(res.error); setRateLimited(true); setLoading(false); return; }
      if (res.error) { setError(res.error); setLoading(false); return; }
      onClose();
    } else if (tab === 'register') {
      if (!form.name.trim()) { setError('Please enter your full name.'); setLoading(false); return; }
      if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) { setError('Enter a valid email address.'); setLoading(false); return; }
      if (form.password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return; }
      if (form.password !== form.confirm) { setError('Passwords do not match.'); setLoading(false); return; }
      const res = await register(form.name, form.email, form.password);
      if (res.error) { setError(res.error); setLoading(false); return; }
      onClose();
    } else if (tab === 'forgot') {
      if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) { setError('Enter a valid email address.'); setLoading(false); return; }
      try {
        const API = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');
        const res = await fetch(`${API}/auth/forgot-password`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email })
        });
        const data = await res.json();
        if (res.ok) {
          setMessage(data.message);
        } else {
          setError(data.message || 'Something went wrong.');
        }
      } catch (err) {
        setError('Failed to send reset link.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal__close" onClick={onClose} aria-label="Close">✕</button>

        {/* Logo */}
        <div className="auth-modal__logo">
          <span className="auth-logo-top">KALRAV</span>
          <span className="auth-logo-line"></span>
          <span className="auth-logo-bottom">JEWEL</span>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === 'login' ? 'auth-tab--active' : ''}`}
            onClick={() => { setTab('login'); setError(''); setMessage(''); }}
            id="tab-login"
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${tab === 'register' ? 'auth-tab--active' : ''}`}
            onClick={() => { setTab('register'); setError(''); setMessage(''); }}
            id="tab-register"
          >
            Create Account
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {tab === 'register' && (
            <div className="auth-field">
              <label className="auth-label" htmlFor="auth-name">Full Name</label>
              <input
                id="auth-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="auth-input"
                autoComplete="name"
              />
            </div>
          )}

          <div className="auth-field">
            <label className="auth-label" htmlFor="auth-email">Email Address</label>
            <input
              id="auth-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="auth-input"
              autoComplete="email"
            />
          </div>

          {tab !== 'forgot' && (
            <div className="auth-field">
              <label className="auth-label" htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder={tab === 'register' ? 'Min. 6 characters' : 'Your password'}
                className="auth-input"
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              />
            </div>
          )}

          {tab === 'login' && (
            <div style={{ textAlign: 'right', marginTop: '-12px', marginBottom: '16px' }}>
              <button 
                type="button" 
                onClick={() => { setTab('forgot'); setError(''); setMessage(''); }} 
                style={{ background: 'none', border: 'none', color: '#b8960c', fontSize: '13px', cursor: 'pointer', padding: 0 }}
              >
                Forgot Password?
              </button>
            </div>
          )}

          {tab === 'register' && (
            <div className="auth-field">
              <label className="auth-label" htmlFor="auth-confirm">Confirm Password</label>
              <input
                id="auth-confirm"
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="Repeat your password"
                className="auth-input"
                autoComplete="new-password"
              />
            </div>
          )}

          {error && <p className="auth-error">{error}</p>}
          {message && <p className="auth-error" style={{ color: '#4a9a4a', backgroundColor: '#eef8ee', borderColor: '#4a9a4a' }}>{message}</p>}

          <button type="submit" className="btn-primary auth-submit" id="auth-submit-btn" disabled={loading || rateLimited}>
            <span>{tab === 'login' ? 'Sign In' : tab === 'register' ? 'Create Account' : 'Send Reset Link'}</span>
          </button>
        </form>

        {tab === 'forgot' ? (
          <p className="auth-switch">
            Remembered your password? <button className="auth-switch__link" onClick={() => { setTab('login'); setError(''); setMessage(''); }}>Sign in</button>
          </p>
        ) : (
          <p className="auth-switch">
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              className="auth-switch__link"
              onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError(''); setMessage(''); }}
            >
              {tab === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthModal;

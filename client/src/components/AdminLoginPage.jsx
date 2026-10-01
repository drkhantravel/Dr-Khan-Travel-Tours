import React, { useState, useEffect } from 'react';
import { Lock, Mail, KeyRound, AlertCircle, ShieldCheck, Sparkles, ArrowLeft, Plane } from 'lucide-react';

export default function AdminLoginPage({ onLoginSuccess, onNavigateToSite, apiUrl = 'http://localhost:5000' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverEnvEmail, setServerEnvEmail] = useState('admin@drkhantravel.com');

  useEffect(() => {
    fetch(`${apiUrl}/api/config/auth-info`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.configuredAdminEmail) {
          setServerEnvEmail(data.configuredAdminEmail);
        }
      })
      .catch(() => {});
  }, [apiUrl]);

  const handleFillDemo = () => {
    setEmail(serverEnvEmail);
    setPassword('admin123');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('dk_admin_token', data.token);
        localStorage.setItem('dk_admin_email', data.admin.email);
        onLoginSuccess(data);
      } else {
        setError(data.message || 'Authentication failed. Please check credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect to backend server. Make sure node server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page-wrap">
      {/* Background Media */}
      <img
        src="/hero-bg.jpg"
        alt="Background"
        className="outer-ocean-bg"
      />
      <div className="outer-ocean-vignette" />

      {/* Navigation back bar */}
      <div className="admin-login-topbar">
        <button onClick={onNavigateToSite} className="admin-nav-btn secondary-btn back-site-btn">
          <ArrowLeft size={16} /> Back to Website
        </button>
        <div className="brand-logo">
          <div className="logo-badge">
            <Plane className="plane-icon" />
          </div>
          <span className="brand-name">Dr. Khan Travel</span>
        </div>
      </div>

      {/* Main Glass Login Container */}
      <div className="admin-login-card-container">
        <div className="modal-card glass-modal dedicated-login-card">
          <div className="modal-header text-center">
            <div className="admin-badge-icon margin-auto">
              <ShieldCheck size={32} />
            </div>
            <h2 className="modal-title">Admin Portal Access</h2>
            <p className="modal-subtitle">
              Dedicated Executive Authentication Gateway.<br />Credentials configured via server environment (<code className="env-code">.env</code>).
            </p>
          </div>

          <div className="env-hint-box">
            <div className="hint-header">
              <Sparkles size={16} className="sparkle-icon" />
              <span>Server Configured Credentials</span>
            </div>
            <div className="hint-credentials">
              <div><strong>Email:</strong> {serverEnvEmail}</div>
              <div><strong>Password:</strong> admin123</div>
            </div>
            <button type="button" onClick={handleFillDemo} className="fill-demo-btn">
              Auto-fill Env Credentials
            </button>
          </div>

          {error && (
            <div className="alert-box error-alert margin-bottom-sm">
              <AlertCircle size={18} className="alert-icon" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <div className="input-input-wrap">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@drkhantravel.com"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-input-wrap">
                <KeyRound className="input-icon" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="form-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-primary-btn full-width-btn"
            >
              {loading ? (
                <span className="btn-spinner-wrap">
                  <span className="spinner-dot"></span> Authenticating...
                </span>
              ) : (
                <>
                  <Lock size={18} /> Authenticate & Access Admin
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

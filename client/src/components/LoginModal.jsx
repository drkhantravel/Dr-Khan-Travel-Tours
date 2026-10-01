import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, KeyRound, AlertCircle, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, apiUrl = 'http://localhost:5000' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverEnvEmail, setServerEnvEmail] = useState('admin@drkhantravel.com');

  useEffect(() => {
    // Fetch current server env admin email hint
    fetch(`${apiUrl}/api/config/auth-info`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.configuredAdminEmail) {
          setServerEnvEmail(data.configuredAdminEmail);
        }
      })
      .catch(() => {
        // Fallback default if server offline
      });
  }, [apiUrl]);

  if (!isOpen) return null;

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
        onClose();
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
    <div className="modal-backdrop">
      <div className="modal-card glass-modal">
        {/* Close Button */}
        <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Header */}
        <div className="modal-header">
          <div className="admin-badge-icon">
            <ShieldCheck size={28} />
          </div>
          <h2 className="modal-title">Admin Portal Login</h2>
          <p className="modal-subtitle">
            Access Dr. Khan Travel & Tours executive management system. Credentials are authenticated from server environment variables (<code className="env-code">.env</code>).
          </p>
        </div>

        {/* Demo Env Hint Badge */}
        <div className="env-hint-box">
          <div className="hint-header">
            <Sparkles size={16} className="sparkle-icon" />
            <span>Server Environment Configured Credentials</span>
          </div>
          <div className="hint-credentials">
            <div><strong>Email:</strong> {serverEnvEmail}</div>
            <div><strong>Password:</strong> admin123</div>
          </div>
          <button type="button" onClick={handleFillDemo} className="fill-demo-btn">
            Auto-fill Env Credentials
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert-box error-alert">
            <AlertCircle size={18} className="alert-icon" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Admin Email Address</label>
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
            <label className="form-label">Admin Password</label>
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
                <span className="spinner-dot"></span> Authenticating with Server...
              </span>
            ) : (
              <>
                <Lock size={18} /> Login to Admin Dashboard
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

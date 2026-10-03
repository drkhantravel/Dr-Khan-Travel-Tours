import React, { useState } from 'react';
import { Lock, Mail, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage({ onLoginSuccess, onNavigateToSite, apiUrl = 'http://localhost:5000' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        setError(data.message || 'Invalid email or password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to reach server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page-wrap" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Resort Background Image */}
      <img
        src="/hero-bg.jpg"
        alt="Background"
        className="outer-ocean-bg"
      />
      <div className="outer-ocean-vignette" style={{ background: 'rgba(9, 19, 29, 0.45)' }} />

      {/* Top Left Return Button */}
      <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 30 }}>
        <button onClick={onNavigateToSite} className="admin-nav-btn secondary-btn back-site-btn" style={{ background: '#ffffff', color: '#0f2942', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', fontWeight: '600' }}>
          <ArrowLeft size={16} /> Return to Home
        </button>
      </div>

      {/* Main Light Glass Login Container */}
      <div className="admin-login-card-container" style={{ position: 'relative', zIndex: 20, margin: 'auto' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '2rem',
          padding: '2.75rem 2.5rem',
          boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.2)',
          width: '100%',
          maxWidth: '460px',
          boxSizing: 'border-box'
        }}>
          {/* Header with Logo Only */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img 
              src="/logo.png" 
              alt="Dr. Khan Travel & Tours" 
              style={{ height: '70px', objectFit: 'contain', margin: '0 auto 0.75rem auto', display: 'block' }}
            />
            <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '500', margin: 0 }}>
              Executive Authentication Gateway
            </p>
          </div>

          {error && (
            <div className="alert-box error-alert" style={{ marginBottom: '1.25rem', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
              <AlertCircle size={18} className="alert-icon" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: '#0f2942', fontWeight: '700', fontSize: '0.85rem' }}>Email Address</label>
              <div className="input-input-wrap">
                <Mail className="input-icon" size={18} style={{ color: '#64748b' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@drkhantravel.com"
                  className="form-input"
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    color: '#0f2942',
                    fontWeight: '500',
                    borderRadius: '0.85rem',
                    padding: '0.85rem 1rem 0.85rem 2.75rem'
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#0f2942', fontWeight: '700', fontSize: '0.85rem' }}>Password</label>
              <div className="input-input-wrap">
                <Lock className="input-icon" size={18} style={{ color: '#64748b' }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="form-input"
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    color: '#0f2942',
                    fontWeight: '500',
                    borderRadius: '0.85rem',
                    padding: '0.85rem 1rem 0.85rem 2.75rem'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-primary-btn full-width-btn"
              style={{
                marginTop: '0.75rem',
                padding: '0.9rem',
                borderRadius: '0.85rem',
                fontSize: '0.95rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#ffffff',
                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
                border: 'none'
              }}
            >
              {loading ? (
                <span className="btn-spinner-wrap">
                  <span className="spinner-dot"></span> Authenticating...
                </span>
              ) : (
                <>
                  <ShieldCheck size={18} /> Sign In
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '1.75rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <Lock size={13} />
            <span>SSL 256-Bit Encrypted Connection</span>
          </div>
        </div>
      </div>
    </div>
  );
}

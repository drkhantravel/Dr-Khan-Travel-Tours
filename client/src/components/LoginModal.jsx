import React, { useState } from 'react';
import { X, Lock, Mail, AlertCircle, ShieldCheck } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, apiUrl = 'http://localhost:5000' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

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
    <div className="modal-backdrop">
      <div 
        style={{
          background: '#ffffff',
          borderRadius: '2rem',
          padding: '2.5rem 2.25rem',
          boxShadow: '0 30px 80px -15px rgba(15, 41, 66, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.9)',
          width: '100%',
          maxWidth: '440px',
          boxSizing: 'border-box',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '9999px',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            cursor: 'pointer'
          }}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Header with Logo Only */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <img 
            src="/logo.png" 
            alt="Dr. Khan Travel & Tours" 
            style={{ height: '65px', objectFit: 'contain', margin: '0 auto 0.5rem auto', display: 'block' }}
          />
          <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '500', margin: 0 }}>
            Executive Authentication Gateway
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert-box error-alert" style={{ marginBottom: '1rem', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
            <AlertCircle size={18} className="alert-icon" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
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
              padding: '0.85rem',
              borderRadius: '0.85rem',
              fontSize: '0.925rem',
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

        <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
          <Lock size={13} />
          <span>SSL 256-Bit Encrypted Secure Connection</span>
        </div>
      </div>
    </div>
  );
}

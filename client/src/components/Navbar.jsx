import React from 'react';
import { Plane, Menu, User, ShieldCheck, LogOut } from 'lucide-react';

export default function Navbar({ onOpenMobileMenu, onOpenLoginModal, isAdmin, onOpenAdminView, onLogout, serverConfig }) {
  const logoUrl = serverConfig?.siteSettings?.logoUrl;
  const logoText = serverConfig?.siteSettings?.logoText || serverConfig?.siteSettings?.appName || 'Dr. Khan Travel';

  return (
    <header className="navbar-container">
      <nav className="glass-pill-nav">
        {/* Brand Logo (Server Controlled) */}
        <div className="brand-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          {logoUrl ? (
            <img src={logoUrl} alt={logoText} className="server-logo-img" />
          ) : (
            <div className="logo-badge">
              <Plane className="plane-icon" />
            </div>
          )}
          <span className="brand-name">{logoText}</span>
        </div>

        {/* Nav Links (Desktop) */}
        <div className="nav-items-desktop">
          <a href="#about" className="nav-item">About Us</a>
          <a href="#gallery" className="nav-item">Gallery</a>
        </div>

        {/* Actions (Login Button placed where Book Now was) */}
        <div className="nav-actions">
          {isAdmin ? (
            <div className="admin-logged-group desktop-only">
              <button onClick={onOpenAdminView} className="book-now-btn desktop-only admin-portal-pill-btn">
                <ShieldCheck size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Admin Portal
              </button>
              <button onClick={onLogout} className="logout-icon-btn" title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button onClick={onOpenLoginModal} className="book-now-btn desktop-only" id="nav-login-btn">
              <User size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Login
            </button>
          )}

          {/* Hamburger Button (Mobile) */}
          <button
            onClick={onOpenMobileMenu}
            className="hamburger-btn mobile-only"
            aria-label="Open menu"
          >
            <Menu style={{ width: '22px', height: '22px' }} />
          </button>
        </div>
      </nav>
    </header>
  );
}

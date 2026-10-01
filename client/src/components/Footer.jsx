import React from 'react';
import { Plane, Heart, ShieldCheck } from 'lucide-react';

export default function Footer({ onOpenLoginModal, isAdmin, onOpenAdminView, serverConfig }) {
  const logoText = serverConfig?.siteSettings?.appName || 'Dr. Khan Travel & Tours';

  return (
    <footer className="site-footer">
      <div className="section-container">
        <div className="footer-top-grid">
          <div className="footer-brand-col">
            <div className="brand-logo footer-logo">
              {serverConfig?.siteSettings?.logoUrl ? (
                <img src={serverConfig.siteSettings.logoUrl} alt={logoText} className="server-logo-img" />
              ) : (
                <div className="logo-badge">
                  <Plane className="plane-icon" />
                </div>
              )}
              <span className="brand-name">{logoText}</span>
            </div>
            <p className="footer-desc">
              Premier luxury travel and pilgrimage organization providing bespoke global itineraries, 5-star hotel accommodations, and executive concierge services.
            </p>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#about">About Our Heritage</a></li>
              <li><a href="#gallery">Travel Gallery</a></li>
            </ul>
          </div>

          <div className="footer-admin-col">
            <h4 className="footer-heading">Admin Operations</h4>
            <p className="footer-admin-text">
              Server environment authenticated portal for management.
            </p>
            {isAdmin ? (
              <button onClick={onOpenAdminView} className="submit-primary-btn footer-btn">
                <ShieldCheck size={16} /> Open Admin Portal
              </button>
            ) : (
              <button onClick={onOpenLoginModal} className="admin-nav-btn secondary-btn footer-btn">
                <ShieldCheck size={16} /> Admin Login
              </button>
            )}
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} Dr. Khan Travel & Tours. All Rights Reserved.</p>
          <p className="crafted-text">
            Server Authenticated Admin System • Environment (.env) Enabled
          </p>
        </div>
      </div>
    </footer>
  );
}

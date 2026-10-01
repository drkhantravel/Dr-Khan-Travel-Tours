import React from 'react';
import { Plane, X, User, Calendar, ShieldCheck, LogOut } from 'lucide-react';

export default function MobileDrawer({ isOpen, onClose, onOpenBookingModal, onOpenLoginModal, isAdmin, onOpenAdminView, onLogout }) {
  if (!isOpen) return null;

  return (
    <div className="mobile-drawer">
      <div className="drawer-header">
        <div className="brand-logo">
          <div className="logo-badge">
            <Plane className="plane-icon" />
          </div>
          <span className="brand-name">Dr. Khan Travel</span>
        </div>
        <button
          onClick={onClose}
          className="close-drawer-btn"
          aria-label="Close menu"
        >
          <X style={{ width: '22px', height: '22px' }} />
        </button>
      </div>

      <div className="drawer-links">
        <a href="#about" onClick={onClose} className="drawer-item">About Us</a>
        <a href="#gallery" onClick={onClose} className="drawer-item">Travel Gallery</a>
      </div>

      <div className="drawer-footer">
        {isAdmin ? (
          <div className="drawer-admin-buttons">
            <button
              onClick={() => {
                onClose();
                onOpenAdminView();
              }}
              className="submit-primary-btn full-width margin-bottom-sm"
            >
              <ShieldCheck size={18} /> Admin Dashboard
            </button>
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="admin-nav-btn danger-btn full-width"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              onClose();
              onOpenLoginModal();
            }}
            className="login-nav-btn full-width"
          >
            <User size={18} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Admin Login
          </button>
        )}
      </div>
    </div>
  );
}

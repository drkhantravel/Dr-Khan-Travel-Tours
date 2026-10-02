import React, { useState, useEffect } from 'react';
import { ArrowDown, ShieldCheck } from 'lucide-react';
import Navbar from './Navbar';
import MobileDrawer from './MobileDrawer';

export default function Hero({ onOpenBookingModal, onOpenLoginModal, isAdmin, onOpenAdminView, onLogout, serverConfig }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [mobileMenuOpen]);

  const scrollToAbout = () => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="hero-page-wrap">
      {/* Outer Ocean Background */}
      <img
        src="/hero-bg.jpg"
        alt="Outer ocean background"
        className="outer-ocean-bg"
      />
      {/* Vignette and Ambient Glow */}
      <div className="outer-ocean-vignette" />
      <div className="card-bottom-glow" />

      {/* Hero Window Frame Card */}
      <div className="hero-card-frame">
        {/* Card Background Image */}
        <img
          src="/hero-bg.jpg"
          alt="Aerial tropical island"
          className="card-bg-img"
        />

        {/* Ambient Dark Gradient */}
        <div className="card-overlay-gradient" />

        {/* Navbar Component (with Login in primary pill position & server-controlled logo) */}
        <Navbar
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenLoginModal={onOpenLoginModal}
          isAdmin={isAdmin}
          onOpenAdminView={onOpenAdminView}
          onLogout={onLogout}
          serverConfig={serverConfig}
        />

        {/* Mobile Menu Drawer Component */}
        <MobileDrawer
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          onOpenBookingModal={onOpenBookingModal}
          onOpenLoginModal={onOpenLoginModal}
          isAdmin={isAdmin}
          onOpenAdminView={onOpenAdminView}
          onLogout={onLogout}
        />

        {/* Hero Main Content Area */}
        <main className="hero-content-grid">
          {/* Left Headline */}
          <div className="headline-col">
            <h1 className="hero-title">
              {serverConfig?.siteSettings?.appName || 'Dr. Khan Travel & Tours'}
            </h1>
          </div>

          {/* Right Action & Scroll Button */}
          <div className="desc-col">
            <div className="hero-cta-group">
              <button
                className="scroll-icon-btn"
                aria-label="Scroll down to About section"
                onClick={scrollToAbout}
              >
                <ArrowDown style={{ width: '22px', height: '22px' }} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

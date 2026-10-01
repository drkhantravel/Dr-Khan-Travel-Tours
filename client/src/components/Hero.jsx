import React, { useState, useEffect } from 'react';
import { ArrowDown, Calendar, ShieldCheck } from 'lucide-react';
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
              Unforgettable<br />
              Travel Moments<br />
              by {serverConfig?.siteSettings?.appName || 'Dr. Khan Travel'}
            </h1>
          </div>

          {/* Right Description & Book Button + Scroll Button */}
          <div className="desc-col">
            <p className="hero-desc-text">
              We take you beyond the ordinary, to places where cultures come alive, landscapes leave you breathless, and every moment becomes a story to tell.
            </p>

            <div className="hero-cta-group">
              <button onClick={onOpenBookingModal} className="hero-book-cta-btn">
                <Calendar size={18} /> Book Tour Package
              </button>

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

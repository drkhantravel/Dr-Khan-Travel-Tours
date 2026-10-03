import React from 'react';
import { ArrowUp, ChevronRight } from 'lucide-react';

export default function Footer({ serverConfig }) {
  const logoText = serverConfig?.siteSettings?.appName || 'Dr. Khan Travel & Tours';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer light-theme">
      <div className="section-container">
        {/* Main Footer Grid */}
        <div className="footer-top-grid">
          {/* Col 1: Brand */}
          <div className="footer-brand-col">
            <div className="brand-logo footer-logo">
              <img 
                src="/logo.png" 
                alt={logoText} 
                className="footer-logo-img" 
              />
            </div>
            <p className="footer-desc">
              Founded and led by owner <strong>M. ARIF KHAN</strong>. Dedicated to offering the highest standard of luxury travel, custom tour packages, and round-the-clock client care.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Quick Navigation</h4>
            <ul className="footer-links">
              <li>
                <a href="#about"><ChevronRight size={14} className="link-arrow" /> About Our Heritage</a>
              </li>
              <li>
                <a href="#gallery"><ChevronRight size={14} className="link-arrow" /> Happy Client Gallery</a>
              </li>
              <li>
                <a href="#contact"><ChevronRight size={14} className="link-arrow" /> Contact & Reservations</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            © {new Date().getFullYear()} <strong>Dr. Khan Travel & Tours</strong>. All Rights Reserved.
          </div>

          <button onClick={scrollToTop} className="footer-back-to-top" aria-label="Back to top">
            <span>Back to top</span>
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
}

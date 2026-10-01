import React from 'react';
import { ShieldCheck, Compass, Headphones, ArrowRight } from 'lucide-react';
import StatsBar from './StatsBar';

export default function AboutSection() {
  return (
    <section id="about" className="about-section">
      {/* Top 4-Card Stats Bar */}
      <StatsBar />

      {/* Main About Dr Khan Content */}
      <div className="about-main-container">
        <div className="about-grid">
          {/* Left Column: Dual Overlapping Images */}
          <div className="about-images-column">
            <div className="main-yacht-card">
              <img
                src="https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=800&q=80"
                alt="Luxury yacht sunset cruise"
                className="yacht-img"
              />
              {/* Floating 100% Satisfaction Badge */}
              <div className="satisfaction-badge">
                <div className="check-badge-circle">
                  ✓
                </div>
                <div>
                  <div className="badge-stat-val">100%</div>
                  <div className="badge-stat-lbl">Satisfaction Assured</div>
                </div>
              </div>
            </div>

            {/* Overlapping Resort Image */}
            <div className="overlay-resort-card">
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=700&q=80"
                alt="Luxury alpine chalet resort"
                className="resort-img"
              />
            </div>
          </div>

          {/* Right Column: About Content */}
          <div className="about-content-column">
            <span className="about-pill-badge">ABOUT DR KHAN'S</span>

            <h2 className="about-main-heading">
              Your Trusted Partner for Every Extraordinary Journey
            </h2>

            <p className="about-paragraph">
              Founded under the visionary leadership of Dr. Khan, our agency has transformed luxury travel from ordinary itineraries into seamless, deeply personalized life experiences. We understand that your time is priceless and your expectations uncompromising.
            </p>

            <p className="about-paragraph">
              Whether securing coveted private flights, arranging expedited diplomatic-grade visas, or orchestrating private pilgrimages and serene family retreats, we manage every microscopic detail with precision and grace.
            </p>

            {/* Feature Cards Grid */}
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <ShieldCheck className="feature-icon" />
                </div>
                <div>
                  <h4 className="feature-title">Professional Travel Assistance</h4>
                  <p className="feature-desc">Licensed, accredited global ticketing network.</p>
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <Compass className="feature-icon" />
                </div>
                <div>
                  <h4 className="feature-title">Personalized Planning</h4>
                  <p className="feature-desc">Bespoke stays tailored to individual desires.</p>
                </div>
              </div>

              <div className="feature-card feature-card-full">
                <div className="feature-icon-wrapper">
                  <Headphones className="feature-icon" />
                </div>
                <div>
                  <h4 className="feature-title">Reliable 24/7 Concierge Support</h4>
                  <p className="feature-desc">Direct hotline access before, during, and after your trip.</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button className="heritage-btn">
              <span>Learn More About Our Heritage</span>
              <ArrowRight className="heritage-btn-arrow" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

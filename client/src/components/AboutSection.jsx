import React, { useState, useEffect } from 'react';
import { ShieldCheck, Compass, Headphones, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import StatsBar from './StatsBar';

const defaultSlides = [
  {
    id: "slide-1",
    imageUrl: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=800&q=80",
    caption: "Luxury Yacht Sunset Cruise"
  },
  {
    id: "slide-2",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    caption: "Alpine Chalet Sanctuary"
  },
  {
    id: "slide-3",
    imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80",
    caption: "Tropical Ocean Villa"
  },
  {
    id: "slide-4",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    caption: "Executive Spa Resort"
  }
];

export default function AboutSection({ apiUrl = 'http://localhost:5000' }) {
  const [slides, setSlides] = useState(defaultSlides);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch admin-uploaded slides from API
  useEffect(() => {
    fetch(`${apiUrl}/api/about-slides`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.slides && data.slides.length > 0) {
          setSlides(data.slides);
        }
      })
      .catch(() => {
        // Fallback default if server offline
      });
  }, [apiUrl]);

  // Auto-slide every 3 seconds (3000ms)
  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [slides]);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length);
  };

  const mainSlide = slides[currentIndex] || defaultSlides[0];
  const nextSlide = slides[(currentIndex + 1) % slides.length] || defaultSlides[1];

  return (
    <section id="about" className="about-section">
      {/* Top 4-Card Stats Bar */}
      <StatsBar />

      {/* Main About Dr Khan Content */}
      <div className="about-main-container">
        <div className="about-grid">
          {/* Left Column: Dual Overlapping Image Slider (3-sec auto slide) */}
          <div className="about-images-column">
            {/* Main Card */}
            <div className="main-yacht-card slider-card-frame">
              <img
                key={mainSlide.id || mainSlide.imageUrl}
                src={mainSlide.imageUrl}
                alt={mainSlide.caption || "About Dr Khan Travel"}
                className="yacht-img slide-fade-img"
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

              {/* Slider Controls Overlay */}
              {slides.length > 1 && (
                <div className="slider-nav-controls">
                  <button onClick={handlePrev} className="slider-arrow-btn" aria-label="Previous slide">
                    <ChevronLeft size={16} />
                  </button>
                  <div className="slider-dots-indicator">
                    {slides.map((_, idx) => (
                      <span
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`slider-dot ${idx === currentIndex ? 'active' : ''}`}
                      />
                    ))}
                  </div>
                  <button onClick={handleNext} className="slider-arrow-btn" aria-label="Next slide">
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Overlapping Secondary Card (Next Slide Preview) */}
            <div className="overlay-resort-card slider-overlay-frame" onClick={handleNext}>
              <img
                key={nextSlide.id || nextSlide.imageUrl}
                src={nextSlide.imageUrl}
                alt={nextSlide.caption || "Next Destination"}
                className="resort-img slide-fade-img"
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

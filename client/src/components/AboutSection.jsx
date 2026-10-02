import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
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
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);

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

  // Auto-slide every 4 seconds when playing
  useEffect(() => {
    if (slides.length <= 1 || !isAutoPlaying || lightboxOpen) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides, isAutoPlaying, lightboxOpen]);

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % slides.length);
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlide = slides[currentIndex] || defaultSlides[0];

  return (
    <section id="about" className="about-section">
      {/* Top 4-Card Stats Bar */}
      <StatsBar />

      {/* Main About Dr Khan Content in a Single Frame */}
      <div className="about-main-container">
        <div className="about-single-frame">
          <div className="about-grid">
            {/* Left Column: Modern Showcase Image Gallery */}
            <div className="about-gallery-wrapper">
              {/* Main Showcase Frame */}
              <div 
                className="gallery-main-frame"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                <img
                  key={currentSlide.id || currentSlide.imageUrl}
                  src={currentSlide.imageUrl}
                  alt={currentSlide.caption || "Dr. Khan Travel Showcase"}
                  className="gallery-main-img slide-fade-in"
                />

                {/* Slide Counter Pill */}
                <div className="gallery-counter-pill">
                  <span>{String(currentIndex + 1).padStart(2, '0')}</span>
                  <span className="counter-divider">/</span>
                  <span className="counter-total">{String(slides.length).padStart(2, '0')}</span>
                </div>

                {/* Navigation Arrows Overlay */}
                {slides.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrev} 
                      className="gallery-arrow-btn prev-btn"
                      aria-label="Previous Slide"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={handleNext} 
                      className="gallery-arrow-btn next-btn"
                      aria-label="Next Slide"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Lightbox Trigger */}
                <button 
                  className="gallery-zoom-trigger"
                  onClick={() => setLightboxOpen(true)}
                  title="Expand Fullscreen"
                  aria-label="Expand Fullscreen"
                >
                  <Maximize2 size={18} />
                </button>

                {/* Auto Progress Bar */}
                {isAutoPlaying && slides.length > 1 && (
                  <div className="gallery-progress-track">
                    <div className="gallery-progress-bar-fill" key={currentIndex}></div>
                  </div>
                )}
              </div>

              {/* Thumbnail Navigation Bar */}
              {slides.length > 1 && (
                <div className="gallery-thumbnails-row">
                  {slides.map((slide, idx) => (
                    <button
                      key={slide.id || idx}
                      className={`gallery-thumb-card ${idx === currentIndex ? 'active' : ''}`}
                      onClick={() => setCurrentIndex(idx)}
                      title={slide.caption || `Slide ${idx + 1}`}
                    >
                      <img src={slide.imageUrl} alt={slide.caption || `Thumbnail ${idx + 1}`} />
                      {idx === currentIndex && <span className="thumb-active-indicator"></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: About Content */}
            <div className="about-content-column">
              <h2 className="about-main-heading">
                About Dr. Khan's Travel & Tours
              </h2>

              <p className="about-paragraph">
                Founded and led by owner <strong>M. ARIF KHAN</strong>, Dr. Khan's Travel & Tours brings over <strong>7+ years of professional expertise</strong> in luxury travel, ticketing, and custom tours. 
              </p>

              <p className="about-paragraph">
                Having served more than <strong>1,000+ happy clients</strong>, M. Arif Khan is committed to offering the highest standard of service — contributing <strong>24/7 with total dedication and passion</strong> for every client's happiness.
              </p>

            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className="gallery-lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <button className="lightbox-close-trigger" onClick={() => setLightboxOpen(false)}>
            <X size={26} />
          </button>
          
          <div className="lightbox-image-box" onClick={e => e.stopPropagation()}>
            <img 
              src={currentSlide.imageUrl} 
              alt={currentSlide.caption || "Full view"} 
              className="lightbox-img" 
            />
            {currentSlide.caption && (
              <div className="lightbox-caption-bar">{currentSlide.caption}</div>
            )}

            {slides.length > 1 && (
              <>
                <button className="lightbox-arrow-btn prev" onClick={handlePrev}>
                  <ChevronLeft size={28} />
                </button>
                <button className="lightbox-arrow-btn next" onClick={handleNext}>
                  <ChevronRight size={28} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

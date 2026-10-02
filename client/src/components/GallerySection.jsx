import React, { useState, useEffect } from 'react';
import { X, ZoomIn, Camera, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_SLIDE = 6;

export default function GallerySection({ apiUrl = 'http://localhost:5000' }) {
  const [items, setItems] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Fetch admin-uploaded Happy Client Gallery items from API
  useEffect(() => {
    fetch(`${apiUrl}/api/client-gallery`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.items)) {
          setItems(data.items);
        }
      })
      .catch(() => {});
  }, [apiUrl]);

  const totalSlides = Math.ceil(items.length / ITEMS_PER_SLIDE) || 1;

  // Auto-slide every 4.5 seconds if totalSlides > 1 and auto-playing
  useEffect(() => {
    if (items.length <= ITEMS_PER_SLIDE || !isAutoSliding || selectedImageIndex !== null) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % totalSlides);
    }, 4500);

    return () => clearInterval(timer);
  }, [items.length, totalSlides, isAutoSliding, selectedImageIndex]);

  const handlePrevSlide = () => {
    setCurrentSlideIndex(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex(prev => (prev + 1) % totalSlides);
  };

  // Get current 6 items for the active slide group
  const visibleItems = items.slice(
    currentSlideIndex * ITEMS_PER_SLIDE,
    (currentSlideIndex + 1) * ITEMS_PER_SLIDE
  );

  // Lightbox handlers
  const handleOpenLightbox = (indexInVisible) => {
    const globalIdx = currentSlideIndex * ITEMS_PER_SLIDE + indexInVisible;
    setSelectedImageIndex(globalIdx);
  };

  const handlePrevLightbox = (e) => {
    e?.stopPropagation();
    if (selectedImageIndex === null) return;
    setSelectedImageIndex(prev => (prev - 1 + items.length) % items.length);
  };

  const handleNextLightbox = (e) => {
    e?.stopPropagation();
    if (selectedImageIndex === null) return;
    setSelectedImageIndex(prev => (prev + 1) % items.length);
  };

  const currentLightboxItem = selectedImageIndex !== null ? items[selectedImageIndex] : null;

  return (
    <section id="gallery" className="gallery-section">
      <div className="gallery-container">
        {/* Header Bar */}
        <div className="gallery-header-bar">
          <div className="gallery-title-group">
            <span className="gallery-badge-pill">
              <Camera size={14} style={{ marginRight: '6px' }} />
              HAPPY CLIENT MOMENTS
            </span>
            <h2 className="gallery-main-heading">Happy Client Gallery</h2>
          </div>

          {/* Slider Controls (Manual Next / Prev & Page Counter) */}
          {totalSlides > 1 && (
            <div className="gallery-slider-controls">
              <span className="gallery-slide-counter">
                {String(currentSlideIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
              </span>
              <button 
                onClick={handlePrevSlide} 
                className="gallery-nav-arrow-btn"
                aria-label="Previous 6 Photos"
                title="Previous 6 Photos"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={handleNextSlide} 
                className="gallery-nav-arrow-btn"
                aria-label="Next 6 Photos"
                title="Next 6 Photos"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Photo Grid or Empty State */}
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#ffffff', borderRadius: '1.25rem', border: '1px dashed #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <Camera size={44} style={{ color: '#94a3b8', marginBottom: '0.75rem' }} />
            <h3 style={{ color: '#1e293b', fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.35rem' }}>No Client Photos Uploaded Yet</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Photos uploaded from the Admin Dashboard will appear here automatically.</p>
          </div>
        ) : (
          <div 
            className="gallery-slider-frame"
            onMouseEnter={() => setIsAutoSliding(false)}
            onMouseLeave={() => setIsAutoSliding(true)}
          >
            {/* 6-Photo Grid per Slide Page */}
            <div className="gallery-grid slide-fade-in" key={currentSlideIndex}>
              {visibleItems.map((item, idx) => (
                <div
                  key={item.id || item.image || idx}
                  className="gallery-card-item pure-image-card"
                  onClick={() => handleOpenLightbox(idx)}
                >
                  <img
                    src={item.image}
                    alt="Happy Client Photo"
                    className="gallery-img"
                    loading="lazy"
                  />
                  
                  {/* Clean Zoom Badge Overlay (Pure Image Focus) */}
                  <div className="gallery-card-overlay clean-overlay">
                    <div className="gallery-zoom-badge center-zoom">
                      <ZoomIn size={22} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots Indicator */}
            {totalSlides > 1 && (
              <div className="gallery-pagination-dots">
                {Array.from({ length: totalSlides }).map((_, pageIdx) => (
                  <button
                    key={pageIdx}
                    onClick={() => setCurrentSlideIndex(pageIdx)}
                    className={`gallery-dot-btn ${pageIdx === currentSlideIndex ? 'active' : ''}`}
                    aria-label={`Go to photo group ${pageIdx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal (Clean View - Photos Only) */}
      {currentLightboxItem && (
        <div className="lightbox-modal-backdrop" onClick={() => setSelectedImageIndex(null)}>
          <div className="lightbox-content-card clean-lightbox" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close-btn"
              onClick={() => setSelectedImageIndex(null)}
              aria-label="Close image preview"
            >
              <X size={24} />
            </button>

            <img
              src={currentLightboxItem.image}
              alt="Happy Client Full View"
              className="lightbox-full-img"
            />

            {items.length > 1 && (
              <>
                <button className="lightbox-arrow-btn prev" onClick={handlePrevLightbox} aria-label="Previous photo">
                  <ChevronLeft size={28} />
                </button>
                <button className="lightbox-arrow-btn next" onClick={handleNextLightbox} aria-label="Next photo">
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

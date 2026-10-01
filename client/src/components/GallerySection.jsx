import React, { useState } from 'react';
import { X, ZoomIn, Sparkles, Camera } from 'lucide-react';

const galleryItems = [
  {
    id: 1,
    title: "Maldives Overwater Sanctuary",
    category: "RESORTS",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1000&q=80",
    subtitle: "Tropical Villa & Turquoise Lagoon"
  },
  {
    id: 2,
    title: "Executive Private Jet Interior",
    category: "AIRLINES & JETS",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80",
    subtitle: "Diplomatic VIP Luxury Travel"
  },
  {
    id: 3,
    title: "Experience the Magic of Santorini",
    category: "DESTINATIONS",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1000&q=80",
    subtitle: "Caldera Sunset & Infinity Pool"
  },
  {
    id: 4,
    title: "Historic Istanbul Mosque Illuminations",
    category: "DESTINATIONS",
    image: "https://images.unsplash.com/photo-1527838832700-548952f12098?auto=format&fit=crop&w=1000&q=80",
    subtitle: "Bosphorus Night Vista"
  },
  {
    id: 5,
    title: "Kruger Wilderness Safari Lodge",
    category: "RESORTS",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1000&q=80",
    subtitle: "African Sunset & Wildlife Retreat"
  },
  {
    id: 6,
    title: "High Altitude Alpine Wing View",
    category: "AIRLINES & JETS",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1000&q=80",
    subtitle: "Scenic Swiss Alps Flight Route"
  }
];

const categories = ["ALL", "DESTINATIONS", "AIRLINES & JETS", "RESORTS"];

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredItems = activeCategory === "ALL" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <section id="gallery" className="gallery-section">
      <div className="gallery-container">
        {/* Header Bar */}
        <div className="gallery-header-bar">
          <div className="gallery-title-group">
            <span className="gallery-badge-pill">
              <Camera size={14} style={{ marginRight: '6px' }} />
              MOMENTS CAPTURED
            </span>
            <h2 className="gallery-main-heading">Travel Gallery</h2>
          </div>

          {/* Filter Tabs */}
          <div className="gallery-filter-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`gallery-filter-btn ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3x2 Photo Grid */}
        <div className="gallery-grid">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="gallery-card-item"
              onClick={() => setSelectedImage(item)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="gallery-img"
                loading="lazy"
              />
              
              {/* Subtle Ambient Vignette & Overlay info */}
              <div className="gallery-card-overlay">
                <div className="gallery-zoom-badge">
                  <ZoomIn size={18} />
                </div>
                <div className="gallery-card-info">
                  <span className="gallery-card-cat">{item.category}</span>
                  <h4 className="gallery-card-title">{item.title}</h4>
                  <p className="gallery-card-sub">{item.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="lightbox-modal-backdrop" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-content-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close-btn"
              onClick={() => setSelectedImage(null)}
              aria-label="Close image preview"
            >
              <X size={22} />
            </button>
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="lightbox-full-img"
            />
            <div className="lightbox-caption">
              <div className="lightbox-cat-badge">{selectedImage.category}</div>
              <h3>{selectedImage.title}</h3>
              <p>{selectedImage.subtitle}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

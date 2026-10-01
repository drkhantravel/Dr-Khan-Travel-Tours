import React from 'react';
import { Compass } from 'lucide-react';

export default function DestinationsSection({ destinations = [], onSelectCategory }) {
  return (
    <section id="destinations" className="destinations-section">
      <div className="section-container">
        <div className="section-header-center">
          <span className="about-pill-badge">Global Destinations</span>
          <h2 className="section-title">World's Most Captivating Places</h2>
          <p className="section-subtitle">
            From holy sanctuaries in Makkah to Swiss Alpine peaks and tropical Indonesian villas.
          </p>
        </div>

        <div className="destinations-grid">
          {destinations.map(dest => (
            <div key={dest.id} className="destination-card">
              <img src={dest.image} alt={dest.name} className="dest-bg-img" />
              <div className="dest-overlay-gradient" />

              <div className="dest-card-content">
                <span className="dest-category-pill">{dest.category}</span>
                <h3 className="dest-title">{dest.name}</h3>
                <span className="dest-tours-count"><Compass size={14} /> {dest.toursCount} Available Tours</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

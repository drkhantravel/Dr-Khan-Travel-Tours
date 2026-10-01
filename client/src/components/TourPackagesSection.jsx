import React, { useState } from 'react';
import { MapPin, Calendar, Star, CheckCircle, ArrowRight, Plane } from 'lucide-react';

export default function TourPackagesSection({ tours = [], onSelectTourForBooking }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Pilgrimage', 'Europe', 'Culture', 'Luxury', 'Adventure', 'Honeymoon'];

  const filteredTours = selectedCategory === 'All' 
    ? tours 
    : tours.filter(t => t.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <section id="packages" className="packages-section">
      <div className="section-container">
        <div className="section-header-center">
          <span className="about-pill-badge">Curated Itineraries</span>
          <h2 className="section-title">Explore Featured Travel Packages</h2>
          <p className="section-subtitle">
            Handcrafted travel experiences with 5-star accommodations, private transportation, and 24/7 dedicated concierges.
          </p>

          {/* Category Filter Pills */}
          <div className="category-filter-bar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Packages Grid */}
        <div className="packages-grid">
          {filteredTours.map(tour => (
            <div key={tour.id} className="package-card glass-card">
              {/* Image & Badges */}
              <div className="card-img-container">
                <img src={tour.image} alt={tour.title} className="package-img" />
                <span className="package-badge">{tour.badge || tour.category}</span>
                <div className="package-rating-tag">
                  <Star size={14} className="star-filled" />
                  <span>{tour.rating} ({tour.reviewsCount})</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="card-body-content">
                <div className="card-meta-row">
                  <span className="card-dest"><MapPin size={15} /> {tour.destination}</span>
                  <span className="card-duration"><Calendar size={15} /> {tour.duration}</span>
                </div>

                <h3 className="package-card-title">{tour.title}</h3>
                <p className="package-card-desc">{tour.description}</p>

                {/* Included Highlights */}
                {tour.highlights && (
                  <ul className="highlights-list">
                    {tour.highlights.slice(0, 3).map((h, i) => (
                      <li key={i}><CheckCircle size={14} className="check-icon" /> {h}</li>
                    ))}
                  </ul>
                )}

                {/* Footer Price + Book Button */}
                <div className="package-card-footer">
                  <div className="price-wrap">
                    <span className="price-label">Starting from</span>
                    <span className="price-amount">${tour.price.toLocaleString()} <small>/ person</small></span>
                  </div>

                  <button
                    onClick={() => onSelectTourForBooking(tour)}
                    className="card-book-btn"
                  >
                    <Plane size={16} /> Book Package
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

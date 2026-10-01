import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsSection({ testimonials = [] }) {
  return (
    <section id="testimonials" className="testimonials-section">
      <div className="section-container">
        <div className="section-header-center">
          <span className="about-pill-badge">Traveler Stories</span>
          <h2 className="section-title">What Our Guests Say</h2>
          <p className="section-subtitle">
            Over 18,500+ satisfied travelers have experienced unforgettable moments with Dr. Khan Travel & Tours.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map(t => (
            <div key={t.id} className="testimonial-card glass-card">
              <Quote className="quote-icon" size={32} />

              <div className="star-rating-row">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <Star key={i} size={16} className="star-filled" />
                ))}
              </div>

              <p className="testimonial-comment">"{t.comment}"</p>

              <div className="testimonial-author">
                <img src={t.avatar} alt={t.name} className="author-avatar" />
                <div>
                  <h4 className="author-name">{t.name}</h4>
                  <span className="author-role">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { Award, Smile, Globe, Headphones } from 'lucide-react';

export default function StatsBar() {
  return (
    <div className="stats-container">
      <div className="stats-grid">
        {/* Card 1 */}
        <div className="stat-card">
          <div className="stat-icon-badge icon-badge-gold">
            <Award className="stat-icon" size={22} />
          </div>
          <div className="stat-text-wrap">
            <span className="stat-number">7+</span>
            <span className="stat-label">Years of Prestige</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="stat-card">
          <div className="stat-icon-badge icon-badge-blue">
            <Smile className="stat-icon" size={22} />
          </div>
          <div className="stat-text-wrap">
            <span className="stat-number">1,000+</span>
            <span className="stat-label">Happy Travelers</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="stat-card">
          <div className="stat-icon-badge icon-badge-emerald">
            <Globe className="stat-icon" size={22} />
          </div>
          <div className="stat-text-wrap">
            <span className="stat-number">50+</span>
            <span className="stat-label">Global Destinations</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="stat-card">
          <div className="stat-icon-badge icon-badge-violet">
            <Headphones className="stat-icon" size={22} />
          </div>
          <div className="stat-text-wrap">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Dedicated Support</span>
          </div>
        </div>
      </div>
    </div>
  );
}

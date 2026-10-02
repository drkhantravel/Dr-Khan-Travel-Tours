import React from 'react';
import { Award, Smile, Globe, Headphones } from 'lucide-react';

export default function StatsBar() {
  return (
    <div className="stats-container">
      <div className="stats-grid">
        {/* Card 1 */}
        <div className="stat-card">
          <div className="stat-icon-badge icon-badge-gold">
            <Award className="stat-icon" />
          </div>
          <div className="stat-text-wrap">
            <span className="stat-number">7+</span>
            <span className="stat-label">YEARS OF PRESTIGE</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="stat-card">
          <div className="stat-icon-badge icon-badge-blue">
            <Smile className="stat-icon" />
          </div>
          <div className="stat-text-wrap">
            <span className="stat-number">1,000+</span>
            <span className="stat-label">HAPPY TRAVELERS</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="stat-card">
          <div className="stat-icon-badge icon-badge-emerald">
            <Globe className="stat-icon" />
          </div>
          <div className="stat-text-wrap">
            <span className="stat-number">50+</span>
            <span className="stat-label">GLOBAL DESTINATIONS</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="stat-card">
          <div className="stat-icon-badge icon-badge-violet">
            <Headphones className="stat-icon" />
          </div>
          <div className="stat-text-wrap">
            <span className="stat-number">24/7</span>
            <span className="stat-label">DEDICATED SUPPORT</span>
          </div>
        </div>
      </div>
    </div>
  );
}

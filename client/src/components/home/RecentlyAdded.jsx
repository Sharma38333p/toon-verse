import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import CartoonCard from '../common/CartoonCard';
import './TrendingSection.css'; // Reuses grid and header styles

function RecentlyAdded({ cartoons = [], onPlayTrailer, onDownload }) {
  if (!cartoons || cartoons.length === 0) return null;

  return (
    <section className="section recently-added-section">
      <div className="container">
        <div className="section-header">
          <div className="section-title-wrap">
            <h2 className="section-title">
              <span className="section-icon-wrap section-icon-wrap--sparkle">
                <Sparkles size={24} />
              </span>
              <span>New Releases & Episodes</span>
            </h2>
            <p className="section-subtitle">Fresh cartoon arrivals, remastered seasons, and brand new episodes</p>
          </div>

          <Link to="/search?sort=year" className="section-view-all">
            <span>See What's New</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="cartoons-grid">
          {cartoons.slice(0, 5).map((cartoon) => (
            <CartoonCard
              key={cartoon._id || cartoon.id}
              cartoon={cartoon}
              isNew={true}
              onPlayTrailer={onPlayTrailer}
              onDownload={onDownload}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default RecentlyAdded;

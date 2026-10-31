import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowRight } from 'lucide-react';
import CartoonCard from '../common/CartoonCard';
import './TrendingSection.css';

function TrendingSection({ cartoons = [], onPlayTrailer, onDownload }) {
  if (!cartoons || cartoons.length === 0) return null;

  return (
    <section className="section trending-section">
      <div className="container">
        <div className="section-header">
          <div className="section-title-wrap">
            <h2 className="section-title">
              <span className="section-icon-wrap section-icon-wrap--flame">
                <Flame size={24} />
              </span>
              <span>Trending Cartoons</span>
            </h2>
            <p className="section-subtitle">The most popular animated hits streaming right now</p>
          </div>

          <Link to="/search?sort=popular" className="section-view-all">
            <span>Explore All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="cartoons-grid">
          {cartoons.slice(0, 10).map((cartoon) => (
            <CartoonCard
              key={cartoon._id || cartoon.id}
              cartoon={cartoon}
              onPlayTrailer={onPlayTrailer}
              onDownload={onDownload}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrendingSection;

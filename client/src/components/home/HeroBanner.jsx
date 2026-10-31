import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Download, Info, Star, Calendar, Tv, Layers } from 'lucide-react';
import './HeroBanner.css';

function HeroBanner({ cartoon, onPlayTrailer, onDownload }) {
  const navigate = useNavigate();

  if (!cartoon) return null;

  const handleDetailsClick = () => {
    navigate(`/cartoon/${cartoon.slug || cartoon._id || cartoon.id}`);
  };

  return (
    <section className="hero-banner">
      {/* Background Banner with Gradient Overlays */}
      <div className="hero-banner__bg-wrapper">
        <img
          src={cartoon.banner || cartoon.poster}
          alt={cartoon.title}
          className="hero-banner__bg-img"
        />
        <div className="hero-banner__gradient-overlay" />
        <div className="hero-banner__vignette" />

        {/* Floating Geometric Decorative Elements */}
        <div className="geo-element geo-element--circle-1" />
        <div className="geo-element geo-element--circle-2" />
        <div className="geo-element geo-element--square" />
      </div>

      <div className="container hero-banner__content">
        <div className="hero-banner__inner">
          <div className="hero-banner__badges">
            <span className="hero-badge hero-badge--network">{cartoon.network}</span>
            <span className="hero-badge hero-badge--featured">🔥 Featured Pick</span>
          </div>

          <h1 className="hero-banner__title">{cartoon.title}</h1>

          <div className="hero-banner__stats">
            <div className="stat-item stat-item--rating">
              <Star size={16} fill="var(--color-accent)" color="var(--color-accent)" />
              <span>{cartoon.rating}/10</span>
            </div>
            <div className="stat-item">
              <Calendar size={15} />
              <span>{cartoon.year}</span>
            </div>
            <div className="stat-item">
              <Tv size={15} />
              <span>{cartoon.seasons || 3} Seasons</span>
            </div>
            <div className="stat-item">
              <Layers size={15} />
              <span>{cartoon.episodes || 46} Episodes</span>
            </div>
          </div>

          <p className="hero-banner__description">{cartoon.description}</p>

          <div className="hero-banner__categories">
            {cartoon.categories?.map((cat) => (
              <span key={cat} className="hero-cat-pill">
                {cat}
              </span>
            ))}
          </div>

          <div className="hero-banner__actions">
            <button
              className="hero-btn hero-btn--trailer"
              onClick={() => onPlayTrailer && onPlayTrailer(cartoon)}
            >
              <Play size={18} fill="#fff" />
              <span>Watch Trailer</span>
            </button>

            <button
              className="hero-btn hero-btn--download"
              onClick={() => onDownload && onDownload(cartoon)}
            >
              <Download size={18} />
              <span>Download Episodes</span>
            </button>

            <button className="hero-btn hero-btn--details" onClick={handleDetailsClick}>
              <Info size={18} />
              <span>View Details</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;

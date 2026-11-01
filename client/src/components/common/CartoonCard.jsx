import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, Play, Download } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import './CartoonCard.css';

function CartoonCard({ cartoon, onPlayTrailer, onDownload, isNew }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imgError, setImgError] = useState(false);

  const cartoonId = cartoon._id || cartoon.id;
  const favorited = isFavorite(cartoonId);

  const handleClick = () => {
    const slug = cartoon.slug || cartoonId;
    navigate(`/cartoon/${slug}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(cartoon);
  };

  const handleTrailerClick = (e) => {
    e.stopPropagation();
    if (onPlayTrailer) onPlayTrailer(cartoon);
  };

  const handleDownloadClick = (e) => {
    e.stopPropagation();
    if (onDownload) onDownload(cartoon);
  };

  const fallbackBackground = `linear-gradient(135deg, hsl(${((cartoon.title?.length || 5) * 45) % 360}, 65%, 28%), hsl(${((cartoon.title?.length || 5) * 45 + 50) % 360}, 70%, 15%))`;

  return (
    <div className="cartoon-card" onClick={handleClick}>
      <div className="cartoon-card__poster-wrapper">
        {!imgError && cartoon.poster ? (
          <img
            src={cartoon.poster}
            alt={cartoon.title}
            className="cartoon-card__poster"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="cartoon-card__placeholder" style={{ background: fallbackBackground }}>
            <span className="placeholder-emoji">🎬</span>
            <span className="placeholder-title">{cartoon.title}</span>
          </div>
        )}

        <div className="cartoon-card__overlay">
          {onPlayTrailer && (
            <button className="card-quick-action-btn" onClick={handleTrailerClick} title="Watch Trailer">
              <Play size={18} fill="#fff" />
            </button>
          )}
          {onDownload && (
            <button className="card-quick-action-btn" onClick={handleDownloadClick} title="Download">
              <Download size={18} />
            </button>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          className={`cartoon-card__fav-btn ${favorited ? 'cartoon-card__fav-btn--active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={18} fill={favorited ? 'var(--color-danger)' : 'none'} color={favorited ? 'var(--color-danger)' : '#fff'} />
        </button>

        {/* NEW Badge */}
        {(isNew || cartoon.isRecentlyAdded) && (
          <span className="cartoon-card__badge-new">NEW</span>
        )}

        {/* Rating badge */}
        <div className="cartoon-card__rating">
          <Star size={12} fill="var(--color-accent)" color="var(--color-accent)" />
          <span>{cartoon.rating || 8.5}</span>
        </div>
      </div>

      <div className="cartoon-card__info">
        <span className="cartoon-card__network">{cartoon.network}</span>
        <h3 className="cartoon-card__title" title={cartoon.title} aria-label={cartoon.title}>
          <span className="cartoon-card__title-track" aria-hidden="true">
            <span>{cartoon.title}</span>
            <span>{cartoon.title}</span>
          </span>
        </h3>
        <div className="cartoon-card__meta">
          <span className="cartoon-card__year">{cartoon.year}</span>
          {cartoon.categories && cartoon.categories[0] && (
            <span className="cartoon-card__category">{cartoon.categories[0]}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartoonCard;

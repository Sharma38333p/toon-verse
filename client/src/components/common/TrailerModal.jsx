import React, { useEffect } from 'react';
import { X, Play } from 'lucide-react';
import './TrailerModal.css';

function TrailerModal({ isOpen, onClose, cartoon }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !cartoon) return null;

  const trailerId = cartoon.youtubeTrailerId || 'wN4C5UJjHd0';

  return (
    <div className="trailer-modal-backdrop" onClick={onClose}>
      <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="trailer-modal-header">
          <div className="trailer-modal-title-group">
            <span className="trailer-modal-badge">{cartoon.network}</span>
            <h3 className="trailer-modal-title">{cartoon.title} — Official Trailer</h3>
          </div>
          <button className="trailer-modal-close" onClick={onClose} aria-label="Close trailer">
            <X size={22} />
          </button>
        </div>

        <div className="trailer-modal-video-wrapper">
          <iframe
            src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&rel=0&modestbranding=1`}
            title={`${cartoon.title} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="trailer-modal-footer">
          <div className="trailer-modal-meta">
            <span>⭐ {cartoon.rating}/10</span>
            <span>📅 {cartoon.year}</span>
            <span>🎬 {cartoon.episodes || 26} Episodes</span>
          </div>
          <p className="trailer-modal-desc">{cartoon.description}</p>
        </div>
      </div>
    </div>
  );
}

export default TrailerModal;

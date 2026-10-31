import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Film, ArrowRight } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { api } from '../services/api';
import CartoonCard from '../components/common/CartoonCard';
import TrailerModal from '../components/common/TrailerModal';
import DownloadModal from '../components/common/DownloadModal';
import './NetworksPage.css';

function FavoritesPage() {
  const { favorites } = useFavorites();
  const [allCartoons, setAllCartoons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTrailer, setActiveTrailer] = useState(null);
  const [activeDownload, setActiveDownload] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.getAllCartoons()
      .then((res) => {
        if (res?.success && res.cartoons) {
          setAllCartoons(res.cartoons);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const favoriteCartoons = allCartoons.filter(c =>
    favorites.includes(c._id) || favorites.includes(c.id) || favorites.includes(c.slug)
  );

  return (
    <div className="networks-page">
      <div className="container">
        <div className="networks-header">
          <div className="networks-title-badge" style={{ color: 'var(--color-danger)', borderColor: 'rgba(255, 107, 107, 0.4)' }}>
            <Heart size={18} fill="var(--color-danger)" /> Personal Watchlist & Bookmarks
          </div>
          <h1 className="networks-title">My Favorite Cartoons</h1>
          <p className="networks-subtitle">
            Your hand-picked collection of animated series saved for quick access and downloads
          </p>
        </div>

        {loading ? (
          <div className="detail-loading-view">
            <div className="loading-spinner" />
            <p>Loading your saved favorites...</p>
          </div>
        ) : favoriteCartoons.length === 0 ? (
          <div className="detail-not-found" style={{ minHeight: '40vh', padding: '40px', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)' }}>
            <Heart size={54} color="var(--color-danger)" />
            <h2>No favorites saved yet</h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '420px', textAlign: 'center' }}>
              Browse the ToonVerse library and click the heart icon on any cartoon card to save it here!
            </p>
            <Link to="/search" className="section-view-all">
              <span>Discover Cartoons</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="cartoons-grid">
            {favoriteCartoons.map((cartoon) => (
              <CartoonCard
                key={cartoon._id || cartoon.id}
                cartoon={cartoon}
                onPlayTrailer={(c) => setActiveTrailer(c)}
                onDownload={(c) => setActiveDownload(c)}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        <TrailerModal
          isOpen={Boolean(activeTrailer)}
          onClose={() => setActiveTrailer(null)}
          cartoon={activeTrailer}
        />
        <DownloadModal
          isOpen={Boolean(activeDownload)}
          onClose={() => setActiveDownload(null)}
          cartoon={activeDownload}
        />
      </div>
    </div>
  );
}

export default FavoritesPage;

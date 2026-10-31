import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categories } from '../data/cartoons';
import { api } from '../services/api';
import CartoonCard from '../components/common/CartoonCard';
import TrailerModal from '../components/common/TrailerModal';
import DownloadModal from '../components/common/DownloadModal';
import { ChevronLeft, Film } from 'lucide-react';
import './NetworksPage.css';

function CategoryDetailPage() {
  const { categoryId } = useParams();
  const [cartoons, setCartoons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTrailer, setActiveTrailer] = useState(null);
  const [activeDownload, setActiveDownload] = useState(null);

  const categoryInfo = categories.find(c => c.id === categoryId) || {
    id: categoryId,
    name: categoryId.replace('-', ' ').toUpperCase(),
    icon: '🎬',
    color: '#6C5CE7',
  };

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);

    api.getAllCartoons({ category: categoryInfo.name })
      .then((res) => {
        if (res?.success && res.cartoons) {
          const filtered = res.cartoons.filter(c =>
            c.categories?.some(cat => cat.toLowerCase().includes(categoryInfo.name.toLowerCase()) || cat.toLowerCase().includes(categoryId.replace('-', ' ')))
          );
          setCartoons(filtered.length > 0 ? filtered : res.cartoons);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [categoryId, categoryInfo.name]);

  return (
    <div className="networks-page">
      <div className="container">
        <Link to="/categories" className="detail-back-link">
          <ChevronLeft size={18} /> All Categories
        </Link>

        <div className="networks-header" style={{ '--network-accent': categoryInfo.color }}>
          <div className="networks-title-badge" style={{ color: categoryInfo.color, borderColor: categoryInfo.color }}>
            <span>{categoryInfo.icon}</span> Genre Showcase
          </div>
          <h1 className="networks-title">{categoryInfo.name}</h1>
          <p className="networks-subtitle">
            Cartoons categorized under {categoryInfo.name} with instant streaming and high-speed downloads
          </p>
        </div>

        {loading ? (
          <div className="detail-loading-view">
            <div className="loading-spinner" />
            <p>Loading {categoryInfo.name} cartoons...</p>
          </div>
        ) : cartoons.length === 0 ? (
          <div className="detail-not-found">
            <Film size={48} color="var(--color-text-muted)" />
            <p>No cartoons found in this category.</p>
            <Link to="/search" className="section-view-all">Explore All Cartoons</Link>
          </div>
        ) : (
          <div className="cartoons-grid">
            {cartoons.map((cartoon) => (
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

export default CategoryDetailPage;

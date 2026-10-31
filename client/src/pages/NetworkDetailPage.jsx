import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { networks } from '../data/cartoons';
import { api } from '../services/api';
import CartoonCard from '../components/common/CartoonCard';
import TrailerModal from '../components/common/TrailerModal';
import DownloadModal from '../components/common/DownloadModal';
import { ChevronLeft, Tv, Film } from 'lucide-react';
import './NetworksPage.css';

function NetworkDetailPage() {
  const { networkId } = useParams();
  const [cartoons, setCartoons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTrailer, setActiveTrailer] = useState(null);
  const [activeDownload, setActiveDownload] = useState(null);

  const networkInfo = networks.find(n => n.id === networkId) || {
    id: networkId,
    name: networkId.replace('-', ' ').toUpperCase(),
    color: '#6C5CE7',
  };

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);

    api.getAllCartoons({ network: networkId })
      .then((res) => {
        if (res?.success && res.cartoons) {
          // If returned cartoons aren't filtered by network locally, filter here
          const filtered = res.cartoons.filter(c =>
            c.networkId === networkId ||
            c.network?.toLowerCase().includes(networkId.replace('-', ' ').toLowerCase())
          );
          setCartoons(filtered.length > 0 ? filtered : res.cartoons);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [networkId]);

  return (
    <div className="networks-page">
      <div className="container">
        <Link to="/networks" className="detail-back-link">
          <ChevronLeft size={18} /> All Networks
        </Link>

        <div className="networks-header" style={{ '--network-accent': networkInfo.color }}>
          <div className="networks-title-badge" style={{ color: networkInfo.color, borderColor: networkInfo.color }}>
            <Tv size={18} /> Network Broadcast Channel
          </div>
          <h1 className="networks-title">{networkInfo.name}</h1>
          <p className="networks-subtitle">
            Showing all streaming series, movies, and episodes broadcasted by {networkInfo.name}
          </p>
        </div>

        {loading ? (
          <div className="detail-loading-view">
            <div className="loading-spinner" />
            <p>Loading {networkInfo.name} cartoons...</p>
          </div>
        ) : cartoons.length === 0 ? (
          <div className="detail-not-found">
            <Film size={48} color="var(--color-text-muted)" />
            <p>No cartoons found for this network yet.</p>
            <Link to="/search" className="section-view-all">Browse All Cartoons</Link>
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

export default NetworkDetailPage;

import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/home/HeroBanner';
import NetworkCarousel from '../components/home/NetworkCarousel';
import TrendingSection from '../components/home/TrendingSection';
import CategoryGrid from '../components/home/CategoryGrid';
import RecentlyAdded from '../components/home/RecentlyAdded';
import TrailerModal from '../components/common/TrailerModal';
import DownloadModal from '../components/common/DownloadModal';
import { api } from '../services/api';
import { featuredCartoon as initialFeatured, trendingCartoons as initialTrending, recentlyAdded as initialRecent } from '../data/cartoons';

function HomePage() {
  const [featured, setFeatured] = useState(initialFeatured);
  const [trending, setTrending] = useState(initialTrending);
  const [recent, setRecent] = useState(initialRecent);

  const [activeTrailer, setActiveTrailer] = useState(null);
  const [activeDownload, setActiveDownload] = useState(null);

  useEffect(() => {
    // Fetch live data from backend MongoDB API
    api.getFeatured().then((res) => {
      if (res?.success && res.cartoon) setFeatured(res.cartoon);
    }).catch(() => {});

    api.getTrending().then((res) => {
      if (res?.success && res.cartoons) setTrending(res.cartoons);
    }).catch(() => {});

    api.getRecent().then((res) => {
      if (res?.success && res.cartoons) setRecent(res.cartoons);
    }).catch(() => {});
  }, []);

  return (
    <div className="home-page">
      <HeroBanner
        cartoon={featured}
        onPlayTrailer={(c) => setActiveTrailer(c)}
        onDownload={(c) => setActiveDownload(c)}
      />

      <NetworkCarousel />

      <TrendingSection
        cartoons={trending}
        onPlayTrailer={(c) => setActiveTrailer(c)}
        onDownload={(c) => setActiveDownload(c)}
      />

      <CategoryGrid />

      <RecentlyAdded
        cartoons={recent}
        onPlayTrailer={(c) => setActiveTrailer(c)}
        onDownload={(c) => setActiveDownload(c)}
      />

      {/* Interactive Modals */}
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
  );
}

export default HomePage;

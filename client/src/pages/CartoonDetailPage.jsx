import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Play,
  Download,
  Star,
  Calendar,
  Tv,
  Layers,
  Heart,
  ShieldCheck,
  Share2,
  Check,
  ChevronLeft,
  Volume2,
  HardDrive,
  Server,
} from 'lucide-react';
import { api } from '../services/api';
import { useFavorites } from '../context/FavoritesContext';
import CartoonCard from '../components/common/CartoonCard';
import DownloadModal from '../components/common/DownloadModal';
import TrailerModal from '../components/common/TrailerModal';
import VideoPlayerModal from '../components/common/VideoPlayerModal';
import './CartoonDetailPage.css';

function CartoonDetailPage() {
  const { id } = useParams();
  const [cartoon, setCartoon] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false);
  const [localFiles, setLocalFiles] = useState([]);
  const [copied, setCopied] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);

    api.getCartoon(id)
      .then((res) => {
        if (res?.success && res.cartoon) {
          setCartoon(res.cartoon);
          setRelated(res.related || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    // Check for matching video files in video_container
    api.getMediaFiles()
      .then((res) => {
        if (res?.success && res.files) {
          const matched = res.files.filter(f =>
            f.folder?.toLowerCase().includes(id.toLowerCase()) ||
            f.name?.toLowerCase().includes(id.toLowerCase()) ||
            f.relativePath?.toLowerCase().includes(id.toLowerCase())
          );
          setLocalFiles(matched);
        }
      })
      .catch(() => {});
  }, [id]);

  if (loading) {
    return (
      <div className="container detail-loading-view">
        <div className="loading-spinner" />
        <p>Loading cartoon details...</p>
      </div>
    );
  }

  if (!cartoon) {
    return (
      <div className="container detail-not-found">
        <h2>Cartoon not found</h2>
        <Link to="/" className="btn-back">Back to Home</Link>
      </div>
    );
  }

  const cartoonId = cartoon._id || cartoon.id;
  const favorited = isFavorite(cartoonId);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadLinks = cartoon.downloadLinks && cartoon.downloadLinks.length > 0 ? cartoon.downloadLinks : [
    { quality: '1080p FHD', resolution: '1920x1080', size: '1.4 GB', format: 'MKV', audioLanguages: ['Hindi', 'English'] },
    { quality: '720p HD', resolution: '1280x720', size: '720 MB', format: 'MP4', audioLanguages: ['Hindi', 'English'] },
    { quality: '480p SD', resolution: '854x480', size: '350 MB', format: 'MP4', audioLanguages: ['Hindi', 'English'] },
  ];

  return (
    <div className="cartoon-detail-page">
      {/* Hero Banner Area */}
      <div className="detail-banner-hero">
        <img
          src={cartoon.banner || cartoon.poster}
          alt={cartoon.title}
          className="detail-banner-img"
        />
        <div className="detail-banner-overlay" />

        <div className="container detail-hero-content">
          <Link to="/" className="detail-back-link">
            <ChevronLeft size={18} /> Back to Browse
          </Link>

          <div className="detail-grid">
            {/* Poster Card */}
            <div className="detail-poster-col">
              <div className="detail-poster-card">
                <img src={cartoon.poster} alt={cartoon.title} className="detail-poster" />
                <button
                  className={`detail-fav-btn ${favorited ? 'detail-fav-btn--active' : ''}`}
                  onClick={() => toggleFavorite(cartoon)}
                >
                  <Heart size={20} fill={favorited ? 'var(--color-danger)' : 'none'} color={favorited ? 'var(--color-danger)' : '#fff'} />
                  <span>{favorited ? 'Saved in Favorites' : 'Add to Favorites'}</span>
                </button>
              </div>
            </div>

            {/* Main Info */}
            <div className="detail-info-col">
              <div className="detail-tags-row">
                <Link to={`/network/${cartoon.networkId || 'cartoon-network'}`} className="detail-network-pill">
                  {cartoon.network}
                </Link>
                {cartoon.categories?.map((cat) => (
                  <span key={cat} className="detail-category-pill">{cat}</span>
                ))}
              </div>

              <h1 className="detail-title">{cartoon.title}</h1>

              <div className="detail-meta-bar">
                <div className="meta-badge meta-badge--rating">
                  <Star size={16} fill="var(--color-accent)" color="var(--color-accent)" />
                  <span>{cartoon.rating}/10 Score</span>
                </div>
                <div className="meta-badge">
                  <Calendar size={15} />
                  <span>{cartoon.year}</span>
                </div>
                <div className="meta-badge">
                  <Tv size={15} />
                  <span>{cartoon.seasons || 1} Seasons</span>
                </div>
                <div className="meta-badge">
                  <Layers size={15} />
                  <span>{cartoon.episodes || 26} Episodes</span>
                </div>
              </div>

              <p className="detail-synopsis">{cartoon.description}</p>

              {/* Action Buttons */}
              <div className="detail-actions">
                {/* Watch Local Episode */}
                <button
                  className="btn-primary-action btn-stream-local"
                  onClick={() => setVideoPlayerOpen(true)}
                  title="Stream video directly from your video_container"
                >
                  <Server size={18} />
                  <span>Stream Episode (Local Server)</span>
                </button>

                <button
                  className="btn-trailer-action"
                  onClick={() => setTrailerModalOpen(true)}
                >
                  <Play size={18} fill="#fff" />
                  <span>Trailer</span>
                </button>

                <button
                  className="btn-download-action"
                  onClick={() => setDownloadModalOpen(true)}
                >
                  <Download size={18} />
                  <span>Download Episodes</span>
                </button>

                <button className="btn-share-action" onClick={handleShare}>
                  {copied ? <Check size={18} /> : <Share2 size={18} />}
                  <span>{copied ? 'Link Copied!' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Local Video Container Storage Callout */}
      <section className="section detail-container-status-section">
        <div className="container">
          <div className="container-status-card">
            <div className="status-left">
              <div className="status-icon-bubble">
                <HardDrive size={24} />
              </div>
              <div>
                <div className="status-tag">LOCAL CLOUD STORAGE ACTIVE</div>
                <h3 className="status-title">
                  {localFiles.length > 0
                    ? `🎬 ${localFiles.length} Local Episode(s) Detected in video_container`
                    : `📂 Ready to Host: video_container/${cartoon.slug || cartoon.id}/`}
                </h3>
                <p className="status-sub">
                  Drop video files (.mp4, .mkv) in <code>d:\ToonVerse\video_container\{cartoon.slug || cartoon.id}\</code> to stream and serve at high speed.
                </p>
              </div>
            </div>

            <div className="status-actions">
              <button className="btn-quick-stream" onClick={() => setVideoPlayerOpen(true)}>
                <Play size={16} fill="#0d0d2b" />
                <span>Play Local Stream</span>
              </button>
              <a
                href={api.getDownloadUrl(cartoon.slug || cartoon.id)}
                className="btn-quick-download"
                download
              >
                <Download size={16} />
                <span>Direct File Download</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded YouTube Trailer Section */}
      <section className="section detail-trailer-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <Play size={24} color="var(--color-primary)" />
              <span>Official Trailer & Preview</span>
            </h2>
          </div>

          <div className="trailer-embed-container">
            <iframe
              src={`https://www.youtube.com/embed/${cartoon.youtubeTrailerId || 'wN4C5UJjHd0'}?rel=0&modestbranding=1`}
              title={`${cartoon.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Authorized Downloads Hub Section */}
      <section className="section detail-download-section">
        <div className="container">
          <div className="download-hub-card">
            <div className="download-hub-header">
              <div className="download-hub-title-group">
                <div className="hub-badge">
                  <ShieldCheck size={16} /> Authorized High-Speed Server
                </div>
                <h2 className="hub-title">Download Full Episodes & Seasons</h2>
                <p className="hub-subtitle">
                  Direct encrypted download links with multiple audio options and resolutions
                </p>
              </div>
              <button className="hub-main-btn" onClick={() => setDownloadModalOpen(true)}>
                <Download size={18} /> Download Wizard
              </button>
            </div>

            <div className="download-links-grid">
              {downloadLinks.map((link) => (
                <div key={link.quality} className="download-link-card">
                  <div className="link-card-header">
                    <span className="link-quality-badge">{link.quality}</span>
                    <span className="link-size-badge">{link.size}</span>
                  </div>

                  <div className="link-specs">
                    <div className="link-spec-item">
                      <HardDrive size={14} />
                      <span>{link.resolution || '1080p'} • {link.format || 'MKV'}</span>
                    </div>
                    <div className="link-spec-item">
                      <Volume2 size={14} />
                      <span>{(link.audioLanguages || ['Hindi', 'English']).join(', ')}</span>
                    </div>
                  </div>

                  <button
                    className="link-download-btn"
                    onClick={() => setDownloadModalOpen(true)}
                  >
                    <Download size={16} />
                    <span>Get Download Link</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Cartoons Section */}
      {related.length > 0 && (
        <section className="section detail-related-section">
          <div className="container">
            <h2 className="section-title">
              <span>More Cartoons You Might Like</span>
            </h2>
            <div className="cartoons-grid">
              {related.map((item) => (
                <CartoonCard key={item._id || item.id} cartoon={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Modals */}
      <VideoPlayerModal
        isOpen={videoPlayerOpen}
        onClose={() => setVideoPlayerOpen(false)}
        cartoon={cartoon}
      />

      <TrailerModal
        isOpen={trailerModalOpen}
        onClose={() => setTrailerModalOpen(false)}
        cartoon={cartoon}
      />

      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        cartoon={cartoon}
      />
    </div>
  );
}

export default CartoonDetailPage;

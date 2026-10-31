import React, { useState, useEffect } from 'react';
import {
  Shield,
  Film,
  Users,
  Download,
  Plus,
  Trash2,
  Edit3,
  Star,
  CheckCircle2,
  X,
  RefreshCw,
  HardDrive,
  Upload,
  Play,
  Folder,
} from 'lucide-react';
import { api } from '../services/api';
import VideoPlayerModal from '../components/common/VideoPlayerModal';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('container'); // Default to video_container hub!
  const [stats, setStats] = useState(null);
  const [cartoons, setCartoons] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCartoon, setEditingCartoon] = useState(null);
  const [notification, setNotification] = useState('');

  // Video Player state
  const [activeVideoPlayer, setActiveVideoPlayer] = useState(null);

  // Upload video state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadSlug, setUploadSlug] = useState('doraemon');
  const [uploading, setUploading] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [network, setNetwork] = useState('Cartoon Network');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState('8.8');
  const [year, setYear] = useState('2024');
  const [seasons, setSeasons] = useState('1');
  const [episodes, setEpisodes] = useState('26');
  const [categories, setCategories] = useState('Action & Adventure, Comedy');
  const [poster, setPoster] = useState('');
  const [banner, setBanner] = useState('');
  const [youtubeTrailerId, setYoutubeTrailerId] = useState('wN4C5UJjHd0');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, cartoonsRes, mediaRes] = await Promise.all([
        api.getAdminStats(),
        api.getAllCartoons({ limit: 100 }),
        api.getMediaFiles(),
      ]);
      if (statsRes?.success) setStats(statsRes.stats);
      if (cartoonsRes?.success) setCartoons(cartoonsRes.cartoons);
      if (mediaRes?.success) setMediaFiles(mediaRes.files || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleOpenAddModal = () => {
    setEditingCartoon(null);
    setTitle('');
    setNetwork('Cartoon Network');
    setDescription('');
    setRating('8.8');
    setYear('2024');
    setSeasons('1');
    setEpisodes('26');
    setCategories('Action & Adventure, Comedy');
    setPoster('https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80');
    setBanner('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80');
    setYoutubeTrailerId('wN4C5UJjHd0');
    setModalOpen(true);
  };

  const handleOpenEditModal = (cartoon) => {
    setEditingCartoon(cartoon);
    setTitle(cartoon.title);
    setNetwork(cartoon.network);
    setDescription(cartoon.description);
    setRating(String(cartoon.rating));
    setYear(String(cartoon.year));
    setSeasons(String(cartoon.seasons || 1));
    setEpisodes(String(cartoon.episodes || 26));
    setCategories(Array.isArray(cartoon.categories) ? cartoon.categories.join(', ') : cartoon.categories);
    setPoster(cartoon.poster);
    setBanner(cartoon.banner);
    setYoutubeTrailerId(cartoon.youtubeTrailerId);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      network,
      networkId: network.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      description,
      rating: Number(rating),
      year: Number(year),
      seasons: Number(seasons),
      episodes: Number(episodes),
      categories: categories.split(',').map(c => c.trim()).filter(Boolean),
      poster,
      banner: banner || poster,
      youtubeTrailerId,
    };

    try {
      if (editingCartoon) {
        const res = await api.updateCartoon(editingCartoon._id || editingCartoon.id, payload);
        if (res.success) {
          showNotification(`Updated "${title}" successfully!`);
          fetchData();
        }
      } else {
        const res = await api.createCartoon(payload);
        if (res.success) {
          showNotification(`Created "${title}" successfully!`);
          fetchData();
        }
      }
      setModalOpen(false);
    } catch (err) {
      alert(`Error saving cartoon: ${err.message}`);
    }
  };

  const handleDelete = async (cartoon) => {
    if (!window.confirm(`Are you sure you want to delete "${cartoon.title}" from ToonVerse?`)) return;
    try {
      const res = await api.deleteCartoon(cartoon._id || cartoon.id);
      if (res.success) {
        showNotification(`Deleted "${cartoon.title}"`);
        setCartoons(prev => prev.filter(c => (c._id || c.id) !== (cartoon._id || cartoon.id)));
      }
    } catch (err) {
      alert(`Error deleting cartoon: ${err.message}`);
    }
  };

  const handleUploadVideo = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      alert('Please select a video file to upload');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('video', uploadFile);
    formData.append('cartoonSlug', uploadSlug);

    try {
      const res = await api.uploadMediaFile(formData);
      if (res.success) {
        showNotification(`Uploaded ${uploadFile.name} to video_container!`);
        setUploadFile(null);
        fetchData();
      }
    } catch (err) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-title-wrap">
            <div className="admin-badge">
              <Shield size={16} /> Admin & Media Control Center
            </div>
            <h1 className="admin-title">ToonVerse Hub</h1>
            <p className="admin-sub">
              Manage your local video container files, add new cartoons, and stream episodes
            </p>
          </div>

          <div className="admin-header-actions">
            <button className="admin-refresh-btn" onClick={fetchData} title="Refresh Data">
              <RefreshCw size={18} />
            </button>
            <button className="admin-add-btn" onClick={handleOpenAddModal}>
              <Plus size={18} />
              <span>Add New Cartoon</span>
            </button>
          </div>
        </div>

        {/* Notifications Toast */}
        {notification && (
          <div className="admin-toast">
            <CheckCircle2 size={18} />
            <span>{notification}</span>
          </div>
        )}

        {/* Analytics KPI Cards */}
        <div className="admin-kpis-grid">
          <div className="kpi-card">
            <div className="kpi-icon-wrap kpi-icon--downloads">
              <HardDrive size={26} />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Local Container Videos</span>
              <span className="kpi-val">{mediaFiles.length} Ready</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap kpi-icon--cartoons">
              <Film size={26} />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Total Cartoons</span>
              <span className="kpi-val">{stats?.totalCartoons || cartoons.length}</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap kpi-icon--users">
              <Users size={26} />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Server Mode</span>
              <span className="kpi-val kpi-val--active">Local Cloud</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap kpi-icon--admin">
              <Shield size={26} />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Storage Folder</span>
              <span className="kpi-val kpi-val--active">video_container</span>
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="admin-tabs-nav">
          <button
            className={`admin-nav-tab ${activeTab === 'container' ? 'admin-nav-tab--active' : ''}`}
            onClick={() => setActiveTab('container')}
          >
            <HardDrive size={18} /> Video Container Storage Hub ({mediaFiles.length})
          </button>
          <button
            className={`admin-nav-tab ${activeTab === 'cartoons' ? 'admin-nav-tab--active' : ''}`}
            onClick={() => setActiveTab('cartoons')}
          >
            <Film size={18} /> Cartoons Catalog ({cartoons.length})
          </button>
        </div>

        {/* TAB 1: Video Container Storage Hub */}
        {activeTab === 'container' && (
          <div className="admin-container-tab">
            {/* Storage banner */}
            <div className="storage-summary-card">
              <div className="storage-summary-left">
                <Folder size={32} color="var(--color-secondary)" />
                <div>
                  <div className="summary-badge">ACTIVE LOCAL CLOUD DIRECTORY</div>
                  <h3 className="summary-title">d:\ToonVerse\video_container</h3>
                  <p className="summary-sub">
                    Any video file placed in this folder is automatically detected, streamable via HTTP 206 range requests, and available for direct download.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Upload Form */}
            <div className="admin-table-card upload-form-card">
              <h3>Upload Video into Container</h3>
              <form onSubmit={handleUploadVideo} className="upload-inline-form">
                <div className="form-group">
                  <label>Assign to Cartoon Folder</label>
                  <select value={uploadSlug} onChange={(e) => setUploadSlug(e.target.value)}>
                    {cartoons.map((c) => (
                      <option key={c.slug || c._id} value={c.slug || c._id}>
                        {c.title} ({c.network})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group form-group--file">
                  <label>Select Video File (.mp4, .mkv, .webm)</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    className="file-input"
                  />
                </div>

                <button type="submit" className="btn-upload-submit" disabled={uploading || !uploadFile}>
                  <Upload size={18} />
                  <span>{uploading ? 'Uploading to Container...' : 'Upload Video'}</span>
                </button>
              </form>
            </div>

            {/* Files List in Container */}
            <div className="admin-table-card">
              <div className="table-card-header">
                <h3>Detected Videos in Container ({mediaFiles.length})</h3>
                <span className="table-card-sub">Files currently hosted and streaming from your machine</span>
              </div>

              {mediaFiles.length === 0 ? (
                <div className="empty-container-notice">
                  <HardDrive size={40} color="var(--color-text-muted)" />
                  <p>No video files found yet in <code>d:\ToonVerse\video_container</code>.</p>
                  <p>Drop your cartoon episode files there or use the upload form above!</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>File Name</th>
                        <th>Subfolder</th>
                        <th>File Size</th>
                        <th>Format</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mediaFiles.map((file) => (
                        <tr key={file.relativePath}>
                          <td>
                            <strong>{file.name}</strong>
                            <div className="table-file-path">{file.relativePath}</div>
                          </td>
                          <td>
                            <span className="table-folder-chip">{file.folder || 'root'}</span>
                          </td>
                          <td>{file.size}</td>
                          <td>
                            <span className="table-format-badge">{file.format}</span>
                          </td>
                          <td className="cell-actions">
                            <button
                              className="btn-table-action btn-table-play"
                              onClick={() => setActiveVideoPlayer({ title: file.name, slug: file.folder, streamUrl: api.getStreamUrl(file.folder, file.name) })}
                              title="Stream in Browser Player"
                            >
                              <Play size={16} fill="#fff" />
                            </button>
                            <a
                              href={api.getDownloadUrl(file.folder, file.name)}
                              className="btn-table-action btn-table-dl"
                              title="Download File"
                              download
                            >
                              <Download size={16} />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Cartoons Management Table */}
        {activeTab === 'cartoons' && (
          <div className="admin-table-card">
            <div className="table-card-header">
              <h3>Cartoon Catalog Management ({cartoons.length})</h3>
              <span className="table-card-sub">Instant updates sync to the live MongoDB database</span>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Poster</th>
                    <th>Title & Network</th>
                    <th>Rating</th>
                    <th>Year</th>
                    <th>Trailer ID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartoons.map((cartoon) => (
                    <tr key={cartoon._id || cartoon.id}>
                      <td className="cell-poster">
                        <img src={cartoon.poster} alt={cartoon.title} className="table-thumb" />
                      </td>
                      <td>
                        <strong className="table-title">{cartoon.title}</strong>
                        <span className="table-network">{cartoon.network}</span>
                      </td>
                      <td>
                        <div className="table-rating">
                          <Star size={13} fill="var(--color-accent)" color="var(--color-accent)" />
                          <span>{cartoon.rating}</span>
                        </div>
                      </td>
                      <td>{cartoon.year}</td>
                      <td>
                        <code className="table-code">{cartoon.youtubeTrailerId || 'None'}</code>
                      </td>
                      <td className="cell-actions">
                        <button
                          className="btn-table-action btn-table-edit"
                          onClick={() => handleOpenEditModal(cartoon)}
                          title="Edit Cartoon"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          className="btn-table-action btn-table-delete"
                          onClick={() => handleDelete(cartoon)}
                          title="Delete Cartoon"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Cartoon Modal */}
        {modalOpen && (
          <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
            <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingCartoon ? 'Edit Cartoon Details' : 'Add New Cartoon to ToonVerse'}</h3>
                <button className="modal-close" onClick={() => setModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Cartoon Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Ben 10: Alien Force"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Broadcast Network</label>
                    <select value={network} onChange={(e) => setNetwork(e.target.value)}>
                      <option value="Cartoon Network">Cartoon Network</option>
                      <option value="Disney Channel">Disney Channel</option>
                      <option value="Nickelodeon">Nickelodeon</option>
                      <option value="Pogo">Pogo</option>
                      <option value="Hungama TV">Hungama TV</option>
                      <option value="Discovery Kids">Discovery Kids</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Description / Synopsis</label>
                  <textarea
                    rows={3}
                    placeholder="Enter detailed cartoon synopsis..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row form-row--4">
                  <div className="form-group">
                    <label>Rating (0-10)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Seasons</label>
                    <input
                      type="number"
                      value={seasons}
                      onChange={(e) => setSeasons(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Episodes</label>
                    <input
                      type="number"
                      value={episodes}
                      onChange={(e) => setEpisodes(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Categories (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Action & Adventure, Sci-Fi & Fantasy, Comedy"
                    value={categories}
                    onChange={(e) => setCategories(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Poster Image URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={poster}
                      onChange={(e) => setPoster(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Banner Image URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={banner}
                      onChange={(e) => setBanner(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>YouTube Trailer ID (11 characters)</label>
                  <input
                    type="text"
                    placeholder="e.g. wN4C5UJjHd0"
                    value={youtubeTrailerId}
                    onChange={(e) => setYoutubeTrailerId(e.target.value)}
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-save">
                    {editingCartoon ? 'Save Changes' : 'Create Cartoon'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Video Player Modal */}
        <VideoPlayerModal
          isOpen={Boolean(activeVideoPlayer)}
          onClose={() => setActiveVideoPlayer(null)}
          cartoon={{ title: activeVideoPlayer?.title, slug: activeVideoPlayer?.slug, network: 'Local Cloud' }}
          videoSource={activeVideoPlayer?.streamUrl}
        />
      </div>
    </div>
  );
}

export default AdminDashboard;

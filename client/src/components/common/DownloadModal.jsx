import React, { useState } from 'react';
import { X, Download, ShieldCheck, CheckCircle2, Clock, FileVideo, HardDrive, Volume2, KeyRound } from 'lucide-react';
import { api } from '../../services/api';
import './DownloadModal.css';

function DownloadModal({ isOpen, onClose, cartoon }) {
  const [selectedQuality, setSelectedQuality] = useState('1080p FHD');
  const [loading, setLoading] = useState(false);
  const [authorizedData, setAuthorizedData] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !cartoon) return null;

  const downloadLinks = cartoon.downloadLinks && cartoon.downloadLinks.length > 0 ? cartoon.downloadLinks : [
    { quality: '1080p FHD', size: '1.4 GB', resolution: '1920x1080', format: 'MKV (HEVC)', audioLanguages: ['Hindi', 'English'], downloadUrl: 'https://archive.org/download/sample-animation/1080p.mkv' },
    { quality: '720p HD', size: '720 MB', resolution: '1280x720', format: 'MP4 (H.264)', audioLanguages: ['Hindi', 'English'], downloadUrl: 'https://archive.org/download/sample-animation/720p.mp4' },
    { quality: '480p SD', size: '350 MB', resolution: '854x480', format: 'MP4 (H.264)', audioLanguages: ['Hindi', 'English'], downloadUrl: 'https://archive.org/download/sample-animation/480p.mp4' },
  ];

  const currentOption = downloadLinks.find(l => l.quality === selectedQuality) || downloadLinks[0];

  const handleGenerateLink = async () => {
    setLoading(true);
    try {
      const res = await api.requestDownloadToken(cartoon._id || cartoon.id, selectedQuality);
      if (res.success) {
        setAuthorizedData(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const url = authorizedData?.fileInfo?.downloadUrl || currentOption.downloadUrl;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="download-modal-backdrop" onClick={onClose}>
      <div className="download-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="download-modal-header">
          <div className="download-modal-header-info">
            <span className="download-modal-badge">
              <ShieldCheck size={14} /> Authorized Download Hub
            </span>
            <h3 className="download-modal-title">{cartoon.title}</h3>
          </div>
          <button className="download-modal-close" onClick={onClose} aria-label="Close download modal">
            <X size={20} />
          </button>
        </div>

        <div className="download-modal-body">
          {/* Quality selector */}
          <div className="download-quality-picker">
            <label className="download-label">Choose Video Quality</label>
            <div className="download-quality-buttons">
              {downloadLinks.map((link) => (
                <button
                  key={link.quality}
                  className={`download-quality-btn ${selectedQuality === link.quality ? 'download-quality-btn--active' : ''}`}
                  onClick={() => {
                    setSelectedQuality(link.quality);
                    setAuthorizedData(null);
                  }}
                >
                  <span className="quality-name">{link.quality}</span>
                  <span className="quality-size">{link.size}</span>
                </button>
              ))}
            </div>
          </div>

          {/* File details card */}
          <div className="download-details-card">
            <div className="download-detail-item">
              <FileVideo size={16} />
              <div>
                <span className="detail-label">Resolution</span>
                <span className="detail-val">{currentOption.resolution || '1920x1080'}</span>
              </div>
            </div>
            <div className="download-detail-item">
              <HardDrive size={16} />
              <div>
                <span className="detail-label">Format</span>
                <span className="detail-val">{currentOption.format || 'MKV / MP4'}</span>
              </div>
            </div>
            <div className="download-detail-item">
              <Volume2 size={16} />
              <div>
                <span className="detail-label">Audio Tracks</span>
                <span className="detail-val">
                  {(currentOption.audioLanguages || ['Hindi', 'English']).join(' + ')}
                </span>
              </div>
            </div>
            <div className="download-detail-item">
              <Clock size={16} />
              <div>
                <span className="detail-label">Token Expiry</span>
                <span className="detail-val">15 Minutes</span>
              </div>
            </div>
          </div>

          {/* Authorization Token Status */}
          {authorizedData ? (
            <div className="download-authorized-box">
              <div className="authorized-badge">
                <CheckCircle2 size={18} />
                <span>Authorized Token Signed & Verified!</span>
              </div>
              <div className="token-code-row">
                <KeyRound size={16} />
                <code>{authorizedData.token.slice(0, 32)}...</code>
              </div>
              <div className="download-actions-row">
                <a
                  href={authorizedData.fileInfo.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="download-btn-primary"
                >
                  <Download size={18} />
                  <span>Start Instant Download ({currentOption.size})</span>
                </a>
                <button className="download-btn-secondary" onClick={handleCopyLink}>
                  {copied ? 'Copied URL!' : 'Copy Direct Link'}
                </button>
              </div>
            </div>
          ) : (
            <div className="download-action-start">
              <button
                className="download-generate-btn"
                onClick={handleGenerateLink}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    <span>Authorizing & Generating Token...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={20} />
                    <span>Generate Secure Download Link</span>
                  </>
                )}
              </button>
              <p className="download-disclaimer">
                🔒 Free, direct and authorized cartoon download server link with high-speed CDN.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DownloadModal;

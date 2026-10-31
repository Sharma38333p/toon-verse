import React, { useEffect, useRef } from 'react';
import { X, Server, Download, HardDrive } from 'lucide-react';
import { api } from '../../services/api';
import './VideoPlayerModal.css';

function VideoPlayerModal({ isOpen, onClose, cartoon, videoSource }) {
  const videoRef = useRef(null);

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

  const streamUrl = videoSource || api.getStreamUrl(cartoon.slug || cartoon.id);
  const downloadUrl = api.getDownloadUrl(cartoon.slug || cartoon.id);

  return (
    <div className="player-modal-backdrop" onClick={onClose}>
      <div className="player-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="player-modal-header">
          <div className="player-modal-badge-group">
            <span className="player-local-badge">
              <Server size={14} /> Local Cloud Video Container
            </span>
            <span className="player-cartoon-badge">{cartoon.network}</span>
          </div>
          <div className="player-header-actions">
            <a
              href={downloadUrl}
              className="player-direct-download-btn"
              title="Download this file directly"
              download
            >
              <Download size={16} /> Direct Download
            </a>
            <button className="player-modal-close" onClick={onClose} aria-label="Close video player">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="player-video-wrapper">
          <video
            ref={videoRef}
            src={streamUrl}
            controls
            autoPlay
            className="player-video-element"
          >
            Your browser does not support HTML5 video streaming.
          </video>
        </div>

        <div className="player-modal-footer">
          <div className="player-title-row">
            <h3 className="player-title">{cartoon.title} — Full Episode</h3>
            <span className="player-storage-hint">
              <HardDrive size={14} /> Stored in <code>d:\ToonVerse\video_container</code>
            </span>
          </div>
          <p className="player-desc">{cartoon.description}</p>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayerModal;

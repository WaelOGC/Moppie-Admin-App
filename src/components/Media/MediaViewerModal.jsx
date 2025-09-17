import React, { useState, useEffect } from 'react';

const MediaViewerModal = ({ 
  media, 
  isOpen, 
  onClose, 
  onStatusChange, 
  mediaItems = [], 
  currentIndex = 0 
}) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(currentIndex);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentMediaIndex(currentIndex);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentMediaIndex, mediaItems.length]);

  const handlePrevious = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentMediaIndex < mediaItems.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    }
  };

  const handleStatusChange = (status) => {
    const currentMedia = mediaItems[currentMediaIndex];
    if (currentMedia) {
      setIsLoading(true);
      onStatusChange(currentMedia.id, status);
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !media) return null;

  const currentMedia = mediaItems[currentMediaIndex] || media;
  const getStatusConfig = (status) => {
    const configs = {
      approved: { color: '#10b981', icon: '✅', label: 'Approved' },
      rejected: { color: '#ef4444', icon: '❌', label: 'Rejected' },
      flagged: { color: '#f97316', icon: '🚩', label: 'Flagged' },
      pending: { color: '#f59e0b', icon: '⏳', label: 'Pending' }
    };
    return configs[status] || configs.pending;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusConfig = getStatusConfig(currentMedia.status);

  return (
    <div className="media-viewer-modal-overlay" onClick={handleOverlayClick}>
      <div className="media-viewer-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <h2 className="modal-title">{currentMedia.jobId} - Media Review</h2>
            <span 
              className="modal-status-badge"
              style={{
                color: statusConfig.color,
                backgroundColor: statusConfig.color + '20',
                borderColor: statusConfig.color
              }}
            >
              {statusConfig.icon} {statusConfig.label}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          {/* Media Display */}
          <div className="modal-media-container">
            {currentMedia.mediaType === 'video' ? (
              <video
                src={currentMedia.fullPath}
                className="modal-video"
                controls
                autoPlay
                poster={currentMedia.thumbnail}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={currentMedia.fullPath}
                alt={`Media from ${currentMedia.customer}`}
                className="modal-image"
              />
            )}
          </div>

          {/* Media Info Panel */}
          <div className="modal-info-panel">
            <div className="info-section">
              <h3 className="info-section-title">Job Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Job ID:</span>
                  <span className="info-value">{currentMedia.jobId}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Job Title:</span>
                  <span className="info-value">{currentMedia.jobTitle}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Category:</span>
                  <span className="info-value">{currentMedia.category === 'before' ? '📸 Before' : '✨ After'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Customer:</span>
                  <span className="info-value">{currentMedia.customer}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Staff Member:</span>
                  <span className="info-value">{currentMedia.staff}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">File Name:</span>
                  <span className="info-value">{currentMedia.fileName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">File Type:</span>
                  <span className="info-value">{currentMedia.fileType}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Uploaded:</span>
                  <span className="info-value">{formatDate(currentMedia.uploadedAt)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">File Size:</span>
                  <span className="info-value">{currentMedia.fileSize}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Resolution:</span>
                  <span className="info-value">{currentMedia.resolution}</span>
                </div>
                {currentMedia.duration && (
                  <div className="info-item">
                    <span className="info-label">Duration:</span>
                    <span className="info-value">{currentMedia.duration}</span>
                  </div>
                )}
                {currentMedia.description && (
                  <div className="info-item">
                    <span className="info-label">Description:</span>
                    <span className="info-value">{currentMedia.description}</span>
                  </div>
                )}
                <div className="info-item">
                  <span className="info-label">Important:</span>
                  <span className="info-value">{currentMedia.isImportant ? '⭐ Yes' : 'No'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="modal-actions">
              <button
                className={`action-btn approve-btn ${currentMedia.status === 'approved' ? 'active' : ''}`}
                onClick={() => handleStatusChange('approved')}
                disabled={isLoading}
              >
                <span className="btn-icon">✅</span>
                <span className="btn-text">Approve</span>
              </button>
              <button
                className={`action-btn flag-btn ${currentMedia.status === 'flagged' ? 'active' : ''}`}
                onClick={() => handleStatusChange('flagged')}
                disabled={isLoading}
              >
                <span className="btn-icon">🚩</span>
                <span className="btn-text">Flag</span>
              </button>
              <button
                className={`action-btn reject-btn ${currentMedia.status === 'rejected' ? 'active' : ''}`}
                onClick={() => handleStatusChange('rejected')}
                disabled={isLoading}
              >
                <span className="btn-icon">❌</span>
                <span className="btn-text">Reject</span>
              </button>
              <button
                className={`action-btn pending-btn ${currentMedia.status === 'pending' ? 'active' : ''}`}
                onClick={() => handleStatusChange('pending')}
                disabled={isLoading}
              >
                <span className="btn-icon">⏳</span>
                <span className="btn-text">Mark Pending</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {mediaItems.length > 1 && (
          <div className="modal-navigation">
            <button
              className="nav-btn prev-btn"
              onClick={handlePrevious}
              disabled={currentMediaIndex === 0}
            >
              ← Previous
            </button>
            <div className="nav-indicator">
              {currentMediaIndex + 1} of {mediaItems.length}
            </div>
            <button
              className="nav-btn next-btn"
              onClick={handleNext}
              disabled={currentMediaIndex === mediaItems.length - 1}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaViewerModal;

import React, { useState } from 'react';

const MediaCard = ({ media, onCardClick, onStatusChange, onImportanceToggle, isSelected, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const getStatusConfig = (status) => {
    const configs = {
      approved: { 
        color: '#10b981', 
        bgColor: 'rgba(16, 185, 129, 0.1)', 
        icon: '✅', 
        label: 'Approved' 
      },
      rejected: { 
        color: '#ef4444', 
        bgColor: 'rgba(239, 68, 68, 0.1)', 
        icon: '❌', 
        label: 'Rejected' 
      },
      flagged: { 
        color: '#f97316', 
        bgColor: 'rgba(249, 115, 22, 0.1)', 
        icon: '🚩', 
        label: 'Flagged' 
      },
      pending: { 
        color: '#f59e0b', 
        bgColor: 'rgba(245, 158, 11, 0.1)', 
        icon: '⏳', 
        label: 'Pending' 
      }
    };
    return configs[status] || configs.pending;
  };

  const getCategoryConfig = (category) => {
    const configs = {
      before: { 
        color: '#ef4444', 
        bgColor: 'rgba(239, 68, 68, 0.1)', 
        icon: '📸', 
        label: 'Before' 
      },
      after: { 
        color: '#10b981', 
        bgColor: 'rgba(16, 185, 129, 0.1)', 
        icon: '✨', 
        label: 'After' 
      }
    };
    return configs[category] || configs.before;
  };

  const handleCardClick = () => {
    onCardClick(media);
  };

  const handleStatusChange = (e) => {
    e.stopPropagation();
    const newStatus = e.target.value;
    onStatusChange(media.id, newStatus);
  };

  const handleSelect = (e) => {
    e.stopPropagation();
    onSelect(media.id);
  };

  const handleImportanceToggle = (e) => {
    e.stopPropagation();
    onImportanceToggle(media.id, !media.isImportant);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusConfig = getStatusConfig(media.status);
  const categoryConfig = getCategoryConfig(media.category);

  return (
    <div 
      className={`media-card ${isSelected ? 'selected' : ''}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderColor: statusConfig.color,
        animationDelay: `${Math.random() * 0.3}s`
      }}
    >
      {/* Selection Checkbox */}
      <div className="media-card-checkbox">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelect}
          onClick={(e) => e.stopPropagation()}
          className="media-select-checkbox"
        />
      </div>

      {/* Media Thumbnail */}
      <div className="media-thumbnail-container">
        {media.mediaType === 'video' ? (
          <div className="video-thumbnail">
            <img 
              src={media.thumbnail} 
              alt={`Video from ${media.customer}`}
              className="video-thumbnail-image"
            />
            <div className="video-overlay">
              <div className="video-play-button">
                <span className="play-icon">▶️</span>
              </div>
              {media.duration && (
                <div className="video-duration">
                  {media.duration}
                </div>
              )}
            </div>
            {isHovered && (
              <video
                src={media.fullPath}
                className="video-preview"
                muted
                loop
                autoPlay
                onMouseEnter={() => setIsVideoPlaying(true)}
                onMouseLeave={() => setIsVideoPlaying(false)}
              />
            )}
          </div>
        ) : (
          <div className="image-thumbnail">
            <img 
              src={media.thumbnail} 
              alt={`Image from ${media.customer}`}
              className={`image-thumbnail-img ${isHovered ? 'hovered' : ''}`}
            />
          </div>
        )}
        
        {/* Media Type Badge */}
        <div className="media-type-badge">
          {media.mediaType === 'video' ? '🎥' : '📸'}
        </div>

        {/* Category Badge */}
        <div 
          className="media-category-badge"
          style={{
            color: categoryConfig.color,
            backgroundColor: categoryConfig.bgColor,
            borderColor: categoryConfig.color
          }}
        >
          {categoryConfig.icon} {categoryConfig.label}
        </div>

        {/* Importance Star */}
        <button
          className={`importance-star ${media.isImportant ? 'important' : ''}`}
          onClick={handleImportanceToggle}
          title={media.isImportant ? 'Remove from important' : 'Mark as important'}
        >
          ⭐
        </button>
      </div>

      {/* Media Info */}
      <div className="media-card-info">
        <div className="media-header">
          <div className="media-title-section">
            <h3 className="media-job-id">{media.jobId}</h3>
            <span className="media-job-title">{media.jobTitle}</span>
          </div>
          <span 
            className="media-status-badge"
            style={{
              color: statusConfig.color,
              backgroundColor: statusConfig.bgColor,
              borderColor: statusConfig.color
            }}
          >
            {statusConfig.icon} {statusConfig.label}
          </span>
        </div>

        <div className="media-details">
          <div className="media-detail-item">
            <span className="detail-label">Customer:</span>
            <span className="detail-value">{media.customer}</span>
          </div>
          <div className="media-detail-item">
            <span className="detail-label">Staff:</span>
            <span className="detail-value">{media.staff}</span>
          </div>
          <div className="media-detail-item">
            <span className="detail-label">Uploaded:</span>
            <span className="detail-value">{formatDate(media.uploadedAt)} {formatTime(media.uploadedAt)}</span>
          </div>
          <div className="media-detail-item">
            <span className="detail-label">Size:</span>
            <span className="detail-value">{media.fileSize}</span>
          </div>
        </div>

        {media.description && (
          <div className="media-description">
            <span className="description-text">{media.description}</span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="media-quick-actions">
          <select
            value={media.status}
            onChange={handleStatusChange}
            className="status-select"
            style={{ borderColor: statusConfig.color }}
          >
            <option value="pending">⏳ Pending</option>
            <option value="approved">✅ Approve</option>
            <option value="flagged">🚩 Flag</option>
            <option value="rejected">❌ Reject</option>
          </select>
        </div>
      </div>

      {/* Hover Overlay */}
      <div className={`media-card-overlay ${isHovered ? 'visible' : ''}`}>
        <div className="overlay-actions">
          <button className="overlay-action-btn view-btn" title="View Full Size">
            👁️
          </button>
          <button 
            className="overlay-action-btn approve-btn" 
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(media.id, 'approved');
            }}
            title="Approve"
          >
            ✅
          </button>
          <button 
            className="overlay-action-btn flag-btn"
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(media.id, 'flagged');
            }}
            title="Flag"
          >
            🚩
          </button>
          <button 
            className="overlay-action-btn reject-btn"
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(media.id, 'rejected');
            }}
            title="Reject"
          >
            ❌
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;

import React, { useState, useEffect } from 'react';
import { getEmployeeMedia, getJobMedia, updateMediaStatus, bulkUpdateMediaStatus, getJobsList, updateMediaImportance } from '../../api/media';
import MediaCard from '../../components/Media/MediaCard';
import MediaViewerModal from '../../components/Media/MediaViewerModal';
import { useNotifications } from '../../hooks/useNotifications';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MediaReview = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [viewMode, setViewMode] = useState('admin'); // 'admin' or 'employee'
  
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    jobId: 'all',
    search: '',
    dateFrom: '',
    dateTo: '',
    showImportantOnly: false
  });

  const [jobsList, setJobsList] = useState([]);

  const [bulkActions, setBulkActions] = useState({
    show: false,
    action: 'approve'
  });

  const { showNotification } = useNotifications();

  // Load media items and jobs list
  useEffect(() => {
    loadMediaItems();
    loadJobsList();
  }, [filters, viewMode]);

  // Load jobs list
  useEffect(() => {
    loadJobsList();
  }, []);

  const loadMediaItems = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      
      if (viewMode === 'employee') {
        // Employee-specific view: GET /employees/me/media/
        const params = {
          status: filters.status !== 'all' ? filters.status : undefined,
          category: filters.category !== 'all' ? filters.category : undefined,
          search: filters.search || undefined,
          date_from: filters.dateFrom || undefined,
          date_to: filters.dateTo || undefined,
          important_only: filters.showImportantOnly || undefined
        };

        // Remove undefined values
        Object.keys(params).forEach(key => 
          params[key] === undefined && delete params[key]
        );

        response = await getEmployeeMedia(params);
      } else {
        // Admin view by job: GET /jobs/{job_id}/media/
        if (filters.jobId !== 'all') {
          response = await getJobMedia(filters.jobId);
        } else {
          // Fallback to general media endpoint for admin view
          const backendFilters = {
            status: filters.status !== 'all' ? filters.status : undefined,
            category: filters.category !== 'all' ? filters.category : undefined,
            job_id: filters.jobId !== 'all' ? filters.jobId : undefined,
            search: filters.search || undefined,
            date_from: filters.dateFrom || undefined,
            date_to: filters.dateTo || undefined,
            important_only: filters.showImportantOnly || undefined
          };

          // Remove undefined values
          Object.keys(backendFilters).forEach(key => 
            backendFilters[key] === undefined && delete backendFilters[key]
          );

          response = await getEmployeeMedia(backendFilters); // Using employee endpoint as fallback
        }
      }
      
      if (response.data && response.data.results) {
        // Handle paginated response
        setMediaItems(response.data.results);
        setFilteredItems(response.data.results);
      } else if (Array.isArray(response.data)) {
        // Handle direct array response
        setMediaItems(response.data);
        setFilteredItems(response.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Failed to load media items:', error);
      setError('Failed to load media items');
      showNotification(
        error.response?.data?.message || 'Failed to load media items', 
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const loadJobsList = async () => {
    try {
      const response = await getJobsList();
      
      if (response.data && response.data.results) {
        // Transform jobs data for media filter dropdown
        const transformedJobs = response.data.results.map(job => ({
          id: job.id,
          title: job.jobId || `Job ${job.id}`,
          mediaCount: job.media_count || 0
        }));
        setJobsList(transformedJobs);
      } else if (Array.isArray(response.data)) {
        const transformedJobs = response.data.map(job => ({
          id: job.id,
          title: job.jobId || `Job ${job.id}`,
          mediaCount: job.media_count || 0
        }));
        setJobsList(transformedJobs);
      }
    } catch (error) {
      console.error('Failed to load jobs list:', error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleCardClick = (media) => {
    const index = filteredItems.findIndex(item => item.id === media.id);
    setCurrentMediaIndex(index);
    setSelectedMedia(media);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (mediaId, status) => {
    try {
      const response = await updateMediaStatus(mediaId, status);
      
      if (response.data) {
        // Update local state
        setMediaItems(prev => prev.map(item => 
          item.id === mediaId ? { ...item, status } : item
        ));
        setFilteredItems(prev => prev.map(item => 
          item.id === mediaId ? { ...item, status } : item
        ));

        showNotification(`Media status updated to ${status}`, 'success');
      } else {
        throw new Error('No data returned from API');
      }
    } catch (error) {
      console.error('Failed to update media status:', error);
      showNotification(
        error.response?.data?.message || 'Failed to update media status', 
        'error'
      );
    }
  };

  const handleImportanceToggle = async (mediaId, isImportant) => {
    try {
      const response = await updateMediaImportance(mediaId, isImportant);
      
      if (response.data) {
        // Update local state
        setMediaItems(prev => prev.map(item => 
          item.id === mediaId ? { ...item, isImportant } : item
        ));
        setFilteredItems(prev => prev.map(item => 
          item.id === mediaId ? { ...item, isImportant } : item
        ));

        showNotification(`Media ${isImportant ? 'marked as important' : 'removed from important'}`, 'success');
      } else {
        throw new Error('No data returned from API');
      }
    } catch (error) {
      console.error('Failed to update media importance:', error);
      showNotification(
        error.response?.data?.message || 'Failed to update media importance', 
        'error'
      );
    }
  };

  const handleSelectItem = (mediaId) => {
    setSelectedItems(prev => {
      if (prev.includes(mediaId)) {
        return prev.filter(id => id !== mediaId);
      } else {
        return [...prev, mediaId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const handleBulkAction = async () => {
    if (selectedItems.length === 0) {
      showNotification('Please select items first', 'warning');
      return;
    }

    try {
      const response = await bulkUpdateMediaStatus(selectedItems, bulkActions.action);
      
      if (response.data) {
        // Update local state
        setMediaItems(prev => prev.map(item => 
          selectedItems.includes(item.id) ? { ...item, status: bulkActions.action } : item
        ));
        setFilteredItems(prev => prev.map(item => 
          selectedItems.includes(item.id) ? { ...item, status: bulkActions.action } : item
        ));

        setSelectedItems([]);
        setBulkActions({ show: false, action: 'approve' });
        showNotification(`${selectedItems.length} items updated to ${bulkActions.action}`, 'success');
      } else {
        throw new Error('No data returned from API');
      }
    } catch (error) {
      console.error('Failed to update selected items:', error);
      showNotification(
        error.response?.data?.message || 'Failed to update selected items', 
        'error'
      );
    }
  };

  const getStatusCounts = () => {
    const counts = {
      total: filteredItems.length,
      approved: filteredItems.filter(item => item.status === 'approved').length,
      rejected: filteredItems.filter(item => item.status === 'rejected').length,
      flagged: filteredItems.filter(item => item.status === 'flagged').length,
      pending: filteredItems.filter(item => item.status === 'pending').length,
      important: filteredItems.filter(item => item.isImportant).length
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="media-review-page">
      <div className="media-review-container">
        {/* Header */}
        <div className="media-review-header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="page-title">📸 Media Review</h1>
              <p className="page-subtitle">
                {viewMode === 'employee' 
                  ? 'View your uploaded media files' 
                  : 'Review and manage media uploads from completed jobs'
                }
              </p>
            </div>
            <div className="header-controls">
              {/* View Mode Toggle */}
              <div className="view-mode-toggle">
                <button
                  className={`view-mode-btn ${viewMode === 'admin' ? 'active' : ''}`}
                  onClick={() => setViewMode('admin')}
                >
                  👨‍💼 Admin View
                </button>
                <button
                  className={`view-mode-btn ${viewMode === 'employee' ? 'active' : ''}`}
                  onClick={() => setViewMode('employee')}
                >
                  👤 Employee View
                </button>
              </div>
              
              {/* Stats */}
              <div className="header-stats">
                <div className="stat-item">
                  <span className="stat-value">{statusCounts.total}</span>
                  <span className="stat-label">Total</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value approved">{statusCounts.approved}</span>
                  <span className="stat-label">Approved</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value pending">{statusCounts.pending}</span>
                  <span className="stat-label">Pending</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value flagged">{statusCounts.flagged}</span>
                  <span className="stat-label">Flagged</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value rejected">{statusCounts.rejected}</span>
                  <span className="stat-label">Rejected</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value important">{statusCounts.important}</span>
                  <span className="stat-label">Important</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <div className="media-filter-panel">
          <div className="filter-section">
            <div className="filter-item">
              <label className="filter-label">Status Filter</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="approved">✅ Approved</option>
                <option value="rejected">❌ Rejected</option>
                <option value="flagged">🚩 Flagged</option>
                <option value="pending">⏳ Pending</option>
              </select>
            </div>

            <div className="filter-item">
              <label className="filter-label">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                <option value="before">📸 Before</option>
                <option value="after">✨ After</option>
              </select>
            </div>

            <div className="filter-item">
              <label className="filter-label">Job</label>
              <select
                value={filters.jobId}
                onChange={(e) => handleFilterChange('jobId', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Jobs</option>
                {jobsList.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.id} - {job.title} ({job.mediaCount} media)
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <label className="filter-label">Search</label>
              <div className="search-input-container">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search by Job ID, Customer, or Staff..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="filter-item">
              <label className="filter-label">Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="date-input"
              />
            </div>

            <div className="filter-item">
              <label className="filter-label">Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="date-input"
              />
            </div>

            <div className="filter-item">
              <label className="filter-label">Show Important Only</label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={filters.showImportantOnly}
                  onChange={(e) => handleFilterChange('showImportantOnly', e.target.checked)}
                  className="filter-checkbox"
                />
                <span className="checkbox-label">⭐ Important Only</span>
              </label>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="bulk-actions-panel">
              <div className="bulk-actions-info">
                <span className="selected-count">{selectedItems.length} items selected</span>
              </div>
              <div className="bulk-actions-controls">
                <select
                  value={bulkActions.action}
                  onChange={(e) => setBulkActions(prev => ({ ...prev, action: e.target.value }))}
                  className="bulk-action-select"
                >
                  <option value="approve">✅ Approve Selected</option>
                  <option value="reject">❌ Reject Selected</option>
                  <option value="flagged">🚩 Flag Selected</option>
                  <option value="pending">⏳ Mark as Pending</option>
                </select>
                <button
                  onClick={handleBulkAction}
                  className="bulk-action-btn"
                >
                  Apply
                </button>
                <button
                  onClick={() => setSelectedItems([])}
                  className="bulk-clear-btn"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Selection Controls */}
        <div className="selection-controls">
          <label className="select-all-checkbox">
            <input
              type="checkbox"
              checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
              onChange={handleSelectAll}
            />
            <span>Select All ({filteredItems.length})</span>
          </label>
        </div>

        {/* Media Grid */}
        <div className="media-grid-container">
          {loading ? (
            <div className="loading-state">
              <LoadingSpinner size="lg" />
              <p>Loading media items...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <h3>Error Loading Media</h3>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={loadMediaItems}>
                🔄 Retry
              </button>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📸</div>
              <h3>No media items found</h3>
              <p>
                {viewMode === 'employee' 
                  ? 'You haven\'t uploaded any media files yet.' 
                  : 'Try adjusting your filters or check back later for new uploads.'
                }
              </p>
            </div>
          ) : (
            <div className="media-grid">
              {filteredItems.map((media, index) => (
                <MediaCard
                  key={media.id}
                  media={media}
                  onCardClick={handleCardClick}
                  onStatusChange={handleStatusChange}
                  onImportanceToggle={handleImportanceToggle}
                  onSelect={handleSelectItem}
                  isSelected={selectedItems.includes(media.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Media Viewer Modal */}
      <MediaViewerModal
        media={selectedMedia}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusChange={handleStatusChange}
        mediaItems={filteredItems}
        currentIndex={currentMediaIndex}
      />
    </div>
  );
};

export default MediaReview;

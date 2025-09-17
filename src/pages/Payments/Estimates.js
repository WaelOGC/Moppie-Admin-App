import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { getAllEstimates, getEstimateById, updateEstimate, createEstimate } from '../../api/payments';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Estimates = () => {
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEstimate, setSelectedEstimate] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingEstimate, setEditingEstimate] = useState(null);
  
  const [filters, setFilters] = useState({
    status: 'all',
    jobId: 'all',
    client: 'all',
    dateFrom: '',
    dateTo: '',
    search: ''
  });

  const [newEstimate, setNewEstimate] = useState({
    job_id: '',
    estimated_amount: '',
    estimated_duration_minutes: '',
    estimated_scheduled_date: '',
    estimated_scheduled_time: '',
    admin_notes: ''
  });

  const { showNotification } = useNotifications();

  // Load estimates data from backend
  useEffect(() => {
    loadEstimates();
  }, [filters]);

  const loadEstimates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Transform frontend filters to backend parameters
      const params = {
        status: filters.status !== 'all' ? filters.status : undefined,
        job_id: filters.jobId !== 'all' ? filters.jobId : undefined,
        client: filters.client !== 'all' ? filters.client : undefined,
        search: filters.search || undefined,
        date_from: filters.dateFrom || undefined,
        date_to: filters.dateTo || undefined
      };

      // Remove undefined values
      Object.keys(params).forEach(key => 
        params[key] === undefined && delete params[key]
      );

      const response = await getAllEstimates(params);
      
      if (response.data && response.data.results) {
        // Handle paginated response
        setEstimates(response.data.results);
      } else if (Array.isArray(response.data)) {
        // Handle direct array response
        setEstimates(response.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Failed to load estimates:', error);
      setError('Failed to load estimates');
      showNotification(
        error.response?.data?.message || 'Failed to load estimates', 
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEstimate = async () => {
    try {
      const response = await createEstimate(newEstimate);
      
      if (response.data) {
        setEstimates(prev => [response.data, ...prev]);
        setShowCreateModal(false);
        setNewEstimate({
          job_id: '',
          estimated_amount: '',
          estimated_duration_minutes: '',
          estimated_scheduled_date: '',
          estimated_scheduled_time: '',
          admin_notes: ''
        });
        showNotification('Estimate created successfully!', 'success');
      } else {
        throw new Error('No data returned from API');
      }
    } catch (error) {
      console.error('Failed to create estimate:', error);
      showNotification(
        error.response?.data?.message || 'Failed to create estimate', 
        'error'
      );
    }
  };

  const handleUpdateEstimate = async (estimateId, updates) => {
    try {
      const response = await updateEstimate(estimateId, updates);
      
      if (response.data) {
        setEstimates(prev => prev.map(est => 
          est.id === estimateId ? { ...est, ...updates } : est
        ));
        setEditingEstimate(null);
        showNotification('Estimate updated successfully!', 'success');
      } else {
        throw new Error('No data returned from API');
      }
    } catch (error) {
      console.error('Failed to update estimate:', error);
      showNotification(
        error.response?.data?.message || 'Failed to update estimate', 
        'error'
      );
    }
  };

  const handleViewEstimate = async (estimateId) => {
    try {
      const response = await getEstimateById(estimateId);
      setSelectedEstimate(response.data);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Failed to load estimate details:', error);
      showNotification('Failed to load estimate details', 'error');
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending_client_approval: { 
        color: '#f59e0b', 
        bgColor: 'rgba(245, 158, 11, 0.1)', 
        icon: '🟡', 
        label: 'Pending Client Approval' 
      },
      client_approved: { 
        color: '#10b981', 
        bgColor: 'rgba(16, 185, 129, 0.1)', 
        icon: '✅', 
        label: 'Client Approved' 
      },
      client_rejected: { 
        color: '#ef4444', 
        bgColor: 'rgba(239, 68, 68, 0.1)', 
        icon: '❌', 
        label: 'Client Rejected' 
      },
      job_scheduled: { 
        color: '#3b82f6', 
        bgColor: 'rgba(59, 130, 246, 0.1)', 
        icon: '📅', 
        label: 'Job Scheduled' 
      }
    };
    return configs[status] || configs.pending_client_approval;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-EU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString ? timeString.substring(0, 5) : '';
  };

  if (loading) {
    return (
      <div className="content-area">
        <div className="loading-container">
          <LoadingSpinner size="lg" />
          <p>Loading estimates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-area">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Estimates</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadEstimates}>
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-area">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="page-title">💰 Estimates Management</h1>
            <p className="page-description">Create, view, and manage payment estimates</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            ➕ Create Estimate
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <div className="estimates-filters">
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending_client_approval">🟡 Pending Client Approval</option>
            <option value="client_approved">✅ Client Approved</option>
            <option value="client_rejected">❌ Client Rejected</option>
            <option value="job_scheduled">📅 Job Scheduled</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Job ID:</label>
          <input
            type="text"
            placeholder="Search by Job ID..."
            value={filters.jobId}
            onChange={(e) => setFilters(prev => ({ ...prev, jobId: e.target.value }))}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Client:</label>
          <input
            type="text"
            placeholder="Search by client name..."
            value={filters.client}
            onChange={(e) => setFilters(prev => ({ ...prev, client: e.target.value }))}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Date From:</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Date To:</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Search estimates..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="filter-search"
          />
        </div>
      </div>

      {/* Estimates Table */}
      <div className="estimates-table-container">
        <div className="table-header">
          <h3>Estimates ({estimates.length})</h3>
        </div>

        <div className="estimates-table-wrapper">
          <table className="estimates-table">
            <thead>
              <tr>
                <th>Estimate ID</th>
                <th>Job ID</th>
                <th>Client</th>
                <th>Amount</th>
                <th>Duration</th>
                <th>Scheduled Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {estimates.map((estimate) => {
                const statusConfig = getStatusConfig(estimate.status);
                return (
                  <tr key={estimate.id}>
                    <td className="estimate-id">{estimate.id}</td>
                    <td className="job-id">{estimate.job_id}</td>
                    <td className="client-name">{estimate.client_name}</td>
                    <td className="amount">{formatCurrency(estimate.estimated_amount)}</td>
                    <td className="duration">{estimate.estimated_duration_minutes} min</td>
                    <td className="scheduled-date">
                      {estimate.estimated_scheduled_date ? formatDate(estimate.estimated_scheduled_date) : 'TBD'}
                    </td>
                    <td className="status">
                      <span
                        className="status-badge"
                        style={{
                          color: statusConfig.color,
                          backgroundColor: statusConfig.bgColor,
                          borderColor: statusConfig.color
                        }}
                      >
                        {statusConfig.icon} {statusConfig.label}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className="action-btn view-btn"
                        onClick={() => handleViewEstimate(estimate.id)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => setEditingEstimate(estimate)}
                        title="Edit Estimate"
                      >
                        ✏️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Estimate Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Estimate</h3>
              <button 
                className="modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="job-id">Job ID</label>
                <input
                  id="job-id"
                  type="text"
                  value={newEstimate.job_id}
                  onChange={(e) => setNewEstimate(prev => ({ ...prev, job_id: e.target.value }))}
                  className="form-input"
                  placeholder="Enter job ID"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="estimated-amount">Estimated Amount (€)</label>
                <input
                  id="estimated-amount"
                  type="number"
                  step="0.01"
                  value={newEstimate.estimated_amount}
                  onChange={(e) => setNewEstimate(prev => ({ ...prev, estimated_amount: e.target.value }))}
                  className="form-input"
                  placeholder="0.00"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="duration">Duration (minutes)</label>
                <input
                  id="duration"
                  type="number"
                  value={newEstimate.estimated_duration_minutes}
                  onChange={(e) => setNewEstimate(prev => ({ ...prev, estimated_duration_minutes: e.target.value }))}
                  className="form-input"
                  placeholder="120"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="scheduled-date">Scheduled Date</label>
                <input
                  id="scheduled-date"
                  type="date"
                  value={newEstimate.estimated_scheduled_date}
                  onChange={(e) => setNewEstimate(prev => ({ ...prev, estimated_scheduled_date: e.target.value }))}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="scheduled-time">Scheduled Time</label>
                <input
                  id="scheduled-time"
                  type="time"
                  value={newEstimate.estimated_scheduled_time}
                  onChange={(e) => setNewEstimate(prev => ({ ...prev, estimated_scheduled_time: e.target.value }))}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="admin-notes">Admin Notes</label>
                <textarea
                  id="admin-notes"
                  value={newEstimate.admin_notes}
                  onChange={(e) => setNewEstimate(prev => ({ ...prev, admin_notes: e.target.value }))}
                  className="form-textarea"
                  rows="3"
                  placeholder="Additional notes for this estimate..."
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleCreateEstimate}
              >
                Create Estimate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estimate Detail Modal */}
      {showDetailModal && selectedEstimate && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Estimate Details - {selectedEstimate.id}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowDetailModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="estimate-details-grid">
                <div className="detail-section">
                  <h4>Job Information</h4>
                  <div className="detail-item">
                    <span className="detail-label">Job ID:</span>
                    <span className="detail-value">{selectedEstimate.job_id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Client:</span>
                    <span className="detail-value">{selectedEstimate.client_name}</span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Estimate Details</h4>
                  <div className="detail-item">
                    <span className="detail-label">Amount:</span>
                    <span className="detail-value">{formatCurrency(selectedEstimate.estimated_amount)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">{selectedEstimate.estimated_duration_minutes} minutes</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Scheduled Date:</span>
                    <span className="detail-value">
                      {selectedEstimate.estimated_scheduled_date ? formatDate(selectedEstimate.estimated_scheduled_date) : 'TBD'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Scheduled Time:</span>
                    <span className="detail-value">
                      {selectedEstimate.estimated_scheduled_time ? formatTime(selectedEstimate.estimated_scheduled_time) : 'TBD'}
                    </span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Status & Notes</h4>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value">
                      <span
                        className="status-badge"
                        style={{
                          color: getStatusConfig(selectedEstimate.status).color,
                          backgroundColor: getStatusConfig(selectedEstimate.status).bgColor,
                          borderColor: getStatusConfig(selectedEstimate.status).color
                        }}
                      >
                        {getStatusConfig(selectedEstimate.status).icon} {getStatusConfig(selectedEstimate.status).label}
                      </span>
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Admin Notes:</span>
                    <span className="detail-value">{selectedEstimate.admin_notes || 'No notes'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowDetailModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Estimates;

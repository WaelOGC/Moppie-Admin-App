import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { getClientEstimates, approveEstimate, rejectEstimate } from '../../api/payments';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ClientEstimates = () => {
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEstimate, setSelectedEstimate] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [filters, setFilters] = useState({
    status: 'pending_client_approval', // Default to pending approval
    search: ''
  });

  const [rejectionData, setRejectionData] = useState({
    rejection_reason: '',
    alternative_offer: '',
    counter_amount: '',
    notes: ''
  });

  const { showNotification } = useNotifications();

  // Load client estimates data from backend
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
        search: filters.search || undefined
      };

      // Remove undefined values
      Object.keys(params).forEach(key => 
        params[key] === undefined && delete params[key]
      );

      const response = await getClientEstimates(params);
      
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
      console.error('Failed to load client estimates:', error);
      setError('Failed to load estimates');
      showNotification(
        error.response?.data?.message || 'Failed to load estimates', 
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApproveEstimate = async () => {
    if (!selectedEstimate) return;

    try {
      setActionLoading(true);
      const response = await approveEstimate(selectedEstimate.job_id, {
        approval: true,
        approved_at: new Date().toISOString(),
        client_notes: 'Approved by client'
      });
      
      if (response.data) {
        // Update local state
        setEstimates(prev => prev.map(est => 
          est.id === selectedEstimate.id 
            ? { ...est, status: 'client_approved' }
            : est
        ));
        
        setShowApprovalModal(false);
        setSelectedEstimate(null);
        showNotification('Estimate approved successfully!', 'success');
      } else {
        throw new Error('No data returned from API');
      }
    } catch (error) {
      console.error('Failed to approve estimate:', error);
      showNotification(
        error.response?.data?.message || 'Failed to approve estimate', 
        'error'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectEstimate = async () => {
    if (!selectedEstimate) return;

    try {
      setActionLoading(true);
      const response = await rejectEstimate(selectedEstimate.job_id, {
        rejection_reason: rejectionData.rejection_reason,
        alternative_offer: rejectionData.alternative_offer,
        counter_amount: rejectionData.counter_amount ? parseFloat(rejectionData.counter_amount) : null,
        notes: rejectionData.notes,
        rejected_at: new Date().toISOString()
      });
      
      if (response.data) {
        // Update local state
        setEstimates(prev => prev.map(est => 
          est.id === selectedEstimate.id 
            ? { ...est, status: 'client_rejected' }
            : est
        ));
        
        setShowRejectionModal(false);
        setSelectedEstimate(null);
        setRejectionData({
          rejection_reason: '',
          alternative_offer: '',
          counter_amount: '',
          notes: ''
        });
        showNotification('Estimate rejected with counter-offer!', 'success');
      } else {
        throw new Error('No data returned from API');
      }
    } catch (error) {
      console.error('Failed to reject estimate:', error);
      showNotification(
        error.response?.data?.message || 'Failed to reject estimate', 
        'error'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const openApprovalModal = (estimate) => {
    setSelectedEstimate(estimate);
    setShowApprovalModal(true);
  };

  const openRejectionModal = (estimate) => {
    setSelectedEstimate(estimate);
    setShowRejectionModal(true);
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending_client_approval: { 
        color: '#f59e0b', 
        bgColor: 'rgba(245, 158, 11, 0.1)', 
        icon: '🟡', 
        label: 'Pending Your Approval' 
      },
      client_approved: { 
        color: '#10b981', 
        bgColor: 'rgba(16, 185, 129, 0.1)', 
        icon: '✅', 
        label: 'Approved' 
      },
      client_rejected: { 
        color: '#ef4444', 
        bgColor: 'rgba(239, 68, 68, 0.1)', 
        icon: '❌', 
        label: 'Rejected' 
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
          <p>Loading your estimates...</p>
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
            <h1 className="page-title">💰 Payment Estimates</h1>
            <p className="page-description">Review and approve payment estimates for your jobs</p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-value">{estimates.length}</span>
              <span className="stat-label">Total Estimates</span>
            </div>
            <div className="stat-item">
              <span className="stat-value pending">
                {estimates.filter(e => e.status === 'pending_client_approval').length}
              </span>
              <span className="stat-label">Pending Approval</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <div className="client-estimates-filters">
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="filter-select"
          >
            <option value="all">All Estimates</option>
            <option value="pending_client_approval">🟡 Pending Approval</option>
            <option value="client_approved">✅ Approved</option>
            <option value="client_rejected">❌ Rejected</option>
            <option value="job_scheduled">📅 Job Scheduled</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Search by job ID or description..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="filter-search"
          />
        </div>
      </div>

      {/* Estimates Cards */}
      <div className="client-estimates-grid">
        {estimates.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💰</div>
            <h3>No estimates found</h3>
            <p>
              {filters.status === 'pending_client_approval' 
                ? 'You don\'t have any estimates pending approval.' 
                : 'No estimates match your current filters.'
              }
            </p>
          </div>
        ) : (
          estimates.map((estimate) => {
            const statusConfig = getStatusConfig(estimate.status);
            return (
              <div key={estimate.id} className="estimate-card">
                <div className="estimate-header">
                  <div className="estimate-id">Estimate #{estimate.id}</div>
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
                </div>

                <div className="estimate-details">
                  <div className="detail-row">
                    <span className="detail-label">Job ID:</span>
                    <span className="detail-value">{estimate.job_id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Amount:</span>
                    <span className="detail-value amount">{formatCurrency(estimate.estimated_amount)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">{estimate.estimated_duration_minutes} minutes</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Scheduled:</span>
                    <span className="detail-value">
                      {estimate.estimated_scheduled_date ? formatDate(estimate.estimated_scheduled_date) : 'TBD'}
                      {estimate.estimated_scheduled_time && ` at ${formatTime(estimate.estimated_scheduled_time)}`}
                    </span>
                  </div>
                  {estimate.admin_notes && (
                    <div className="detail-row">
                      <span className="detail-label">Notes:</span>
                      <span className="detail-value">{estimate.admin_notes}</span>
                    </div>
                  )}
                </div>

                {estimate.status === 'pending_client_approval' && (
                  <div className="estimate-actions">
                    <button
                      className="btn btn-success approve-btn"
                      onClick={() => openApprovalModal(estimate)}
                    >
                      ✅ Approve Estimate
                    </button>
                    <button
                      className="btn btn-danger reject-btn"
                      onClick={() => openRejectionModal(estimate)}
                    >
                      ❌ Reject & Counter-Offer
                    </button>
                  </div>
                )}

                {estimate.status === 'client_approved' && (
                  <div className="estimate-status">
                    <div className="status-message success">
                      ✅ You approved this estimate. The job will be scheduled soon.
                    </div>
                  </div>
                )}

                {estimate.status === 'client_rejected' && (
                  <div className="estimate-status">
                    <div className="status-message rejected">
                      ❌ You rejected this estimate. Your counter-offer has been sent to the admin.
                    </div>
                  </div>
                )}

                {estimate.status === 'job_scheduled' && (
                  <div className="estimate-status">
                    <div className="status-message scheduled">
                      📅 This job has been scheduled and is ready to begin.
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Approval Confirmation Modal */}
      {showApprovalModal && selectedEstimate && (
        <div className="modal-overlay" onClick={() => setShowApprovalModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Approve Estimate</h3>
              <button 
                className="modal-close"
                onClick={() => setShowApprovalModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="approval-confirmation">
                <div className="confirmation-icon">✅</div>
                <h4>Confirm Approval</h4>
                <p>Are you sure you want to approve this estimate?</p>
                
                <div className="estimate-summary">
                  <div className="summary-item">
                    <span className="summary-label">Job ID:</span>
                    <span className="summary-value">{selectedEstimate.job_id}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Amount:</span>
                    <span className="summary-value">{formatCurrency(selectedEstimate.estimated_amount)}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Duration:</span>
                    <span className="summary-value">{selectedEstimate.estimated_duration_minutes} minutes</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowApprovalModal(false)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button 
                className="btn btn-success"
                onClick={handleApproveEstimate}
                disabled={actionLoading}
              >
                {actionLoading ? 'Approving...' : '✅ Approve Estimate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedEstimate && (
        <div className="modal-overlay" onClick={() => setShowRejectionModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reject Estimate & Counter-Offer</h3>
              <button 
                className="modal-close"
                onClick={() => setShowRejectionModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="rejection-form">
                <div className="form-group">
                  <label htmlFor="rejection-reason">Reason for Rejection</label>
                  <select
                    id="rejection-reason"
                    value={rejectionData.rejection_reason}
                    onChange={(e) => setRejectionData(prev => ({ ...prev, rejection_reason: e.target.value }))}
                    className="form-select"
                    required
                  >
                    <option value="">Select a reason...</option>
                    <option value="price_too_high">Price is too high</option>
                    <option value="timing_conflict">Timing doesn't work</option>
                    <option value="service_not_needed">Service not needed</option>
                    <option value="found_alternative">Found alternative provider</option>
                    <option value="other">Other reason</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="alternative-offer">Alternative Offer</label>
                  <select
                    id="alternative-offer"
                    value={rejectionData.alternative_offer}
                    onChange={(e) => setRejectionData(prev => ({ ...prev, alternative_offer: e.target.value }))}
                    className="form-select"
                  >
                    <option value="">Select an alternative...</option>
                    <option value="lower_price">Lower price</option>
                    <option value="different_timing">Different timing</option>
                    <option value="different_service">Different service</option>
                    <option value="no_alternative">No alternative</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="counter-amount">Counter Offer Amount (€)</label>
                  <input
                    id="counter-amount"
                    type="number"
                    step="0.01"
                    value={rejectionData.counter_amount}
                    onChange={(e) => setRejectionData(prev => ({ ...prev, counter_amount: e.target.value }))}
                    className="form-input"
                    placeholder="Enter your counter offer amount"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="rejection-notes">Additional Notes</label>
                  <textarea
                    id="rejection-notes"
                    value={rejectionData.notes}
                    onChange={(e) => setRejectionData(prev => ({ ...prev, notes: e.target.value }))}
                    className="form-textarea"
                    rows="3"
                    placeholder="Any additional comments or requests..."
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowRejectionModal(false)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleRejectEstimate}
                disabled={actionLoading || !rejectionData.rejection_reason}
              >
                {actionLoading ? 'Sending...' : '❌ Reject & Send Counter-Offer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientEstimates;

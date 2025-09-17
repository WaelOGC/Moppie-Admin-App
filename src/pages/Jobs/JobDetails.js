import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import { jobsAPI } from '../../api/jobs';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [newNote, setNewNote] = useState('');
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [checkingConflicts, setCheckingConflicts] = useState(false);
  const [conflicts, setConflicts] = useState([]);
  const [showConflictConfirmation, setShowConflictConfirmation] = useState(false);
  const { showNotification } = useNotifications();

  useEffect(() => {
    if (id) {
      loadJobDetails();
      loadAvailableEmployees();
    }
  }, [id]);

  const loadAvailableEmployees = async () => {
    try {
      // This would typically come from a staff API
      // For now, using mock data
      const mockEmployees = [
        { id: 1, name: 'Maria Garcia', role: 'Supervisor', phone: '+31 6 1234 5678' },
        { id: 2, name: 'John Smith', role: 'Cleaner', phone: '+31 6 2345 6789' },
        { id: 3, name: 'Sarah Johnson', role: 'Cleaner', phone: '+31 6 3456 7890' },
        { id: 4, name: 'David Wilson', role: 'Supervisor', phone: '+31 6 4567 8901' }
      ];
      setAvailableEmployees(mockEmployees);
    } catch (error) {
      console.error('Failed to load employees:', error);
    }
  };

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getJobById(id);
      
      if (response.success) {
        setJob(response.data);
        setNewStatus(response.data.status);
      } else {
        showNotification('Job not found', 'error');
        navigate('/jobs');
      }
    } catch (error) {
      showNotification('Failed to load job details', 'error');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const response = await jobsAPI.updateJobStatus(id, newStatus, statusNote);
      
      if (response.success) {
        setJob(response.data);
        setShowStatusModal(false);
        setStatusNote('');
        showNotification(`Job status updated to ${newStatus}`, 'success');
      } else {
        showNotification('Failed to update status', 'error');
      }
    } catch (error) {
      showNotification('Failed to update job status', 'error');
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      showNotification('Please enter a note', 'error');
      return;
    }

    try {
      const response = await jobsAPI.addJobNote(id, newNote, 'Admin');
      
      if (response.success) {
        setJob(prev => ({
          ...prev,
          notes: [...prev.notes, response.data]
        }));
        setNewNote('');
        setShowNoteModal(false);
        showNotification('Note added successfully', 'success');
      } else {
        showNotification('Failed to add note', 'error');
      }
    } catch (error) {
      showNotification('Failed to add note', 'error');
    }
  };

  const handleMediaUpload = async (file, type) => {
    try {
      setUploadingMedia(true);
      const response = await jobsAPI.uploadJobMedia(id, file, type);
      
      if (response.success) {
        setJob(prev => ({
          ...prev,
          media: {
            ...prev.media,
            [type]: [...prev.media[type], response.data]
          }
        }));
        showNotification('Media uploaded successfully', 'success');
      } else {
        showNotification('Failed to upload media', 'error');
      }
    } catch (error) {
      showNotification('Failed to upload media', 'error');
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleCancelJob = async () => {
    if (window.confirm(`Are you sure you want to cancel job ${job.jobId}?`)) {
      try {
        const response = await jobsAPI.cancelJob(id, 'Cancelled by admin');
        
        if (response.success) {
          setJob(response.data);
          showNotification('Job cancelled successfully', 'success');
        } else {
          showNotification('Failed to cancel job', 'error');
        }
      } catch (error) {
        showNotification('Failed to cancel job', 'error');
      }
    }
  };

  const handleCheckConflicts = async () => {
    if (selectedEmployees.length === 0) {
      showNotification('Please select employees first', 'warning');
      return;
    }

    try {
      setCheckingConflicts(true);
      const startDatetime = `${job.bookingInfo.date}T${job.bookingInfo.time}:00`;
      const endDatetime = `${job.bookingInfo.date}T${new Date(new Date(startDatetime).getTime() + job.bookingInfo.duration * 60 * 60 * 1000).toISOString().slice(11, 19)}`;
      
      const response = await jobsAPI.checkConflicts(id, startDatetime, endDatetime, selectedEmployees);
      
      if (response.success) {
        setConflicts(response.data.conflicts || []);
        if (response.data.conflicts && response.data.conflicts.length > 0) {
          showNotification(`Found ${response.data.conflicts.length} conflicts`, 'warning');
        } else {
          showNotification('No conflicts found', 'success');
        }
      } else {
        showNotification('Failed to check conflicts', 'error');
      }
    } catch (error) {
      showNotification('Failed to check conflicts', 'error');
    } finally {
      setCheckingConflicts(false);
    }
  };

  const handleAssignEmployees = async () => {
    if (selectedEmployees.length === 0) {
      showNotification('Please select employees first', 'warning');
      return;
    }

    // Check for conflicts before assignment
    if (conflicts.length > 0) {
      setShowConflictConfirmation(true);
      return;
    }

    await performAssignment();
  };

  const performAssignment = async () => {
    try {
      const response = await jobsAPI.assignEmployees(id, selectedEmployees, assignmentNotes);
      
      if (response.success) {
        setJob(response.data);
        setShowAssignmentModal(false);
        setShowConflictConfirmation(false);
        setSelectedEmployees([]);
        setAssignmentNotes('');
        setConflicts([]);
        showNotification('Employees assigned successfully', 'success');
      } else {
        showNotification('Failed to assign employees', 'error');
      }
    } catch (error) {
      showNotification('Failed to assign employees', 'error');
    }
  };

  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
    // Clear conflicts when selection changes
    setConflicts([]);
  };

  // Auto-check conflicts when employees are selected and job has time info
  useEffect(() => {
    if (selectedEmployees.length > 0 && job && job.bookingInfo) {
      const timeoutId = setTimeout(() => {
        handleCheckConflicts();
      }, 500); // Debounce for 500ms
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedEmployees, job]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { icon: '⏳', label: 'Pending', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' },
      in_progress: { icon: '🚧', label: 'In Progress', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' },
      completed: { icon: '✅', label: 'Completed', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' },
      cancelled: { icon: '❌', label: 'Cancelled', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span
        className="status-badge"
        style={{
          color: config.color,
          backgroundColor: config.bgColor,
          borderColor: config.color
        }}
      >
        {config.icon} {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    if (priority === 'urgent') {
      return (
        <span className="priority-badge urgent">
          ⚠️ URGENT
        </span>
      );
    }
    return null;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-EU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-EU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-EU', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getProgressPercentage = () => {
    const statusOrder = ['pending', 'in_progress', 'completed'];
    const currentIndex = statusOrder.indexOf(job.status);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  if (loading) {
    return (
      <div className="job-details-loading">
        <div className="loading-spinner"></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-not-found">
        <h2>Job not found</h2>
        <Link to="/jobs" className="btn btn-primary">
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="content-area">
      {/* Header */}
      <div className="job-header">
        <div className="job-header-content">
          <Link to="/jobs" className="back-link">
            ← Back to Jobs
          </Link>
          
          <div className="job-title-section">
            <div className="job-title-row">
              <h1 className="job-title">{job.jobId}</h1>
              {getPriorityBadge(job.priority)}
            </div>
            <div className="job-status-row">
              {getStatusBadge(job.status)}
              <span className="job-created">
                Created: {formatDate(job.createdAt)}
              </span>
            </div>
          </div>
          
          <div className="job-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => setShowStatusModal(true)}
            >
              ✏️ Change Status
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => setShowNoteModal(true)}
            >
              📝 Add Note
            </button>
            <button 
              className="btn btn-info"
              onClick={() => setShowAssignmentModal(true)}
            >
              👥 Assign Employees
            </button>
            {job.status !== 'completed' && job.status !== 'cancelled' && (
              <button 
                className="btn btn-danger"
                onClick={handleCancelJob}
              >
                🗑️ Cancel Job
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="progress-timeline">
        <div className="timeline-header">
          <h3>Progress Timeline</h3>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>
        
        <div className="timeline-steps">
          <div className={`timeline-step ${job.status === 'pending' ? 'active' : job.statusLogs.some(log => log.status === 'pending') ? 'completed' : ''}`}>
            <div className="step-icon">📋</div>
            <div className="step-content">
              <div className="step-title">Assigned</div>
              <div className="step-time">
                {job.statusLogs.find(log => log.status === 'pending')?.timestamp ? 
                  formatDateTime(job.statusLogs.find(log => log.status === 'pending').timestamp) : 
                  'Not started'
                }
              </div>
            </div>
          </div>
          
          <div className={`timeline-step ${job.status === 'in_progress' ? 'active' : job.statusLogs.some(log => log.status === 'in_progress') ? 'completed' : ''}`}>
            <div className="step-icon">🔄</div>
            <div className="step-content">
              <div className="step-title">In Progress</div>
              <div className="step-time">
                {job.statusLogs.find(log => log.status === 'in_progress')?.timestamp ? 
                  formatDateTime(job.statusLogs.find(log => log.status === 'in_progress').timestamp) : 
                  'Not started'
                }
              </div>
            </div>
          </div>
          
          <div className={`timeline-step ${job.status === 'completed' ? 'active' : job.statusLogs.some(log => log.status === 'completed') ? 'completed' : ''}`}>
            <div className="step-icon">✅</div>
            <div className="step-content">
              <div className="step-title">Completed</div>
              <div className="step-time">
                {job.statusLogs.find(log => log.status === 'completed')?.timestamp ? 
                  formatDateTime(job.statusLogs.find(log => log.status === 'completed').timestamp) : 
                  'Not completed'
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="job-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'media' ? 'active' : ''}`}
          onClick={() => setActiveTab('media')}
        >
          📸 Media
        </button>
        <button 
          className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          📝 Status Logs
        </button>
        <button 
          className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          💬 Notes
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="overview-grid">
              <div className="info-card">
                <h3>Customer Information</h3>
                <div className="customer-info">
                  <div className="info-item">
                    <span className="info-label">Name:</span>
                    <span className="info-value">{job.customer.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone:</span>
                    <span className="info-value">{job.customer.phone}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{job.customer.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Address:</span>
                    <span className="info-value">{job.customer.address}</span>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <h3>Assigned Staff</h3>
                <div className="staff-info">
                  <div className="staff-avatar-large">
                    {job.assignedStaff.avatar ? (
                      <img src={job.assignedStaff.avatar} alt={job.assignedStaff.name} />
                    ) : (
                      <div className="avatar-placeholder-large">
                        {job.assignedStaff.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                  </div>
                  <div className="staff-details">
                    <div className="staff-name">{job.assignedStaff.name}</div>
                    <div className="staff-role">{job.assignedStaff.role}</div>
                    <div className="staff-phone">{job.assignedStaff.phone}</div>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <h3>Booking Information</h3>
                <div className="booking-info">
                  <div className="info-item">
                    <span className="info-label">Date:</span>
                    <span className="info-value">{formatDate(job.bookingInfo.date)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Time:</span>
                    <span className="info-value">{formatTime(job.bookingInfo.time)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Duration:</span>
                    <span className="info-value">{job.bookingInfo.duration} hours</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Service Type:</span>
                    <span className="info-value">{job.bookingInfo.serviceType}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Estimated Price:</span>
                    <span className="info-value price">{formatCurrency(job.bookingInfo.estimatedPrice)}</span>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <h3>Services</h3>
                <div className="services-list">
                  {job.services && job.services.length > 0 ? (
                    <ul>
                      {job.services.map((service, index) => (
                        <li key={index}>{service}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No specific services listed</p>
                  )}
                </div>
              </div>

              <div className="info-card">
                <h3>Job Description</h3>
                <div className="job-description">
                  <p>{job.description || 'No description provided.'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="media-tab">
            <div className="media-section">
              <div className="media-header">
                <h3>Before Photos</h3>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowMediaModal(true)}
                >
                  📤 Upload Before Photos
                </button>
              </div>
              
              {job.media.before.length === 0 ? (
                <div className="empty-media">
                  <div className="empty-icon">📷</div>
                  <p>No before photos uploaded yet</p>
                </div>
              ) : (
                <div className="media-grid">
                  {job.media.before.map(media => (
                    <div key={media.id} className="media-item">
                      <div className="media-placeholder">
                        <span className="media-icon">🖼️</span>
                        <span className="media-name">{media.fileName}</span>
                      </div>
                      <div className="media-info">
                        <span className="media-date">{formatDateTime(media.uploadedAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="media-section">
              <div className="media-header">
                <h3>After Photos</h3>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowMediaModal(true)}
                >
                  📤 Upload After Photos
                </button>
              </div>
              
              {job.media.after.length === 0 ? (
                <div className="empty-media">
                  <div className="empty-icon">📷</div>
                  <p>No after photos uploaded yet</p>
                </div>
              ) : (
                <div className="media-grid">
                  {job.media.after.map(media => (
                    <div key={media.id} className="media-item">
                      <div className="media-placeholder">
                        <span className="media-icon">🖼️</span>
                        <span className="media-name">{media.fileName}</span>
                      </div>
                      <div className="media-info">
                        <span className="media-date">{formatDateTime(media.uploadedAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="logs-tab">
            <div className="logs-header">
              <h3>Status Logs</h3>
              <span className="logs-count">{job.statusLogs.length} entries</span>
            </div>
            
            <div className="logs-list">
              {job.statusLogs.map(log => (
                <div key={log.id} className="log-item">
                  <div className="log-icon">
                    {log.status === 'pending' && '📋'}
                    {log.status === 'in_progress' && '🔄'}
                    {log.status === 'completed' && '✅'}
                    {log.status === 'cancelled' && '❌'}
                  </div>
                  <div className="log-content">
                    <div className="log-header">
                      <span className="log-status">{log.status.replace('_', ' ').toUpperCase()}</span>
                      <span className="log-time">{formatDateTime(log.timestamp)}</span>
                    </div>
                    <div className="log-note">{log.note}</div>
                    <div className="log-author">Updated by: {log.updatedBy}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="notes-tab">
            <div className="notes-header">
              <h3>Notes & Remarks</h3>
              <button 
                className="btn btn-primary"
                onClick={() => setShowNoteModal(true)}
              >
                ➕ Add Note
              </button>
            </div>
            
            {job.notes.length === 0 ? (
              <div className="empty-notes">
                <div className="empty-icon">📝</div>
                <h4>No notes yet</h4>
                <p>Add notes to track important information about this job.</p>
              </div>
            ) : (
              <div className="notes-list">
                {job.notes.map(note => (
                  <div key={note.id} className="note-card">
                    <div className="note-content">
                      <p className="note-text">{note.text}</p>
                    </div>
                    <div className="note-meta">
                      <span className="note-author">By {note.author}</span>
                      <span className="note-time">{formatDateTime(note.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Update Job Status</h3>
              <button 
                className="modal-close"
                onClick={() => setShowStatusModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="new-status">New Status</label>
                <select
                  id="new-status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="form-select"
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="in_progress">🚧 In Progress</option>
                  <option value="completed">✅ Completed</option>
                  <option value="cancelled">❌ Cancelled</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="status-note">Note (Optional)</label>
                <textarea
                  id="status-note"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="form-textarea"
                  rows="3"
                  placeholder="Add a note about this status change..."
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowStatusModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleStatusUpdate}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {showNoteModal && (
        <div className="modal-overlay" onClick={() => setShowNoteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Note</h3>
              <button 
                className="modal-close"
                onClick={() => setShowNoteModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="note-text">Note</label>
                <textarea
                  id="note-text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="form-textarea"
                  rows="4"
                  placeholder="Enter your note here..."
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowNoteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleAddNote}
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Upload Modal */}
      {showMediaModal && (
        <div className="modal-overlay" onClick={() => setShowMediaModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Upload Media</h3>
              <button 
                className="modal-close"
                onClick={() => setShowMediaModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="media-type">Media Type</label>
                <select
                  id="media-type"
                  className="form-select"
                >
                  <option value="before">Before Photos</option>
                  <option value="after">After Photos</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="media-file">Select File</label>
                <input
                  id="media-file"
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    const mediaType = document.getElementById('media-type').value;
                    files.forEach(file => handleMediaUpload(file, mediaType));
                  }}
                  className="form-input"
                />
              </div>
              
              {uploadingMedia && (
                <div className="upload-progress">
                  <div className="loading-spinner"></div>
                  <span>Uploading media...</span>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowMediaModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee Assignment Modal */}
      {showAssignmentModal && (
        <div className="modal-overlay" onClick={() => setShowAssignmentModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Assign Employees to {job.jobId}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowAssignmentModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="assignment-section">
                <h4>Available Employees</h4>
                <div className="employees-list">
                  {availableEmployees.map(employee => (
                    <div key={employee.id} className="employee-item">
                      <label className="employee-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(employee.id)}
                          onChange={() => handleEmployeeSelect(employee.id)}
                        />
                        <div className="employee-info">
                          <div className="employee-name">{employee.name}</div>
                          <div className="employee-role">{employee.role}</div>
                          <div className="employee-phone">{employee.phone}</div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {selectedEmployees.length > 0 && (
                <div className="assignment-section">
                  <div className="conflict-check-header">
                    <h4>Schedule Conflict Detection</h4>
                    {checkingConflicts && (
                      <div className="conflict-loading">
                        <span className="loading-spinner"></span>
                        <span>Checking conflicts...</span>
                      </div>
                    )}
                  </div>
                  
                  {conflicts.length > 0 && (
                    <div className="conflicts-alert">
                      <div className="conflict-alert-header">
                        <span className="conflict-icon">⚠️</span>
                        <h5>Conflicts Detected</h5>
                      </div>
                      <div className="conflicts-list">
                        {conflicts.map((conflict, index) => (
                          <div key={index} className="conflict-item">
                            <div className="conflict-employee">
                              <strong>{conflict.employee_name}</strong>
                            </div>
                            <div className="conflict-details">
                              <span className="conflict-job-id">{conflict.conflicting_job_id}</span>
                              <span className="conflict-time">
                                {conflict.conflict_start_time} – {conflict.conflict_end_time}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="conflict-note">
                        <small>These employees have overlapping schedules. You can still assign them with admin override.</small>
                      </div>
                    </div>
                  )}

                  {conflicts.length === 0 && !checkingConflicts && selectedEmployees.length > 0 && (
                    <div className="no-conflicts">
                      <span className="success-icon">✅</span>
                      <span>No schedule conflicts detected</span>
                    </div>
                  )}
                </div>
              )}

              <div className="assignment-section">
                <h4>Assignment Notes</h4>
                <textarea
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                  className="form-textarea"
                  rows="3"
                  placeholder="Add notes about this assignment..."
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowAssignmentModal(false)}
              >
                Cancel
              </button>
              <button 
                className={`btn ${conflicts.length > 0 ? 'btn-warning' : 'btn-primary'}`}
                onClick={handleAssignEmployees}
                disabled={selectedEmployees.length === 0}
              >
                {conflicts.length > 0 ? (
                  <>
                    ⚠️ Assign with Conflicts ({selectedEmployees.length})
                  </>
                ) : (
                  <>
                    Assign Employees ({selectedEmployees.length})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conflict Confirmation Modal */}
      {showConflictConfirmation && (
        <div className="modal-overlay" onClick={() => setShowConflictConfirmation(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>⚠️ Conflicts Detected</h3>
              <button 
                className="modal-close"
                onClick={() => setShowConflictConfirmation(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="conflict-confirmation-content">
                <p>Are you sure you want to assign employees with overlapping jobs?</p>
                
                <div className="conflicts-summary">
                  <h4>Conflicting Assignments:</h4>
                  <ul>
                    {conflicts.map((conflict, index) => (
                      <li key={index}>
                        <strong>{conflict.employee_name}</strong> is already assigned to{' '}
                        <span className="job-highlight">{conflict.conflicting_job_id}</span>{' '}
                        from {conflict.conflict_start_time} to {conflict.conflict_end_time}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="conflict-warning-box">
                  <span className="warning-icon">⚠️</span>
                  <div>
                    <strong>Warning:</strong> This will create double-booked schedules. 
                    Make sure this is intentional and that employees can handle overlapping assignments.
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowConflictConfirmation(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-warning"
                onClick={() => {
                  setShowConflictConfirmation(false);
                  performAssignment();
                }}
              >
                Yes, Assign with Conflicts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
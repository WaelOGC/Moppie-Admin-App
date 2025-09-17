import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import { getEmployeeProfile, getEmployeeSchedule, getEmployeeJobs, getEmployeeEarnings, getEmployeeMedia, staffAPI } from '../../api/staff';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './StaffDetails.css';

const StaffDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [editData, setEditData] = useState({});
  
  // Tab data states
  const [schedule, setSchedule] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [media, setMedia] = useState([]);
  const [tabLoading, setTabLoading] = useState({});
  
  const { showNotification } = useNotifications();

  useEffect(() => {
    if (id) {
      loadStaffDetails();
    }
  }, [id]);

  const loadStaffDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getEmployeeProfile(id);
      setStaff(response.data);
      setEditData(response.data);
    } catch (error) {
      console.error('Error loading staff details:', error);
      setError('Failed to load staff details');
      showNotification('error', 'Failed to load staff details');
    } finally {
      setLoading(false);
    }
  };

  const loadTabData = async (tabName) => {
    if (tabLoading[tabName]) return; // Already loading
    
    try {
      setTabLoading(prev => ({ ...prev, [tabName]: true }));
      
      switch (tabName) {
        case 'schedule':
          const scheduleResponse = await getEmployeeSchedule({ 
            employee_id: id,
            start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            end_date: new Date().toISOString().split('T')[0]
          });
          setSchedule(scheduleResponse.data);
          break;
          
        case 'jobs':
          const jobsResponse = await getEmployeeJobs({ employee_id: id });
          setJobs(jobsResponse.data);
          break;
          
        case 'earnings':
          const earningsResponse = await getEmployeeEarnings({ 
            employee_id: id,
            start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            end_date: new Date().toISOString().split('T')[0]
          });
          setEarnings(earningsResponse.data);
          break;
          
        case 'media':
          const mediaResponse = await getEmployeeMedia({ employee_id: id });
          setMedia(mediaResponse.data);
          break;
      }
    } catch (error) {
      console.error(`Error loading ${tabName} data:`, error);
      showNotification('error', `Failed to load ${tabName} data`);
    } finally {
      setTabLoading(prev => ({ ...prev, [tabName]: false }));
    }
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    loadTabData(tabName);
  };

  const handleStatusToggle = async () => {
    if (!staff) return;
    
    try {
      const newStatus = staff.status === 'online' ? 'offline' : 'online';
      const response = await staffAPI.updateStaffStatus(staff.id, newStatus);
      
      if (response.success) {
        setStaff(prev => ({
          ...prev,
          status: newStatus,
          lastActive: new Date().toISOString()
        }));
        showNotification('success', `Status updated to ${newStatus}`);
      } else {
        showNotification('error', response.error || 'Failed to update status');
      }
    } catch (error) {
      showNotification('error', 'Failed to update status');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await staffAPI.updateStaffProfile(staff.id, editData);
      
      if (response.success) {
        setStaff(response.data);
        setShowEditModal(false);
        showNotification('success', 'Profile updated successfully');
      } else {
        showNotification('error', response.error || 'Failed to update profile');
      }
    } catch (error) {
      showNotification('error', 'Failed to update profile');
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      showNotification('error', 'Please enter a note');
      return;
    }

    try {
      const response = await staffAPI.addStaffNote(staff.id, newNote, 'Admin');
      
      if (response.success) {
        setStaff(prev => ({
          ...prev,
          notes: [...prev.notes, response.data]
        }));
        setNewNote('');
        setShowNoteModal(false);
        showNotification('success', 'Note added successfully');
      } else {
        showNotification('error', response.error || 'Failed to add note');
      }
    } catch (error) {
      showNotification('error', 'Failed to add note');
    }
  };

  const handleDeleteStaff = async () => {
    if (window.confirm(`Are you sure you want to delete ${staff.name}? This action cannot be undone.`)) {
      try {
        const response = await staffAPI.deleteStaff(staff.id);
        
        if (response.success) {
          showNotification('success', `${staff.name} has been deleted`);
          navigate('/staff');
        } else {
          showNotification('error', response.error || 'Failed to delete staff member');
        }
      } catch (error) {
        showNotification('error', 'Failed to delete staff member');
      }
    }
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`status-badge status-${status}`}>
        <span className={`status-dot ${status}`}></span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      'Supervisor': '#3b82f6',
      'Cleaner': '#10b981',
      'Manager': '#8b5cf6'
    };
    
    return (
      <span 
        className="role-badge"
        style={{ backgroundColor: roleColors[role] || '#6b7280' }}
      >
        {role}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="staff-details-loading">
        <LoadingSpinner size="lg" />
        <p>Loading staff details...</p>
      </div>
    );
  }

  if (error || !staff) {
    return (
      <div className="staff-not-found">
        <div className="error-icon">⚠️</div>
        <h2>Staff member not found</h2>
        <p>{error || 'The requested staff member could not be found.'}</p>
        <div className="error-actions">
          <button className="btn btn-primary" onClick={loadStaffDetails}>
            🔄 Retry
          </button>
          <Link to="/staff" className="btn btn-secondary">
            ← Back to Staff Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-details-page">
      {/* Header */}
      <div className="staff-header">
        <div className="staff-header-content">
          <Link to="/staff" className="back-link">
            ← Back to Staff Directory
          </Link>
          
          <div className="staff-profile">
            <div className="staff-avatar-large">
              {staff.avatar ? (
                <img src={staff.avatar} alt={staff.name} />
              ) : (
                <div className="avatar-placeholder-large">
                  {staff.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>
            
            <div className="staff-info">
              <h1 className="staff-name">{staff.name}</h1>
              <div className="staff-meta">
                <div className="meta-item">
                  {getRoleBadge(staff.role)}
                </div>
                <div className="meta-item">
                  {getStatusBadge(staff.status)}
                </div>
                <div className="meta-item">
                  <span className="meta-label">Joined:</span>
                  <span className="meta-value">{formatDate(staff.joinDate)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="staff-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => setShowEditModal(true)}
            >
              ✏️ Edit Profile
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleStatusToggle}
            >
              {staff.status === 'online' ? 'Set Offline' : 'Set Online'}
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleDeleteStaff}
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="staff-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleTabChange('profile')}
        >
          👤 Profile Info
        </button>
        <button 
          className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => handleTabChange('schedule')}
        >
          📅 Schedule
        </button>
        <button 
          className={`tab-btn ${activeTab === 'earnings' ? 'active' : ''}`}
          onClick={() => handleTabChange('earnings')}
        >
          💰 Earnings
        </button>
        <button 
          className={`tab-btn ${activeTab === 'media' ? 'active' : ''}`}
          onClick={() => handleTabChange('media')}
        >
          📸 Media
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'profile' && (
          <div className="profile-tab">
            <div className="profile-grid">
              <div className="info-card">
                <h3>Contact Information</h3>
                <div className="contact-info">
                  <div className="contact-item">
                    <span className="contact-icon">📧</span>
                    <span className="contact-label">Email:</span>
                    <span className="contact-value">{staff.email}</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">📱</span>
                    <span className="contact-label">Phone:</span>
                    <span className="contact-value">{staff.phone}</span>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <h3>Status Information</h3>
                <div className="status-info">
                  <div className="status-item">
                    <span className="status-label">Current Status:</span>
                    <span className="status-value">{getStatusBadge(staff.status)}</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Last Active:</span>
                    <span className="status-value">{formatDateTime(staff.lastActive)}</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Join Date:</span>
                    <span className="status-value">{formatDate(staff.joinDate)}</span>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <h3>Quick Actions</h3>
                <div className="quick-actions">
                  <button 
                    className="action-btn"
                    onClick={() => setShowNoteModal(true)}
                  >
                    📝 Add Note
                  </button>
                  <button className="action-btn">
                    💬 Send Message
                  </button>
                  <button className="action-btn">
                    📊 View Performance
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="schedule-tab">
            <div className="schedule-header">
              <h3>Employee Schedule</h3>
              <span className="schedule-count">{schedule.length} shifts</span>
            </div>
            
            {tabLoading.schedule ? (
              <div className="loading-container">
                <LoadingSpinner size="md" />
                <p>Loading schedule...</p>
              </div>
            ) : schedule.length === 0 ? (
              <div className="empty-schedule">
                <div className="empty-icon">📅</div>
                <h4>No schedule data</h4>
                <p>This employee doesn't have any scheduled shifts.</p>
              </div>
            ) : (
              <div className="schedule-list">
                {schedule.map((shift, index) => (
                  <div key={index} className="shift-card">
                    <div className="shift-date">
                      <span className="shift-day">{formatDate(shift.date)}</span>
                    </div>
                    <div className="shift-details">
                      <div className="shift-time">
                        <span className="shift-label">Time:</span>
                        <span className="shift-value">{shift.start_time} - {shift.end_time}</span>
                      </div>
                      <div className="shift-hours">
                        <span className="shift-label">Hours:</span>
                        <span className="shift-value">{shift.hours_worked}h</span>
                      </div>
                      <div className="shift-status">
                        <span className={`status-badge status-${shift.status}`}>
                          {shift.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="earnings-tab">
            <div className="earnings-header">
              <h3>Employee Earnings</h3>
              <span className="earnings-period">Last 30 days</span>
            </div>
            
            {tabLoading.earnings ? (
              <div className="loading-container">
                <LoadingSpinner size="md" />
                <p>Loading earnings...</p>
              </div>
            ) : earnings.length === 0 ? (
              <div className="empty-earnings">
                <div className="empty-icon">💰</div>
                <h4>No earnings data</h4>
                <p>This employee doesn't have any earnings records.</p>
              </div>
            ) : (
              <div className="earnings-content">
                <div className="earnings-summary">
                  <div className="summary-card">
                    <h4>Total Hours Worked</h4>
                    <span className="summary-value">{earnings.total_hours || 0}h</span>
                  </div>
                  <div className="summary-card">
                    <h4>Hourly Rate</h4>
                    <span className="summary-value">€{earnings.hourly_rate || 0}</span>
                  </div>
                  <div className="summary-card">
                    <h4>Total Earnings</h4>
                    <span className="summary-value">€{earnings.total_earnings || 0}</span>
                  </div>
                  <div className="summary-card">
                    <h4>Payment Status</h4>
                    <span className={`status-badge status-${earnings.payment_status || 'pending'}`}>
                      {earnings.payment_status || 'Pending'}
                    </span>
                  </div>
                </div>
                
                <div className="earnings-breakdown">
                  <h4>Earnings Breakdown</h4>
                  {earnings.breakdown?.map((item, index) => (
                    <div key={index} className="earnings-item">
                      <div className="earnings-date">{formatDate(item.date)}</div>
                      <div className="earnings-hours">{item.hours}h</div>
                      <div className="earnings-amount">€{item.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'media' && (
          <div className="media-tab">
            <div className="media-header">
              <h3>Employee Media</h3>
              <span className="media-count">{media.length} files</span>
            </div>
            
            {tabLoading.media ? (
              <div className="loading-container">
                <LoadingSpinner size="md" />
                <p>Loading media...</p>
              </div>
            ) : media.length === 0 ? (
              <div className="empty-media">
                <div className="empty-icon">📸</div>
                <h4>No media files</h4>
                <p>This employee hasn't uploaded any media files.</p>
              </div>
            ) : (
              <div className="media-grid">
                {media.map((item, index) => (
                  <div key={index} className="media-card">
                    <div className="media-preview">
                      {item.type === 'image' ? (
                        <img src={item.url} alt={item.description} />
                      ) : (
                        <div className="media-placeholder">
                          <span className="media-icon">📄</span>
                        </div>
                      )}
                    </div>
                    <div className="media-info">
                      <h5 className="media-title">{item.job_title || 'Untitled'}</h5>
                      <p className="media-description">{item.description}</p>
                      <div className="media-meta">
                        <span className="media-date">{formatDate(item.uploaded_at)}</span>
                        <span className="media-type">{item.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button 
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="edit-name">Name</label>
                <input
                  id="edit-name"
                  type="text"
                  value={editData.name || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-role">Role</label>
                <select
                  id="edit-role"
                  value={editData.role || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, role: e.target.value }))}
                  className="form-select"
                >
                  <option value="Cleaner">Cleaner</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-email">Email</label>
                <input
                  id="edit-email"
                  type="email"
                  value={editData.email || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-phone">Phone</label>
                <input
                  id="edit-phone"
                  type="tel"
                  value={editData.phone || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleUpdateProfile}
              >
                Save Changes
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
    </div>
  );
};

export default StaffDetails;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import { jobsAPI } from '../../api/jobs';

const JobCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [jobs, setJobs] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [showJobModal, setShowJobModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    staff: 'all'
  });
  const [conflicts, setConflicts] = useState({});
  const [showConflictsOnly, setShowConflictsOnly] = useState(false);
  const { showNotification } = useNotifications();

  // Load jobs for current month and when filters change
  useEffect(() => {
    loadJobsForMonth();
  }, [currentDate, filters]);

  // Load conflicts when jobs are loaded
  useEffect(() => {
    if (Object.keys(jobs).length > 0) {
      loadConflicts();
    }
  }, [jobs]);

  const loadJobsForMonth = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const startDate = getStartOfMonth(currentDate);
      const endDate = getEndOfMonth(currentDate);
      
      // Include filters in the API call
      const backendFilters = {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        status: filters.status !== 'all' ? filters.status : undefined,
        staff_id: filters.staff !== 'all' ? filters.staff : undefined
      };

      // Remove undefined values
      Object.keys(backendFilters).forEach(key => 
        backendFilters[key] === undefined && delete backendFilters[key]
      );

      const response = await jobsAPI.getJobsForCalendar(
        backendFilters.start_date,
        backendFilters.end_date,
        backendFilters
      );
      
      if (response.success) {
        setJobs(response.data);
      } else {
        const errorMessage = response.error || 'Failed to load calendar jobs';
        setError(errorMessage);
        showNotification(errorMessage, 'error');
      }
    } catch (error) {
      const errorMessage = 'Failed to load calendar data';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadConflicts = async () => {
    try {
      const conflictsData = {};
      
      // Get all jobs for the current month
      const allJobs = [];
      Object.values(jobs).forEach(dayJobs => {
        allJobs.push(...dayJobs);
      });

      // Check for conflicts between jobs
      for (let i = 0; i < allJobs.length; i++) {
        const job1 = allJobs[i];
        const conflictsForJob = [];

        for (let j = i + 1; j < allJobs.length; j++) {
          const job2 = allJobs[j];
          
          // Check if jobs have overlapping times and same assigned staff
          if (hasTimeConflict(job1, job2) && hasStaffConflict(job1, job2)) {
            conflictsForJob.push({
              conflictingJob: job2,
              conflictType: 'time_overlap'
            });
          }
        }

        if (conflictsForJob.length > 0) {
          conflictsData[job1.id] = conflictsForJob;
        }
      }

      setConflicts(conflictsData);
    } catch (error) {
      console.error('Error loading conflicts:', error);
    }
  };

  const hasTimeConflict = (job1, job2) => {
    if (job1.bookingInfo.date !== job2.bookingInfo.date) return false;
    
    const time1 = job1.bookingInfo.time;
    const duration1 = job1.bookingInfo.duration;
    const time2 = job2.bookingInfo.time;
    const duration2 = job2.bookingInfo.duration;
    
    const start1 = parseTime(time1);
    const end1 = start1 + duration1 * 60;
    const start2 = parseTime(time2);
    const end2 = start2 + duration2 * 60;
    
    return (start1 < end2 && start2 < end1);
  };

  const hasStaffConflict = (job1, job2) => {
    if (!job1.assignedStaff || !job2.assignedStaff) return false;
    return job1.assignedStaff.id === job2.assignedStaff.id;
  };

  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const getStartOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const getEndOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  const getDaysInMonth = () => {
    const start = getStartOfMonth(currentDate);
    const end = getEndOfMonth(currentDate);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    const firstDay = start.getDay();
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    
    return days;
  };

  const getJobsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    const dayJobs = jobs[dateStr] || [];
    
    // Apply filters
    let filteredJobs = dayJobs;
    
    if (filters.status !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.status === filters.status);
    }
    
    if (filters.staff !== 'all') {
      filteredJobs = filteredJobs.filter(job => 
        job.assignedStaff && job.assignedStaff.id === parseInt(filters.staff)
      );
    }

    // Apply conflict filter
    if (showConflictsOnly) {
      filteredJobs = filteredJobs.filter(job => conflicts[job.id]);
    }
    
    return filteredJobs;
  };

  const handleDateClick = (date) => {
    if (!date) return;
    
    const dayJobs = getJobsForDate(date);
    setSelectedDate(date);
    setSelectedJobs(dayJobs);
    
    if (dayJobs.length > 0) {
      setShowJobModal(true);
    }
  };

  const handleMonthChange = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      in_progress: '#3b82f6',
      completed: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getPriorityIcon = (priority) => {
    return priority === 'urgent' ? '⚠️' : '';
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-EU', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-EU', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const getMonthName = () => {
    return currentDate.toLocaleDateString('en-EU', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getDayNames = () => {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  };

  // Staff members for filter
  const staffMembers = [
    { id: 'all', name: 'All Staff' },
    { id: 1, name: 'Maria Garcia' },
    { id: 2, name: 'John Smith' }
  ];

  return (
    <div className="content-area">
      {/* Header Section */}
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">📅 Job Calendar</h1>
          <p className="page-description">
            View all scheduled jobs in calendar format with color-coded statuses
          </p>
        </div>
        <div className="page-actions">
          <Link to="/jobs" className="btn btn-secondary">
            📋 List View
          </Link>
          {error && (
            <button 
              className="btn btn-warning btn-sm"
              onClick={loadJobsForMonth}
              title="Retry loading calendar"
            >
              🔄 Retry
            </button>
          )}
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="job-calendar-controls">
        <div className="date-navigation">
          <button 
            className="nav-btn"
            onClick={() => handleMonthChange('prev')}
          >
            ⬅ Prev
          </button>
          
          <div className="current-month">
            <h2>{getMonthName()}</h2>
          </div>
          
          <button 
            className="nav-btn"
            onClick={() => handleMonthChange('next')}
          >
            Next ➡
          </button>

          <button 
            className="today-btn"
            onClick={goToToday}
          >
            Today
          </button>
        </div>

        <div className="calendar-filters">
          <div className="filter-group">
            <label>Staff:</label>
            <select
              value={filters.staff}
              onChange={(e) => setFilters(prev => ({ ...prev, staff: e.target.value }))}
              className="filter-select"
            >
              {staffMembers.map(staff => (
                <option key={staff.id} value={staff.id}>{staff.name}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Status:</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">⏳ Pending</option>
              <option value="in_progress">🚧 In Progress</option>
              <option value="completed">✅ Completed</option>
              <option value="cancelled">❌ Cancelled</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="conflict-toggle">
              <input
                type="checkbox"
                checked={showConflictsOnly}
                onChange={(e) => setShowConflictsOnly(e.target.checked)}
              />
              <span className="toggle-label">⚠️ Show Conflicts Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="job-calendar-container">
        <div className="job-calendar-grid">
          {/* Day headers */}
          <div className="calendar-day-header">
            {getDayNames().map(day => (
              <div key={day} className="day-header">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="calendar-days">
            {getDaysInMonth().map((date, index) => {
              const dayJobs = getJobsForDate(date);
              const isCurrentDay = isToday(date);
              const isSelectedDay = isSelected(date);
              
              return (
                <div 
                  key={index} 
                  className={`calendar-day ${isCurrentDay ? 'today' : ''} ${isSelectedDay ? 'selected' : ''} ${!date ? 'empty' : ''}`}
                  onClick={() => handleDateClick(date)}
                >
                  {date && (
                    <>
                      <div className="day-number">{date.getDate()}</div>
                      <div className="day-jobs">
                        {dayJobs.slice(0, 3).map(job => {
                          const hasConflict = conflicts[job.id];
                          return (
                            <div 
                              key={job.id}
                              className={`job-indicator ${hasConflict ? 'conflict' : ''}`}
                              style={{ 
                                backgroundColor: hasConflict ? '#ef4444' : getStatusColor(job.status),
                                borderColor: hasConflict ? '#dc2626' : 'transparent',
                                borderWidth: hasConflict ? '2px' : '0px'
                              }}
                              title={`${job.jobId} - ${job.customer.name} (${job.status})${hasConflict ? ' - ⚠️ CONFLICT' : ''}`}
                            >
                              <span className="job-time">{formatTime(job.bookingInfo.time)}</span>
                              <span className="job-customer">{job.customer.name}</span>
                              {hasConflict && <span className="conflict-icon">⚠️</span>}
                              {getPriorityIcon(job.priority)}
                            </div>
                          );
                        })}
                        {dayJobs.length > 3 && (
                          <div className="more-jobs">
                            +{dayJobs.length - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="calendar-legend">
        <h3>Status Legend</h3>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
            <span>⏳ Pending</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
            <span>🚧 In Progress</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
            <span>✅ Completed</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
            <span>❌ Cancelled</span>
          </div>
          <div className="legend-item">
            <div className="legend-color conflict-indicator" style={{ backgroundColor: '#ef4444', border: '2px solid #dc2626' }}></div>
            <span>⚠️ Schedule Conflict</span>
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      {showJobModal && selectedDate && (
        <div className="modal-overlay" onClick={() => setShowJobModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Jobs for {formatDate(selectedDate)}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowJobModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              {selectedJobs.length === 0 ? (
                <div className="no-jobs">
                  <div className="no-jobs-icon">📅</div>
                  <h4>No jobs scheduled</h4>
                  <p>There are no jobs scheduled for this date.</p>
                </div>
              ) : (
                <div className="jobs-list">
                  {selectedJobs.map(job => (
                    <div key={job.id} className="job-card">
                      <div className="job-card-header">
                        <div className="job-id-section">
                          <h4 className="job-id">{job.jobId}</h4>
                          {job.priority === 'urgent' && (
                            <span className="priority-badge urgent">
                              ⚠️ URGENT
                            </span>
                          )}
                        </div>
                        <div 
                          className="status-indicator"
                          style={{ backgroundColor: getStatusColor(job.status) }}
                        >
                          {job.status.replace('_', ' ').toUpperCase()}
                        </div>
                      </div>
                      
                      <div className="job-card-content">
                        <div className="job-customer">
                          <h5 className="customer-name">{job.customer.name}</h5>
                          <p className="customer-phone">{job.customer.phone}</p>
                        </div>
                        
                        <div className="job-schedule">
                          <div className="schedule-item">
                            <span className="schedule-label">Time:</span>
                            <span className="schedule-value">{formatTime(job.bookingInfo.time)}</span>
                          </div>
                          <div className="schedule-item">
                            <span className="schedule-label">Duration:</span>
                            <span className="schedule-value">{job.bookingInfo.duration}h</span>
                          </div>
                          <div className="schedule-item">
                            <span className="schedule-label">Service:</span>
                            <span className="schedule-value">{job.bookingInfo.serviceType}</span>
                          </div>
                        </div>
                        
                        <div className="job-staff">
                          <div className="staff-info">
                            <div className="staff-avatar-small">
                              {job.assignedStaff.avatar ? (
                                <img src={job.assignedStaff.avatar} alt={job.assignedStaff.name} />
                              ) : (
                                <div className="avatar-placeholder-small">
                                  {job.assignedStaff.name.split(' ').map(n => n[0]).join('')}
                                </div>
                              )}
                            </div>
                            <div className="staff-details">
                              <div className="staff-name">{job.assignedStaff.name}</div>
                              <div className="staff-role">{job.assignedStaff.role}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="job-card-actions">
                        <Link 
                          to={`/jobs/${job.id}`} 
                          className="btn btn-primary btn-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowJobModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="calendar-error">
          <div className="error-icon">❌</div>
          <h3>Failed to load calendar</h3>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={loadJobsForMonth}
          >
            🔄 Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="calendar-loading">
          <div className="loading-spinner"></div>
          <p>Loading calendar...</p>
        </div>
      )}
    </div>
  );
};

export default JobCalendar;
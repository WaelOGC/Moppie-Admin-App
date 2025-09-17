import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import { jobsAPI } from '../../api/jobs';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalJobs, setTotalJobs] = useState(0);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    staff: 'all',
    dateFrom: '',
    dateTo: '',
    search: '',
    priority: 'all'
  });
  const { showNotification } = useNotifications();

  // Load jobs when filters or page changes
  useEffect(() => {
    loadJobs();
  }, [filters, currentPage]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const backendFilters = {
        ...filters,
        page: currentPage,
        page_size: itemsPerPage
      };
      
      const response = await jobsAPI.getJobsList(backendFilters);
      
      if (response.success) {
        setJobs(response.data);
        setFilteredJobs(response.data);
        setTotalJobs(response.total || response.data.length);
      } else {
        setError(response.error || 'Failed to load jobs');
        showNotification(response.error || 'Failed to load jobs', 'error');
      }
    } catch (error) {
      const errorMessage = 'Failed to load jobs data';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Reset to first page when filters change
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleStatusUpdate = async (jobId, newStatus) => {
    try {
      const response = await jobsAPI.updateJobStatus(jobId, newStatus);
      
      if (response.success) {
        setJobs(prev => prev.map(job => 
          job.id === jobId 
            ? { ...job, status: newStatus, updatedAt: new Date().toISOString() }
            : job
        ));
        showNotification(`Job status updated to ${newStatus}`, 'success');
      } else {
        showNotification('Failed to update status', 'error');
      }
    } catch (error) {
      showNotification('Failed to update job status', 'error');
    }
  };

  const handleCancelJob = async (jobId, jobName) => {
    if (window.confirm(`Are you sure you want to cancel job ${jobName}?`)) {
      try {
        const response = await jobsAPI.cancelJob(jobId, 'Cancelled by admin');
        
        if (response.success) {
          setJobs(prev => prev.map(job => 
            job.id === jobId 
              ? { ...job, status: 'cancelled', updatedAt: new Date().toISOString() }
              : job
          ));
          showNotification('Job cancelled successfully', 'success');
        } else {
          showNotification('Failed to cancel job', 'error');
        }
      } catch (error) {
        showNotification('Failed to cancel job', 'error');
      }
    }
  };

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
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
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

  // Pagination - now handled by backend
  const totalPages = Math.ceil(totalJobs / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredJobs; // Backend already returns paginated data

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
          <h1 className="page-title">🛠️ All Jobs</h1>
          <p className="page-description">
            Manage and track all cleaning jobs, assignments, and progress
          </p>
        </div>
        <div className="page-actions">
          <Link to="/jobs/calendar" className="btn btn-secondary">
            📅 Calendar View
          </Link>
          <button className="btn btn-primary">
            ➕ Create Job
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="jobs-search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by Job ID, Client name, or Staff..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="jobs-search-input"
          />
        </div>
      </div>

      {/* Filters Bar */}
      <div className="jobs-filters-bar">
        <div className="filters-left">
          <div className="filter-group">
            <label>Status Filter:</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
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
            <label>Staff Assigned:</label>
            <select
              value={filters.staff}
              onChange={(e) => handleFilterChange('staff', e.target.value)}
              className="filter-select"
            >
              {staffMembers.map(staff => (
                <option key={staff.id} value={staff.id}>{staff.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Date From:</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Date To:</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Priority:</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="filter-select"
            >
              <option value="all">All Priority</option>
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="filters-right">
          <div className="results-count">
            {filteredJobs.length} of {totalJobs} jobs
          </div>
          {error && (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={loadJobs}
              title="Retry loading jobs"
            >
              🔄 Retry
            </button>
          )}
        </div>
      </div>

      {/* Jobs Table */}
      <div className="jobs-table-container">
        <div className="table-header">
          <h3>Job Records ({filteredJobs.length})</h3>
          <div className="table-actions">
            <span>Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalJobs)} of {totalJobs}</span>
          </div>
        </div>

        <div className="jobs-table-wrapper">
          <table className="jobs-table">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Client Name</th>
                <th>Assigned Staff</th>
                <th>Service Type</th>
                <th>Scheduled Date/Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedJobs.map((job) => (
                <tr key={job.id} className={`job-table-row ${job.priority === 'urgent' ? 'urgent' : ''}`}>
                  <td className="job-id-cell">
                    <span className="job-id">{job.jobId}</span>
                    {getPriorityBadge(job.priority)}
                  </td>
                  <td className="customer-cell">
                    <div className="customer-name">{job.customer.name}</div>
                    <div className="customer-phone">{job.customer.phone}</div>
                  </td>
                  <td className="staff-cell">
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
                  </td>
                  <td className="service-type">{job.bookingInfo.serviceType}</td>
                  <td className="schedule-cell">
                    <div className="schedule-date">{formatDate(job.bookingInfo.date)}</div>
                    <div className="schedule-time">{formatTime(job.bookingInfo.time)}</div>
                  </td>
                  <td className="status">{getStatusBadge(job.status)}</td>
                  <td className="actions">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="action-btn view-btn"
                      title="View Details"
                    >
                      👁️
                    </Link>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => showNotification('Edit functionality coming soon!', 'info')}
                      title="Edit Job"
                    >
                      ✏️
                    </button>
                    <button
                      className="action-btn cancel-btn"
                      onClick={() => handleCancelJob(job.id, job.jobId)}
                      disabled={job.status === 'completed' || job.status === 'cancelled'}
                      title="Cancel Job"
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            
            <div className="pagination-info">
              Page {currentPage} of {totalPages}
            </div>
            
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredJobs.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-icon">💼</div>
          <h3>No jobs found</h3>
          <p>Try adjusting your filters or create a new job.</p>
          <button className="btn btn-primary">
            ➕ Create First Job
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="jobs-loading">
          <div className="loading-spinner"></div>
          <p>Loading jobs...</p>
        </div>
      )}
    </div>
  );
};

export default Jobs;
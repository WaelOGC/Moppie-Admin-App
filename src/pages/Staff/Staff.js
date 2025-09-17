import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import { getAllEmployees } from '../../api/staff';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    search: ''
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name-asc'); // 'name-asc', 'name-desc', 'recent'
  const [scrollIndex, setScrollIndex] = useState(0); // Current scroll position
  const gridRef = useRef(null);
  const { showNotification } = useNotifications();

  // Load staff data from backend
  useEffect(() => {
    loadStaffData();
  }, []);

  const loadStaffData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllEmployees();
      setStaff(response.data);
      setFilteredStaff(response.data);
    } catch (error) {
      console.error('Error loading staff data:', error);
      setError('Failed to load staff data');
      showNotification('error', 'Failed to load staff data');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...staff];

    // Apply role filter
    if (filters.role !== 'all') {
      filtered = filtered.filter(member => 
        member.role.toLowerCase() === filters.role.toLowerCase()
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(member => 
        member.status === filters.status
      );
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(searchTerm) ||
        member.email.toLowerCase().includes(searchTerm) ||
        member.role.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'recent':
          return new Date(b.joinDate) - new Date(a.joinDate);
        default:
          return 0;
      }
    });

    setFilteredStaff(filtered);
  }, [staff, filters, sortBy]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleAddStaff = () => {
    showNotification('Add Staff functionality coming soon!', 'info');
  };

  const handleEmailClick = (email) => {
    window.open(`mailto:${email}`, '_blank');
  };

  const handlePhoneClick = (phone) => {
    showNotification(`Calling ${phone}...`, 'info');
  };

  const handleScheduleClick = (staffName) => {
    showNotification(`Viewing schedule for ${staffName}...`, 'info');
  };

  // Pagination functionality for grid view
  const handlePagination = (direction) => {
    const cardsPerPage = 16; // 4 cards per row × 4 rows max
    const totalPages = Math.ceil(filteredStaff.length / cardsPerPage);
    
    if (direction === 'left' && scrollIndex > 0) {
      setScrollIndex(scrollIndex - cardsPerPage);
    } else if (direction === 'right' && scrollIndex + cardsPerPage < filteredStaff.length) {
      setScrollIndex(scrollIndex + cardsPerPage);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { icon: '✅', label: 'Active', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' },
      on_leave: { icon: '🌴', label: 'On Leave', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' },
      offline: { icon: '⛔', label: 'Offline', color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.1)' }
    };

    const config = statusConfig[status] || statusConfig.active;
    
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

  const getRoleBadge = (role) => {
    const roleColors = {
      'Supervisor': { color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' },
      'Cleaner': { color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' },
      'Manager': { color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.1)' },
      'Admin': { color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' }
    };
    
    const config = roleColors[role] || { color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.1)' };
    
    return (
      <span 
        className="role-badge"
        style={{ 
          color: config.color,
          backgroundColor: config.bgColor,
          borderColor: config.color
        }}
      >
        {role}
      </span>
    );
  };

  const StaffCard = ({ member }) => (
    <div className="staff-grid-card">
      <div className="staff-card-header">
        <div className="staff-avatar-container">
          <div className="staff-avatar">
            {member.avatar ? (
              <img src={member.avatar} alt={member.name} />
            ) : (
              <div className="avatar-placeholder">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
          <div className="staff-status-badge">
            {getStatusBadge(member.status)}
          </div>
        </div>
      </div>
      
      <div className="staff-card-body">
        <div className="staff-info-section">
          <h3 className="staff-name">{member.name}</h3>
          <div className="staff-role-badge">
            {getRoleBadge(member.role)}
          </div>
        </div>
        
        <div className="staff-contact-info">
          <div className="contact-item">
            <span className="contact-icon">📧</span>
            <span className="contact-text">{member.email}</span>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <span className="contact-text">{member.phone}</span>
          </div>
        </div>
        
        <div className="staff-schedule-info">
          <span className="schedule-label">Schedule:</span>
          <span className="schedule-value">{member.schedule}</span>
        </div>
      </div>
      
        <div className="staff-card-footer">
        <div className="action-buttons-compact">
          <button 
            className="action-btn-compact email-action"
            onClick={() => handleEmailClick(member.email)}
            title="Send Email"
          >
            <span className="btn-icon-compact">📧</span>
            <span className="btn-text-compact">Email</span>
          </button>
          <button 
            className="action-btn-compact phone-action"
            onClick={() => handlePhoneClick(member.phone)}
            title="Call Phone"
          >
            <span className="btn-icon-compact">📞</span>
            <span className="btn-text-compact">Call</span>
          </button>
          <button 
            className="action-btn-compact schedule-action"
            onClick={() => handleScheduleClick(member.name)}
            title="View Schedule"
          >
            <span className="btn-icon-compact">📅</span>
            <span className="btn-text-compact">Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );

  const StaffTableRow = ({ member, index }) => (
    <tr className={`staff-table-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
      <td className="name-column">
        <div className="staff-info-enhanced">
          <div className="staff-avatar-medium">
            {member.avatar ? (
              <img src={member.avatar} alt={member.name} />
            ) : (
              <div className="avatar-placeholder-medium">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
          <div className="staff-details-enhanced">
            <div className="staff-name-enhanced">{member.name}</div>
            <div className="staff-email-enhanced">{member.email}</div>
          </div>
        </div>
      </td>
      <td className="role-column">
        <div className="role-chip-enhanced">
          {getRoleBadge(member.role)}
        </div>
      </td>
      <td className="email-column">
        <div className="contact-info">
          <span className="contact-icon">📧</span>
          <span className="contact-text">{member.email}</span>
        </div>
      </td>
      <td className="phone-column">
        <div className="contact-info">
          <span className="contact-icon">📞</span>
          <span className="contact-text">{member.phone}</span>
        </div>
      </td>
      <td className="status-column">
        <div className="status-chip-enhanced">
          {getStatusBadge(member.status)}
        </div>
      </td>
      <td className="actions-column">
        <div className="table-actions-enhanced">
          <button 
            className="action-btn-enhanced email-action"
            onClick={() => handleEmailClick(member.email)}
            title="Send Email"
            aria-label={`Send email to ${member.name}`}
          >
            <span className="action-icon">📧</span>
            <span className="action-text">Email</span>
          </button>
          <button 
            className="action-btn-enhanced phone-action"
            onClick={() => handlePhoneClick(member.phone)}
            title="Call Phone"
            aria-label={`Call ${member.name}`}
          >
            <span className="action-icon">📞</span>
            <span className="action-text">Call</span>
          </button>
          <button 
            className="action-btn-enhanced schedule-action"
            onClick={() => handleScheduleClick(member.name)}
            title="View Schedule"
            aria-label={`View schedule for ${member.name}`}
          >
            <span className="action-icon">📅</span>
            <span className="action-text">Schedule</span>
          </button>
        </div>
      </td>
    </tr>
  );

  if (loading) {
    return (
      <div className="staff-directory-page">
        <div className="staff-page-container">
          <div className="loading-container">
            <LoadingSpinner size="lg" />
            <p>Loading staff directory...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="staff-directory-page">
        <div className="staff-page-container">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>Error Loading Staff Data</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={loadStaffData}>
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-directory-page">
      <div className="staff-page-container">
        {/* Header Section */}
        <div className="staff-page-header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="page-title">👥 Staff Directory</h1>
              <p className="page-subtitle">View and manage all team members, their roles, and availability.</p>
            </div>
            <button className="staff-add-btn" onClick={handleAddStaff}>
              <span className="btn-icon">➕</span>
              <span className="btn-text">Add New Staff</span>
            </button>
          </div>
        </div>

      {/* Enhanced Filter Panel */}
      <div className="staff-filter-panel">
        {/* Search Section */}
        <div className="search-section">
          <div className="modern-search-container">
            <div className="search-icon">🔍</div>
            <input
              type="text"
              placeholder="Search by name, role, or email..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="modern-search-input"
              autoComplete="off"
            />
            {filters.search && (
              <button
                className="clear-search-btn"
                onClick={() => handleFilterChange('search', '')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Controls Section */}
        <div className="controls-section">
          {/* Filters */}
          <div className="filters-group">
            <div className="filter-item">
              <label className="filter-label">Role</label>
              <div className="modern-select-wrapper">
                <select
                  value={filters.role}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  className="modern-select"
                >
                  <option value="all">All Roles</option>
                  <option value="cleaner">Cleaner</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="modern-select-arrow">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="filter-item">
              <label className="filter-label">Status</label>
              <div className="modern-select-wrapper">
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="modern-select"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active ✅</option>
                  <option value="on_leave">On Leave 🌴</option>
                  <option value="offline">Offline ⛔</option>
                </select>
                <div className="modern-select-arrow">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* View Mode & Sort */}
          <div className="view-sort-group">
            {/* View Mode Toggle */}
            <div className="view-mode-section">
              <label className="section-label">View Mode</label>
              <div className="pill-toggle" data-mode={viewMode}>
                <button
                  className={`pill-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <span className="pill-icon">🗂️</span>
                  <span className="pill-text">Grid</span>
                </button>
                <button
                  className={`pill-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <span className="pill-icon">📋</span>
                  <span className="pill-text">List</span>
                </button>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="sort-section">
              <label className="section-label">Sort by</label>
              <div className="modern-select-wrapper">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="modern-select"
                >
                  <option value="name-asc">A–Z</option>
                  <option value="name-desc">Z–A</option>
                  <option value="recent">Recently Added</option>
                </select>
                <div className="modern-select-arrow">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Content */}
      <div className="staff-content">
        {filteredStaff.length === 0 ? (
          <div className="empty-state-enhanced">
            <div className="empty-icon-enhanced">👥</div>
            <h3 className="empty-title">No staff members found</h3>
            <p className="empty-description">Try adjusting your filters or add new staff members.</p>
            <button className="btn btn-primary-enhanced" onClick={handleAddStaff}>
              <span className="btn-icon">➕</span>
              <span className="btn-text">Add First Staff Member</span>
            </button>
          </div>
        ) : (
          <div className="view-container">
            {viewMode === 'grid' ? (
              <div className="staff-grid-container">
                <div className="staff-grid-matrix-final" ref={gridRef}>
                  {filteredStaff.slice(scrollIndex, scrollIndex + 16).map((member, index) => (
                    <StaffCard key={member.id} member={member} />
                  ))}
                </div>
                <div className="grid-pagination-controls">
                  <button 
                    className="pagination-btn pagination-left"
                    onClick={() => handlePagination('left')}
                    title="Previous Page"
                    disabled={scrollIndex === 0}
                  >
                    ←
                  </button>
                  <div className="pagination-indicator">
                    <span className="current-page">{Math.ceil(scrollIndex / 16) + 1}</span>
                    <span className="total-pages">/ {Math.ceil(filteredStaff.length / 16)}</span>
                  </div>
                  <button 
                    className="pagination-btn pagination-right"
                    onClick={() => handlePagination('right')}
                    title="Next Page"
                    disabled={scrollIndex + 16 >= filteredStaff.length}
                  >
                    →
                  </button>
                </div>
              </div>
            ) : (
              <div className="staff-table-container-enhanced" key="list-view">
                <div className="table-header-enhanced">
                  <h3 className="table-title">Staff Directory</h3>
                  <div className="table-stats">
                    {filteredStaff.length} staff member{filteredStaff.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="table-wrapper">
                  <table className="staff-table-enhanced">
                    <thead>
                      <tr className="table-header-row">
                        <th className="name-header">Name</th>
                        <th className="role-header">Role</th>
                        <th className="email-header">Email</th>
                        <th className="phone-header">Phone</th>
                        <th className="status-header">Status</th>
                        <th className="actions-header">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStaff.map((member, index) => (
                        <StaffTableRow key={member.id} member={member} index={index} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Staff;
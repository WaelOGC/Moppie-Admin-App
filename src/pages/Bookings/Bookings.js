import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBookings, mockError } from '../../api/bookings';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useNotifications } from '../../hooks/useNotifications';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateFrom: '',
    dateTo: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const { showNotification } = useNotifications();

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const statusColors = {
    pending: '#f59e0b',
    approved: '#10b981',
    completed: '#3b82f6',
    cancelled: '#ef4444'
  };

  const statusLabels = {
    pending: 'Pending',
    approved: 'Approved',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate occasional errors for testing
      if (Math.random() < 0.1) {
        await mockError();
      }
      
      const response = await getBookings(filters);
      if (response.success) {
        setBookings(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message);
      showNotification('Error loading bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      search: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="content-area">
        <div className="page-header">
          <h1 className="page-title">Bookings</h1>
          <p className="page-description">Manage your cleaning service bookings and appointments</p>
        </div>
        <div className="loading-spinner-container" style={{ height: '400px' }}>
          <LoadingSpinner className="loading-spinner-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-area">
        <div className="page-header">
          <h1 className="page-title">Bookings</h1>
          <p className="page-description">Manage your cleaning service bookings and appointments</p>
        </div>
        <div className="card">
          <div className="card-content">
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Error Loading Bookings</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error}</p>
              <button className="btn btn-primary" onClick={loadBookings}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-area">
      <div className="page-header">
        <h1 className="page-title">Bookings</h1>
        <p className="page-description">Manage your cleaning service bookings and appointments</p>
      </div>

      {/* Action Bar */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link to="/bookings/calendar" className="btn btn-primary">
                📅 Calendar View
              </Link>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowFilters(!showFilters)}
              >
                🔍 {showFilters ? 'Hide' : 'Show'} Filters
              </button>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* View Mode Toggle */}
              <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--background-color)', borderRadius: '8px', padding: '4px' }}>
                <button
                  className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setViewMode('list')}
                  style={{ padding: '8px 12px', fontSize: '12px', minWidth: 'auto' }}
                >
                  📋 List
                </button>
                <button
                  className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setViewMode('grid')}
                  style={{ padding: '8px 12px', fontSize: '12px', minWidth: 'auto' }}
                >
                  🔲 Grid
                </button>
              </div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div style={{ marginTop: '24px', padding: '20px', backgroundColor: 'var(--background-color)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name, ID, or email..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '8px',
                      backgroundColor: 'var(--surface-color)',
                      color: 'var(--text-primary)',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '8px',
                      backgroundColor: 'var(--surface-color)',
                      color: 'var(--text-primary)',
                      fontSize: '14px'
                    }}
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    From Date
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '8px',
                      backgroundColor: 'var(--surface-color)',
                      color: 'var(--text-primary)',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    To Date
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '8px',
                      backgroundColor: 'var(--surface-color)',
                      color: 'var(--text-primary)',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
              <button className="btn btn-ghost" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Bookings</h2>
          <p className="card-description">View and manage all booking requests</p>
        </div>
        <div className="card-content" style={{ padding: viewMode === 'grid' ? '24px' : 0 }}>
          {bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>📅</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>No bookings found</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                {Object.values(filters).some(f => f && f !== 'all') 
                  ? 'Try adjusting your filters to see more results.'
                  : 'No bookings have been created yet.'
                }
              </p>
              {Object.values(filters).some(f => f && f !== 'all') && (
                <button className="btn btn-primary" onClick={clearFilters}>
                  Clear Filters
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="bookings-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)', fontSize: '18px', fontWeight: '600' }}>
                        {booking.id}
                      </h3>
                      <p style={{ margin: '0 0 8px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
                        {booking.customerName}
                      </p>
                      <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '12px' }}>
                        {booking.customerEmail}
                      </p>
                    </div>
                    <span className={`status-badge status-${booking.status}`}>
                      {statusLabels[booking.status]}
                    </span>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Date & Time</span>
                      <span style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: '500' }}>
                        {formatDate(booking.date)} at {formatTime(booking.time)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Service</span>
                      <span style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: '500' }}>
                        {booking.serviceType}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Price</span>
                      <span style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: '600' }}>
                        {formatPrice(booking.price)}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link
                      to={`/bookings/${booking.id}`}
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '8px 12px', fontSize: '12px', textAlign: 'center' }}
                    >
                      👁️ View Details
                    </Link>
                    <button
                      className="btn btn-secondary"
                      style={{ flex: 1, padding: '8px 12px', fontSize: '12px' }}
                      onClick={() => showNotification('Edit functionality coming soon', 'info')}
                    >
                      ✏️ Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Customer</th>
                    <th>Date/Time</th>
                    <th>Service</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                        {booking.id}
                      </td>
                      <td>
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                            {booking.customerName}
                          </div>
                          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                            {booking.customerEmail}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                            {formatDate(booking.date)}
                          </div>
                          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                            {formatTime(booking.time)}
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-primary)' }}>
                        {booking.serviceType}
                      </td>
                      <td style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                        {formatPrice(booking.price)}
                      </td>
                      <td>
                        <span className={`status-badge status-${booking.status}`}>
                          {statusLabels[booking.status]}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <Link
                            to={`/bookings/${booking.id}`}
                            className="btn btn-ghost"
                            style={{ padding: '8px 12px', fontSize: '12px' }}
                          >
                            👁️ View
                          </Link>
                          <button
                            className="btn btn-ghost"
                            style={{ padding: '8px 12px', fontSize: '12px' }}
                            onClick={() => showNotification('Edit functionality coming soon', 'info')}
                          >
                            ✏️ Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;
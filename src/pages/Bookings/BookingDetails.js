import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBookingById, updateBookingStatus, deleteBooking } from '../../api/bookings';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useNotifications } from '../../hooks/useNotifications';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { showNotification } = useNotifications();

  const statusOptions = [
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

  const loadBooking = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getBookingById(id);
      if (response.success) {
        setBooking(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message);
      showNotification('Error loading booking details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      const response = await updateBookingStatus(id, newStatus);
      if (response.success) {
        setBooking(response.data);
        showNotification(`Booking status updated to ${statusLabels[newStatus]}`, 'success');
      } else {
        showNotification('Failed to update booking status', 'error');
      }
    } catch (err) {
      showNotification('Error updating booking status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setUpdating(true);
      const response = await deleteBooking(id);
      if (response.success) {
        showNotification('Booking deleted successfully', 'success');
        navigate('/bookings');
      } else {
        showNotification('Failed to delete booking', 'error');
      }
    } catch (err) {
      showNotification('Error deleting booking', 'error');
    } finally {
      setUpdating(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="content-area">
        <div className="page-header">
          <h1 className="page-title">Booking Details</h1>
          <p className="page-description">View detailed information about a booking</p>
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
          <h1 className="page-title">Booking Details</h1>
          <p className="page-description">View detailed information about a booking</p>
        </div>
        <div className="card">
          <div className="card-content">
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Error Loading Booking</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error}</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={loadBooking}>
                  Try Again
                </button>
                <Link to="/bookings" className="btn btn-secondary">
                  Back to Bookings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="content-area">
        <div className="page-header">
          <h1 className="page-title">Booking Details</h1>
          <p className="page-description">View detailed information about a booking</p>
        </div>
        <div className="card">
          <div className="card-content">
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Booking Not Found</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                The booking you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/bookings" className="btn btn-primary">
                Back to Bookings
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-area">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 className="page-title">Booking Details</h1>
            <p className="page-description">Booking ID: {booking.id}</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link to="/bookings" className="btn btn-secondary">
              ← Back to List
            </Link>
            <Link to="/bookings/calendar" className="btn btn-ghost">
              📅 Calendar
            </Link>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
        {/* Customer Information */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Customer Information</h2>
            <p className="card-description">Contact details and address</p>
          </div>
          <div className="card-content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Full Name
                </label>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '16px' }}>
                  {booking.customerName}
                </p>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Phone Number
                </label>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '16px' }}>
                  {booking.customerPhone}
                </p>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Email Address
                </label>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '16px' }}>
                  {booking.customerEmail}
                </p>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Address
                </label>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '16px' }}>
                  {booking.customerAddress}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Information */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Booking Information</h2>
            <p className="card-description">Service details and scheduling</p>
          </div>
          <div className="card-content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Service Type
                </label>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '16px' }}>
                  {booking.serviceType}
                </p>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Date & Time
                </label>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '16px' }}>
                  {formatDate(booking.date)} at {formatTime(booking.time)}
                </p>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Duration
                </label>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '16px' }}>
                  {booking.duration}
                </p>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Price
                </label>
                <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '20px', fontWeight: '600' }}>
                  {formatPrice(booking.price)}
                </p>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Status
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      backgroundColor: `${statusColors[booking.status]}20`,
                      color: statusColors[booking.status],
                      border: `1px solid ${statusColors[booking.status]}40`
                    }}
                  >
                    {statusLabels[booking.status]}
                  </span>
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    disabled={updating}
                    style={{
                      padding: '8px 12px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '8px',
                      backgroundColor: 'var(--surface-color)',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      cursor: updating ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="card-header">
              <h2 className="card-title">Notes</h2>
              <p className="card-description">Additional information and special requests</p>
            </div>
            <div className="card-content">
              <div style={{ 
                padding: '16px', 
                backgroundColor: 'var(--background-color)', 
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
              }}>
                <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '16px', lineHeight: '1.6' }}>
                  {booking.notes}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Media Section */}
        {(booking.photos.length > 0 || booking.videos.length > 0) && (
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="card-header">
              <h2 className="card-title">Media</h2>
              <p className="card-description">Photos and videos related to this booking</p>
            </div>
            <div className="card-content">
              <div style={{ display: 'grid', gap: '24px' }}>
                {booking.photos.length > 0 && (
                  <div>
                    <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)', fontSize: '18px', fontWeight: '600' }}>
                      Photos ({booking.photos.length})
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                      {booking.photos.map((photo) => (
                        <div
                          key={photo.id}
                          style={{
                            backgroundColor: 'var(--background-color)',
                            borderRadius: '12px',
                            padding: '16px',
                            border: '1px solid var(--border-color)',
                            textAlign: 'center',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 30px var(--shadow-elevated)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          <div style={{ 
                            width: '100%', 
                            height: '120px', 
                            backgroundColor: 'var(--border-color)', 
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '12px',
                            fontSize: '24px',
                            color: 'var(--text-muted)'
                          }}>
                            📷
                          </div>
                          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
                            {photo.caption}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {booking.videos.length > 0 && (
                  <div>
                    <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)', fontSize: '18px', fontWeight: '600' }}>
                      Videos ({booking.videos.length})
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                      {booking.videos.map((video) => (
                        <div
                          key={video.id}
                          style={{
                            backgroundColor: 'var(--background-color)',
                            borderRadius: '12px',
                            padding: '16px',
                            border: '1px solid var(--border-color)',
                            textAlign: 'center',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 30px var(--shadow-elevated)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          <div style={{ 
                            width: '100%', 
                            height: '120px', 
                            backgroundColor: 'var(--border-color)', 
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '12px',
                            fontSize: '24px',
                            color: 'var(--text-muted)'
                          }}>
                            🎥
                          </div>
                          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
                            {video.caption}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Booking Metadata */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header">
            <h2 className="card-title">Booking Metadata</h2>
            <p className="card-description">System information and timestamps</p>
          </div>
          <div className="card-content">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Created At
                </label>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
                  {formatDateTime(booking.createdAt)}
                </p>
              </div>
              {booking.updatedAt && (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Last Updated
                  </label>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
                    {formatDateTime(booking.updatedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="card" style={{ marginTop: '32px' }}>
        <div className="card-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={() => handleStatusUpdate('approved')}
                disabled={updating || booking.status === 'approved'}
                style={{ 
                  opacity: (updating || booking.status === 'approved') ? 0.6 : 1,
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                ✅ Approve Booking
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleStatusUpdate('completed')}
                disabled={updating || booking.status === 'completed'}
                style={{ 
                  opacity: (updating || booking.status === 'completed') ? 0.6 : 1,
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                ✅ Mark Complete
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleStatusUpdate('cancelled')}
                disabled={updating || booking.status === 'cancelled'}
                style={{ 
                  opacity: (updating || booking.status === 'cancelled') ? 0.6 : 1,
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                ❌ Cancel Booking
              </button>
            </div>
            <button
              className="btn btn-ghost"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={updating}
              style={{ 
                color: '#ef4444',
                opacity: updating ? 0.6 : 1,
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '600',
                border: '1px solid #ef4444'
              }}
            >
              🗑️ Delete Booking
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
            <div className="card-content">
              <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)', fontSize: '20px', fontWeight: '600' }}>
                Confirm Deletion
              </h3>
              <p style={{ margin: '0 0 24px 0', color: 'var(--text-secondary)', fontSize: '16px' }}>
                Are you sure you want to delete this booking? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={updating}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleDelete}
                  disabled={updating}
                  style={{ backgroundColor: '#ef4444', borderColor: '#ef4444' }}
                >
                  {updating ? 'Deleting...' : 'Delete Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetails;

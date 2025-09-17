import React, { useState } from 'react';
import { 
  MdClose, 
  MdEdit, 
  MdDelete, 
  MdWarning,
  MdCheckCircle, 
  MdCancel,
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdCalendarToday,
  MdPayment,
  MdStar,
  MdNotes,
  MdArrowBack
} from 'react-icons/md';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../context/ToastContext';

const ClientProfile = ({ client, onClose, onEdit, onDelete, onSuspend }) => {
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useTheme();
  const { showSuccess, showError } = useToast();

  // Mock data for demonstration
  const mockBookingHistory = [
    {
      id: 1,
      service: 'Wedding Photography',
      date: '2024-01-15',
      status: 'completed',
      amount: 2500,
      photographer: 'John Smith'
    },
    {
      id: 2,
      service: 'Portrait Session',
      date: '2024-02-20',
      status: 'completed',
      amount: 300,
      photographer: 'Sarah Johnson'
    },
    {
      id: 3,
      service: 'Corporate Event',
      date: '2024-03-10',
      status: 'scheduled',
      amount: 800,
      photographer: 'Mike Davis'
    }
  ];

  const mockPaymentHistory = [
    {
      id: 1,
      amount: 2500,
      date: '2024-01-15',
      status: 'paid',
      method: 'Credit Card',
      invoice: 'INV-2024-001'
    },
    {
      id: 2,
      amount: 300,
      date: '2024-02-20',
      status: 'paid',
      method: 'Bank Transfer',
      invoice: 'INV-2024-002'
    },
    {
      id: 3,
      amount: 800,
      date: '2024-03-10',
      status: 'pending',
      method: 'Credit Card',
      invoice: 'INV-2024-003'
    }
  ];

  const mockFeedback = [
    {
      id: 1,
      rating: 5,
      comment: 'Excellent service! The photographer was professional and captured beautiful moments.',
      date: '2024-01-16',
      service: 'Wedding Photography'
    },
    {
      id: 2,
      rating: 4,
      comment: 'Great experience, very satisfied with the results.',
      date: '2024-02-21',
      service: 'Portrait Session'
    }
  ];

  // Get status badge
  const getStatusBadge = () => {
    if (client.is_active) {
      return (
        <span className="status-badge active">
          <MdCheckCircle className="status-icon" />
          Active
        </span>
      );
    }
    
    return (
      <span className="status-badge inactive">
        <MdCancel className="status-icon" />
        Inactive
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return '#10b981';
      case 'scheduled':
      case 'pending':
        return '#f59e0b';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  // Handle edit
  const handleEdit = () => {
    if (onEdit) {
      onEdit(client);
    }
    onClose();
  };

  // Handle delete
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${client.name}"? This action cannot be undone.`)) {
      try {
        setLoading(true);
        if (onDelete) {
          await onDelete(client);
        }
        showSuccess(`"${client.name}" has been deleted`);
        onClose();
      } catch (error) {
        console.error('Error deleting client:', error);
        showError('Failed to delete client');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle suspend
  const handleSuspend = async () => {
    const action = client.is_active ? 'suspend' : 'reactivate';
    const confirmMessage = client.is_active 
      ? `Are you sure you want to suspend "${client.name}"?`
      : `Are you sure you want to reactivate "${client.name}"?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        setLoading(true);
        if (onSuspend) {
          await onSuspend(client);
        }
        showSuccess(`"${client.name}" has been ${action}ed`);
      } catch (error) {
        console.error('Error updating client status:', error);
        showError(`Failed to ${action} client`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle profile close
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <div className={`client-profile-page ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="client-profile-header">
        <button 
          className="back-btn"
          onClick={handleClose}
          disabled={loading}
        >
          <MdArrowBack className="back-icon" />
          Back to Clients
        </button>
        
        <div className="client-profile-title">
          <div className="client-avatar-large">
            {client.name.charAt(0)}
          </div>
          <div className="client-title-info">
            <h1>{client.name}</h1>
            <div className="client-subtitle">
              Client ID: {client.id} • {getStatusBadge()}
            </div>
          </div>
        </div>
        
        <div className="client-profile-actions">
          <button 
            className="action-btn edit"
            onClick={handleEdit}
            disabled={loading}
            title="Edit Client"
          >
            <MdEdit />
            Edit
          </button>
          <button 
            className="action-btn suspend"
            onClick={handleSuspend}
            disabled={loading}
            title={client.is_active ? 'Suspend Client' : 'Reactivate Client'}
          >
            <MdWarning />
            {client.is_active ? 'Suspend' : 'Reactivate'}
          </button>
          <button 
            className="action-btn delete"
            onClick={handleDelete}
            disabled={loading}
            title="Delete Client"
          >
            <MdDelete />
            Delete
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="client-profile-content">
        <div className="client-profile-grid">
          {/* Basic Information */}
          <div className="profile-section">
            <h2>
              <MdPerson className="section-icon" />
              Basic Information
            </h2>
            <div className="info-grid">
              <div className="info-item">
                <label>
                  <MdEmail className="info-icon" />
                  Email
                </label>
                <span className="info-value">{client.email}</span>
              </div>
              
              <div className="info-item">
                <label>
                  <MdPhone className="info-icon" />
                  Phone
                </label>
                <span className="info-value">{client.phone}</span>
              </div>
              
              <div className="info-item">
                <label>
                  <MdLocationOn className="info-icon" />
                  Address
                </label>
                <span className="info-value">{client.address}</span>
              </div>
              
              <div className="info-item">
                <label>
                  <MdCalendarToday className="info-icon" />
                  Registration Date
                </label>
                <span className="info-value">{formatDate(client.registration_date)}</span>
              </div>
            </div>
          </div>

          {/* Booking History */}
          <div className="profile-section">
            <h2>
              <MdCalendarToday className="section-icon" />
              Booking History ({mockBookingHistory.length})
            </h2>
            <div className="history-list">
              {mockBookingHistory.map((booking) => (
                <div key={booking.id} className="history-item">
                  <div className="history-main">
                    <div className="history-service">{booking.service}</div>
                    <div className="history-photographer">Photographer: {booking.photographer}</div>
                    <div className="history-date">{formatDate(booking.date)}</div>
                  </div>
                  <div className="history-details">
                    <div className="history-amount">{formatCurrency(booking.amount)}</div>
                    <div 
                      className="history-status"
                      style={{ color: getStatusColor(booking.status) }}
                    >
                      {booking.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment History */}
          <div className="profile-section">
            <h2>
              <MdPayment className="section-icon" />
              Payment History ({mockPaymentHistory.length})
            </h2>
            <div className="history-list">
              {mockPaymentHistory.map((payment) => (
                <div key={payment.id} className="history-item">
                  <div className="history-main">
                    <div className="history-service">Invoice: {payment.invoice}</div>
                    <div className="history-photographer">Method: {payment.method}</div>
                    <div className="history-date">{formatDate(payment.date)}</div>
                  </div>
                  <div className="history-details">
                    <div className="history-amount">{formatCurrency(payment.amount)}</div>
                    <div 
                      className="history-status"
                      style={{ color: getStatusColor(payment.status) }}
                    >
                      {payment.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Service Feedback */}
          <div className="profile-section">
            <h2>
              <MdStar className="section-icon" />
              Service Feedback ({mockFeedback.length})
            </h2>
            <div className="feedback-list">
              {mockFeedback.map((feedback) => (
                <div key={feedback.id} className="feedback-item">
                  <div className="feedback-header">
                    <div className="feedback-service">{feedback.service}</div>
                    <div className="feedback-rating">
                      {[...Array(5)].map((_, i) => (
                        <MdStar 
                          key={i} 
                          className={`star ${i < feedback.rating ? 'filled' : 'empty'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="feedback-comment">{feedback.comment}</div>
                  <div className="feedback-date">{formatDate(feedback.date)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {client.notes && (
            <div className="profile-section">
              <h2>
                <MdNotes className="section-icon" />
                Notes
              </h2>
              <div className="notes-content">
                {client.notes}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;

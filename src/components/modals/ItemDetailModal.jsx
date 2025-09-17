import React, { useState } from 'react';
import { 
  MdClose, 
  MdEdit, 
  MdDelete, 
  MdCheckCircle, 
  MdCancel, 
  MdWarning,
  MdPerson,
  MdCalendarToday,
  MdInventory,
  MdNotes
} from 'react-icons/md';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../context/ToastContext';

const ItemDetailModal = ({ item, onClose, onEdit, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useTheme();
  const { showSuccess, showError } = useToast();

  // Get status badge
  const getStatusBadge = () => {
    if (item.status === 'inactive') {
      return (
        <span className="status-badge inactive">
          <MdCancel className="status-icon" />
          Inactive
        </span>
      );
    }
    
    if (item.quantity <= item.low_stock_threshold) {
      return (
        <span className="status-badge low-stock">
          <MdWarning className="status-icon" />
          Low Stock
        </span>
      );
    }
    
    return (
      <span className="status-badge active">
        <MdCheckCircle className="status-icon" />
        Active
      </span>
    );
  };

  // Get type icon
  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'equipment':
        return '📷';
      case 'supplies':
        return '🧽';
      case 'accessories':
        return '🔧';
      default:
        return '📦';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle edit
  const handleEdit = () => {
    if (onEdit) {
      onEdit(item);
    }
    onClose();
  };

  // Handle delete
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      try {
        setLoading(true);
        if (onDelete) {
          await onDelete(item);
        }
        showSuccess(`"${item.name}" has been deleted`);
        onClose();
      } catch (error) {
        console.error('Error deleting item:', error);
        showError('Failed to delete item');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div 
        className={`modal item-detail-modal ${isDarkMode ? 'dark' : 'light'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">
            <span className="item-icon">{getTypeIcon(item.type)}</span>
            <h2>{item.name}</h2>
          </div>
          <button 
            className="modal-close-btn"
            onClick={handleClose}
            disabled={loading}
          >
            <MdClose />
          </button>
        </div>

        <div className="modal-content">
          {/* Status and Actions */}
          <div className="item-header">
            <div className="item-status">
              {getStatusBadge()}
            </div>
            <div className="item-actions">
              <button 
                className="action-btn edit"
                onClick={handleEdit}
                disabled={loading}
                title="Edit Item"
              >
                <MdEdit />
                Edit
              </button>
              <button 
                className="action-btn delete"
                onClick={handleDelete}
                disabled={loading}
                title="Delete Item"
              >
                <MdDelete />
                Delete
              </button>
            </div>
          </div>

          {/* Item Details */}
          <div className="item-details">
            <div className="detail-section">
              <h3>Basic Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>
                    <MdInventory className="detail-icon" />
                    Type
                  </label>
                  <span className="detail-value">{item.type}</span>
                </div>
                
                <div className="detail-item">
                  <label>
                    <MdInventory className="detail-icon" />
                    Quantity
                  </label>
                  <span className={`detail-value quantity ${item.quantity <= item.low_stock_threshold ? 'low' : ''}`}>
                    {item.quantity}
                  </span>
                </div>
                
                <div className="detail-item">
                  <label>
                    <MdWarning className="detail-icon" />
                    Low Stock Threshold
                  </label>
                  <span className="detail-value">{item.low_stock_threshold}</span>
                </div>
                
                <div className="detail-item">
                  <label>
                    <MdPerson className="detail-icon" />
                    Assigned To
                  </label>
                  <span className="detail-value">
                    {item.assigned_to || 'Unassigned'}
                  </span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Timeline</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>
                    <MdCalendarToday className="detail-icon" />
                    Last Updated
                  </label>
                  <span className="detail-value">
                    {formatDate(item.last_updated)}
                  </span>
                </div>
                
                <div className="detail-item">
                  <label>
                    <MdCalendarToday className="detail-icon" />
                    Created
                  </label>
                  <span className="detail-value">
                    {formatDate(item.created_at || item.last_updated)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {item.notes && (
              <div className="detail-section">
                <h3>
                  <MdNotes className="section-icon" />
                  Notes
                </h3>
                <div className="notes-content">
                  {item.notes}
                </div>
              </div>
            )}

            {/* Audit Trail (if available) */}
            {item.audit_trail && item.audit_trail.length > 0 && (
              <div className="detail-section">
                <h3>Audit Trail</h3>
                <div className="audit-trail">
                  {item.audit_trail.map((entry, index) => (
                    <div key={index} className="audit-entry">
                      <div className="audit-action">{entry.action}</div>
                      <div className="audit-user">{entry.user}</div>
                      <div className="audit-date">{formatDate(entry.timestamp)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn-secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;

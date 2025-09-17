import React, { useState, useEffect } from 'react';
import { MdClose, MdSave, MdCancel } from 'react-icons/md';
import { createInventoryItem, updateInventoryItem } from '../../api/inventory';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../context/ToastContext';

const InventoryModal = ({ item, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'equipment',
    quantity: 0,
    assigned_to: '',
    notes: '',
    status: 'active',
    low_stock_threshold: 1
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { isDarkMode } = useTheme();
  const { showSuccess, showError } = useToast();

  const isEditing = !!item;

  // Mock employees for dropdown
  const employees = [
    'John Smith',
    'Sarah Johnson',
    'Mike Davis',
    'Emily Wilson',
    'David Brown',
    'Lisa Garcia',
    'Tom Wilson',
    'Anna Martinez'
  ];

  // Initialize form data
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        type: item.type || 'equipment',
        quantity: item.quantity || 0,
        assigned_to: item.assigned_to || '',
        notes: item.notes || '',
        status: item.status || 'active',
        low_stock_threshold: item.low_stock_threshold || 1
      });
    }
  }, [item]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }

    if (formData.low_stock_threshold < 0) {
      newErrors.low_stock_threshold = 'Low stock threshold cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const submitData = {
        ...formData,
        quantity: parseInt(formData.quantity),
        low_stock_threshold: parseInt(formData.low_stock_threshold),
        assigned_to: formData.assigned_to || null
      };

      if (isEditing) {
        await updateInventoryItem(item.id, submitData);
        showSuccess(`"${formData.name}" has been updated`);
      } else {
        await createInventoryItem(submitData);
        showSuccess(`"${formData.name}" has been created`);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving inventory item:', error);
      showError(`Failed to ${isEditing ? 'update' : 'create'} item`);
    } finally {
      setLoading(false);
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
        className={`modal inventory-modal ${isDarkMode ? 'dark' : 'light'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>
            {isEditing ? 'Edit Inventory Item' : 'Add New Inventory Item'}
          </h2>
          <button 
            className="modal-close-btn"
            onClick={handleClose}
            disabled={loading}
          >
            <MdClose />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content">
          <div className="form-grid">
            {/* Name */}
            <div className="form-group">
              <label htmlFor="name">
                Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
                placeholder="Enter item name"
                disabled={loading}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            {/* Type */}
            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="equipment">Equipment</option>
                <option value="supplies">Supplies</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            {/* Quantity */}
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className={errors.quantity ? 'error' : ''}
                min="0"
                disabled={loading}
              />
              {errors.quantity && <span className="error-message">{errors.quantity}</span>}
            </div>

            {/* Low Stock Threshold */}
            <div className="form-group">
              <label htmlFor="low_stock_threshold">Low Stock Threshold</label>
              <input
                type="number"
                id="low_stock_threshold"
                name="low_stock_threshold"
                value={formData.low_stock_threshold}
                onChange={handleInputChange}
                className={errors.low_stock_threshold ? 'error' : ''}
                min="0"
                disabled={loading}
              />
              {errors.low_stock_threshold && (
                <span className="error-message">{errors.low_stock_threshold}</span>
              )}
            </div>

            {/* Assigned To */}
            <div className="form-group">
              <label htmlFor="assigned_to">Assigned To</label>
              <select
                id="assigned_to"
                name="assigned_to"
                value={formData.assigned_to}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="">Unassigned</option>
                {employees.map((employee) => (
                  <option key={employee} value={employee}>
                    {employee}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional notes about this item..."
              rows="3"
              disabled={loading}
            />
          </div>

          {/* Form Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              <MdCancel className="btn-icon" />
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              <MdSave className="btn-icon" />
              {loading ? 'Saving...' : (isEditing ? 'Update Item' : 'Create Item')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryModal;

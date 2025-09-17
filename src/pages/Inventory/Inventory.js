import React, { useState, useEffect } from 'react';
import { 
  MdAdd, 
  MdSearch, 
  MdFilterList, 
  MdEdit, 
  MdDelete, 
  MdVisibility,
  MdRefresh,
  MdInventory,
  MdWarning,
  MdCheckCircle,
  MdCancel
} from 'react-icons/md';
import { getInventoryItems, deleteInventoryItem } from '../../api/inventory';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import InventoryModal from '../../components/modals/InventoryModal';
import ItemDetailModal from '../../components/modals/ItemDetailModal';

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const { isDarkMode } = useTheme();
  const { showSuccess, showError, showWarning } = useToast();

  const itemsPerPage = 10;

  // Fetch inventory items
  const fetchInventoryItems = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        page_size: itemsPerPage,
        search: searchTerm,
        ordering: sortOrder === 'asc' ? sortBy : `-${sortBy}`
      };

      // Add filters
      if (filterType !== 'all') {
        params.type = filterType;
      }
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }

      const response = await getInventoryItems(params);
      setInventoryItems(response.data.results || []);
      setTotalPages(Math.ceil((response.data.count || 0) / itemsPerPage));
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      setError('Failed to load inventory items');
      
      // Fallback to mock data for development
      const mockItems = [
        {
          id: 1,
          name: 'Professional Camera Lens',
          type: 'Equipment',
          quantity: 5,
          assigned_to: 'John Smith',
          last_updated: new Date().toISOString(),
          status: 'active',
          notes: 'Canon EF 24-70mm f/2.8L II USM',
          low_stock_threshold: 2
        },
        {
          id: 2,
          name: 'Cleaning Supplies Kit',
          type: 'Supplies',
          quantity: 1,
          assigned_to: 'Sarah Johnson',
          last_updated: new Date(Date.now() - 86400000).toISOString(),
          status: 'active',
          notes: 'Complete cleaning kit for equipment maintenance',
          low_stock_threshold: 3
        },
        {
          id: 3,
          name: 'Lighting Equipment',
          type: 'Equipment',
          quantity: 8,
          assigned_to: 'Mike Davis',
          last_updated: new Date(Date.now() - 172800000).toISOString(),
          status: 'active',
          notes: 'Professional LED lighting setup',
          low_stock_threshold: 5
        },
        {
          id: 4,
          name: 'Memory Cards',
          type: 'Accessories',
          quantity: 0,
          assigned_to: null,
          last_updated: new Date(Date.now() - 259200000).toISOString(),
          status: 'inactive',
          notes: '64GB SD cards for cameras',
          low_stock_threshold: 10
        },
        {
          id: 5,
          name: 'Tripod Stand',
          type: 'Equipment',
          quantity: 3,
          assigned_to: 'Emily Wilson',
          last_updated: new Date(Date.now() - 345600000).toISOString(),
          status: 'active',
          notes: 'Professional carbon fiber tripod',
          low_stock_threshold: 2
        }
      ];
      
      setInventoryItems(mockItems);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    fetchInventoryItems(1);
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    if (filterName === 'type') {
      setFilterType(value);
    } else if (filterName === 'status') {
      setFilterStatus(value);
    }
    setCurrentPage(1);
    fetchInventoryItems(1);
  };

  // Handle sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    fetchInventoryItems(currentPage);
  };

  // Handle delete item
  const handleDeleteItem = async (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      try {
        await deleteInventoryItem(item.id);
        setInventoryItems(prev => prev.filter(i => i.id !== item.id));
        showSuccess(`"${item.name}" has been deleted`);
      } catch (error) {
        console.error('Error deleting item:', error);
        showError('Failed to delete item');
      }
    }
  };

  // Handle view item details
  const handleViewItem = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  // Handle edit item
  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  // Handle add new item
  const handleAddItem = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowModal(false);
    setEditingItem(null);
    fetchInventoryItems(currentPage);
  };

  // Handle detail modal close
  const handleDetailModalClose = () => {
    setShowDetailModal(false);
    setSelectedItem(null);
  };

  // Get status badge
  const getStatusBadge = (item) => {
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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Load inventory items on component mount
  useEffect(() => {
    fetchInventoryItems();
  }, []);

  return (
    <div className={`inventory-page ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="inventory-header">
        <div className="inventory-title">
          <MdInventory className="title-icon" />
          <h1>Inventory Management</h1>
        </div>
        
        <div className="inventory-actions">
          <button 
            className="add-item-btn"
            onClick={handleAddItem}
          >
            <MdAdd className="add-icon" />
            Add Item
          </button>
          
          <button 
            className="refresh-btn"
            onClick={() => fetchInventoryItems(currentPage)}
          >
            <MdRefresh className="refresh-icon" />
            Refresh
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="inventory-controls">
        <div className="search-section">
          <div className="search-bar">
            <MdSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search inventory items..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="filters-section">
          <div className="filter-group">
            <label>Type:</label>
            <select 
              value={filterType} 
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="equipment">Equipment</option>
              <option value="supplies">Supplies</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Status:</label>
            <select 
              value={filterStatus} 
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="inventory-content">
        {loading ? (
          <div className="inventory-loading">
            <LoadingSpinner />
            <span>Loading inventory items...</span>
          </div>
        ) : error ? (
          <div className="inventory-error">
            <MdInventory className="error-icon" />
            <h3>Error loading inventory</h3>
            <p>{error}</p>
            <button 
              className="retry-btn"
              onClick={() => fetchInventoryItems(currentPage)}
            >
              Try again
            </button>
          </div>
        ) : inventoryItems.length === 0 ? (
          <div className="inventory-empty">
            <MdInventory className="empty-icon" />
            <h3>No inventory items</h3>
            <p>No items found matching your criteria.</p>
            <button 
              className="add-first-btn"
              onClick={handleAddItem}
            >
              <MdAdd className="add-icon" />
              Add your first item
            </button>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="inventory-table-container">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('name')}>
                      Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('type')}>
                      Type {sortBy === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('quantity')}>
                      Quantity {sortBy === 'quantity' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('assigned_to')}>
                      Assigned To {sortBy === 'assigned_to' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('last_updated')}>
                      Last Updated {sortBy === 'last_updated' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="item-name">
                          <span className="item-icon">{getTypeIcon(item.type)}</span>
                          {item.name}
                        </div>
                      </td>
                      <td>
                        <span className="item-type">{item.type}</span>
                      </td>
                      <td>
                        <span className={`quantity ${item.quantity <= item.low_stock_threshold ? 'low' : ''}`}>
                          {item.quantity}
                        </span>
                      </td>
                      <td>
                        <span className="assigned-to">
                          {item.assigned_to || 'Unassigned'}
                        </span>
                      </td>
                      <td>
                        <span className="last-updated">
                          {formatDate(item.last_updated)}
                        </span>
                      </td>
                      <td>
                        {getStatusBadge(item)}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn view"
                            onClick={() => handleViewItem(item)}
                            title="View Details"
                          >
                            <MdVisibility />
                          </button>
                          <button 
                            className="action-btn edit"
                            onClick={() => handleEditItem(item)}
                            title="Edit Item"
                          >
                            <MdEdit />
                          </button>
                          <button 
                            className="action-btn delete"
                            onClick={() => handleDeleteItem(item)}
                            title="Delete Item"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="inventory-pagination">
                <button
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => fetchInventoryItems(currentPage - 1)}
                >
                  Previous
                </button>
                
                <div className="pagination-info">
                  Page {currentPage} of {totalPages}
                </div>
                
                <button
                  className="pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => fetchInventoryItems(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <InventoryModal
          item={editingItem}
          onClose={handleModalClose}
        />
      )}
      
      {showDetailModal && selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={handleDetailModalClose}
        />
      )}
    </div>
  );
};

export default Inventory;
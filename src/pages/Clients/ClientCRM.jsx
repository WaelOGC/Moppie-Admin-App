import React, { useState, useEffect } from 'react';
import { 
  MdAdd, 
  MdSearch, 
  MdFilterList, 
  MdEdit, 
  MdDelete, 
  MdVisibility,
  MdRefresh,
  MdPerson,
  MdWarning,
  MdCheckCircle,
  MdCancel,
  MdPhone,
  MdEmail,
  MdCalendarToday
} from 'react-icons/md';
import { getAllClients, deleteClient } from '../../api/clients';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ClientProfile from './ClientProfile';
import ClientEditModal from '../../components/modals/ClientEditModal';

const ClientCRM = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showProfile, setShowProfile] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const { isDarkMode } = useTheme();
  const { showSuccess, showError, showWarning } = useToast();

  const itemsPerPage = 10;

  // Fetch clients
  const fetchClients = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        page_size: itemsPerPage,
        search: searchTerm,
        ordering: sortOrder === 'asc' ? sortBy : `-${sortBy}`
      };

      // Add status filter
      if (filterStatus !== 'all') {
        params.is_active = filterStatus === 'active';
      }

      const response = await getAllClients(params);
      setClients(response.data.results || []);
      setTotalPages(Math.ceil((response.data.count || 0) / itemsPerPage));
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setError('Failed to load clients');
      
      // Fallback to mock data for development
      const mockClients = [
        {
          id: 1,
          name: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1 (555) 123-4567',
          bookings_count: 3,
          registration_date: new Date().toISOString(),
          is_active: true,
          address: '123 Main St, New York, NY 10001',
          notes: 'Prefers morning appointments'
        },
        {
          id: 2,
          name: 'Michael Chen',
          email: 'michael.chen@email.com',
          phone: '+1 (555) 234-5678',
          bookings_count: 7,
          registration_date: new Date(Date.now() - 86400000).toISOString(),
          is_active: true,
          address: '456 Oak Ave, Los Angeles, CA 90210',
          notes: 'Regular customer, VIP status'
        },
        {
          id: 3,
          name: 'Emily Rodriguez',
          email: 'emily.rodriguez@email.com',
          phone: '+1 (555) 345-6789',
          bookings_count: 1,
          registration_date: new Date(Date.now() - 172800000).toISOString(),
          is_active: false,
          address: '789 Pine St, Chicago, IL 60601',
          notes: 'Account suspended due to payment issues'
        },
        {
          id: 4,
          name: 'David Thompson',
          email: 'david.thompson@email.com',
          phone: '+1 (555) 456-7890',
          bookings_count: 5,
          registration_date: new Date(Date.now() - 259200000).toISOString(),
          is_active: true,
          address: '321 Elm St, Houston, TX 77001',
          notes: 'Corporate client, bulk bookings'
        },
        {
          id: 5,
          name: 'Lisa Wang',
          email: 'lisa.wang@email.com',
          phone: '+1 (555) 567-8901',
          bookings_count: 2,
          registration_date: new Date(Date.now() - 345600000).toISOString(),
          is_active: true,
          address: '654 Maple Dr, Seattle, WA 98101',
          notes: 'New client, interested in wedding packages'
        }
      ];
      
      setClients(mockClients);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    fetchClients(1);
  };

  // Handle filter changes
  const handleFilterChange = (value) => {
    setFilterStatus(value);
    setCurrentPage(1);
    fetchClients(1);
  };

  // Handle sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    fetchClients(currentPage);
  };

  // Handle delete client
  const handleDeleteClient = async (client) => {
    if (window.confirm(`Are you sure you want to delete "${client.name}"? This action cannot be undone.`)) {
      try {
        await deleteClient(client.id);
        setClients(prev => prev.filter(c => c.id !== client.id));
        showSuccess(`"${client.name}" has been deleted`);
      } catch (error) {
        console.error('Error deleting client:', error);
        showError('Failed to delete client');
      }
    }
  };

  // Handle view client profile
  const handleViewClient = (client) => {
    setSelectedClient(client);
    setShowProfile(true);
  };

  // Handle edit client
  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowEditModal(true);
  };

  // Handle suspend client
  const handleSuspendClient = async (client) => {
    const action = client.is_active ? 'suspend' : 'reactivate';
    const confirmMessage = client.is_active 
      ? `Are you sure you want to suspend "${client.name}"?`
      : `Are you sure you want to reactivate "${client.name}"?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        // This would call updateClientInfo in a real implementation
        // await updateClientInfo(client.id, { is_active: !client.is_active });
        
        setClients(prev => 
          prev.map(c => 
            c.id === client.id ? { ...c, is_active: !c.is_active } : c
          )
        );
        
        showSuccess(`"${client.name}" has been ${action}ed`);
      } catch (error) {
        console.error('Error updating client status:', error);
        showError(`Failed to ${action} client`);
      }
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowEditModal(false);
    setEditingClient(null);
    fetchClients(currentPage);
  };

  // Handle profile close
  const handleProfileClose = () => {
    setShowProfile(false);
    setSelectedClient(null);
  };

  // Get status badge
  const getStatusBadge = (isActive) => {
    if (isActive) {
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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Load clients on component mount
  useEffect(() => {
    fetchClients();
  }, []);

  if (showProfile && selectedClient) {
    return (
      <ClientProfile 
        client={selectedClient}
        onClose={handleProfileClose}
        onEdit={handleEditClient}
        onDelete={handleDeleteClient}
        onSuspend={handleSuspendClient}
      />
    );
  }

  return (
    <div className={`client-crm-page ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="client-crm-header">
        <div className="client-crm-title">
          <MdPerson className="title-icon" />
          <h1>Client Management</h1>
        </div>
        
        <div className="client-crm-actions">
          <button 
            className="add-client-btn"
            onClick={() => {
              setEditingClient(null);
              setShowEditModal(true);
            }}
          >
            <MdAdd className="add-icon" />
            Add Client
          </button>
          
          <button 
            className="refresh-btn"
            onClick={() => fetchClients(currentPage)}
          >
            <MdRefresh className="refresh-icon" />
            Refresh
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="client-crm-controls">
        <div className="search-section">
          <div className="search-bar">
            <MdSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search clients by name or email..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="filters-section">
          <div className="filter-group">
            <label>Status:</label>
            <select 
              value={filterStatus} 
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="client-crm-content">
        {loading ? (
          <div className="client-crm-loading">
            <LoadingSpinner />
            <span>Loading clients...</span>
          </div>
        ) : error ? (
          <div className="client-crm-error">
            <MdPerson className="error-icon" />
            <h3>Error loading clients</h3>
            <p>{error}</p>
            <button 
              className="retry-btn"
              onClick={() => fetchClients(currentPage)}
            >
              Try again
            </button>
          </div>
        ) : clients.length === 0 ? (
          <div className="client-crm-empty">
            <MdPerson className="empty-icon" />
            <h3>No clients found</h3>
            <p>No clients match your search criteria.</p>
            <button 
              className="add-first-btn"
              onClick={() => {
                setEditingClient(null);
                setShowEditModal(true);
              }}
            >
              <MdAdd className="add-icon" />
              Add your first client
            </button>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="client-crm-table-container">
              <table className="client-crm-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('name')}>
                      Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th>Contact</th>
                    <th onClick={() => handleSort('bookings_count')}>
                      Bookings {sortBy === 'bookings_count' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('registration_date')}>
                      Registration Date {sortBy === 'registration_date' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td>
                        <div className="client-name">
                          <div className="client-avatar">
                            {client.name.charAt(0)}
                          </div>
                          <div className="client-info">
                            <div className="client-name-text">{client.name}</div>
                            <div className="client-id">ID: {client.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          <div className="contact-item">
                            <MdEmail className="contact-icon" />
                            <span className="contact-text">{client.email}</span>
                          </div>
                          <div className="contact-item">
                            <MdPhone className="contact-icon" />
                            <span className="contact-text">{client.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="bookings-count">
                          {client.bookings_count} booking{client.bookings_count !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td>
                        <span className="registration-date">
                          {formatDate(client.registration_date)}
                        </span>
                      </td>
                      <td>
                        {getStatusBadge(client.is_active)}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn view"
                            onClick={() => handleViewClient(client)}
                            title="View Profile"
                          >
                            <MdVisibility />
                          </button>
                          <button 
                            className="action-btn edit"
                            onClick={() => handleEditClient(client)}
                            title="Edit Client"
                          >
                            <MdEdit />
                          </button>
                          <button 
                            className="action-btn suspend"
                            onClick={() => handleSuspendClient(client)}
                            title={client.is_active ? 'Suspend Client' : 'Reactivate Client'}
                          >
                            <MdWarning />
                          </button>
                          <button 
                            className="action-btn delete"
                            onClick={() => handleDeleteClient(client)}
                            title="Delete Client"
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
              <div className="client-crm-pagination">
                <button
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => fetchClients(currentPage - 1)}
                >
                  Previous
                </button>
                
                <div className="pagination-info">
                  Page {currentPage} of {totalPages}
                </div>
                
                <button
                  className="pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => fetchClients(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <ClientEditModal
          client={editingClient}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default ClientCRM;

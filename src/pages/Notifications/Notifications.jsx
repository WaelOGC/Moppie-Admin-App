import React, { useState, useEffect } from 'react';
import { MdNotifications, MdCheck, MdFilterList, MdRefresh } from 'react-icons/md';
import { getAllNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../../api/notifications';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const { isDarkMode } = useTheme();
  const { showSuccess, showError, showInfo } = useToast();

  const itemsPerPage = 20;

  // Fetch notifications
  const fetchNotifications = async (page = 1, filterType = filter) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        page_size: itemsPerPage,
        ordering: '-created_at'
      };

      // Add filter
      if (filterType !== 'all') {
        if (filterType === 'unread') {
          params.is_read = false;
        } else {
          params.type = filterType;
        }
      }

      const [notificationsResponse, unreadResponse] = await Promise.all([
        getAllNotifications(params),
        getUnreadCount()
      ]);

      setNotifications(notificationsResponse.data.results || []);
      setUnreadCount(unreadResponse.data.count || 0);
      setTotalPages(Math.ceil((notificationsResponse.data.count || 0) / itemsPerPage));
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications');
      
      // Fallback to mock data for development
      const mockNotifications = [
        {
          id: 1,
          title: 'New Job Assignment',
          message: 'You have been assigned to Wedding Photography - Sarah & John',
          type: 'job',
          is_read: false,
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          title: 'Media Approved',
          message: 'Your photos from Corporate Event have been approved',
          type: 'media',
          is_read: false,
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 3,
          title: 'Payment Received',
          message: 'Payment of $1,200 received for Wedding Package',
          type: 'payment',
          is_read: true,
          created_at: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: 4,
          title: 'Booking Confirmed',
          message: 'New booking confirmed for Family Portrait Session',
          type: 'booking',
          is_read: false,
          created_at: new Date(Date.now() - 10800000).toISOString(),
        },
        {
          id: 5,
          title: 'System Update',
          message: 'New features have been added to the admin panel',
          type: 'system',
          is_read: true,
          created_at: new Date(Date.now() - 14400000).toISOString(),
        },
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(3);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
    fetchNotifications(1, newFilter);
  };

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      try {
        await markAsRead(notification.id);
        setNotifications(prev => 
          prev.map(n => 
            n.id === notification.id ? { ...n, is_read: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    
    // TODO: Navigate to relevant page based on notification type
    // Example: navigate to job details, media review, etc.
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
      showSuccess('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      showError('Failed to mark all notifications as read');
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    fetchNotifications(page);
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'job': return '🛠️';
      case 'media': return '📸';
      case 'payment': return '💰';
      case 'booking': return '📅';
      case 'system': return '⚙️';
      default: return '🔔';
    }
  };

  // Get filter options
  const filterOptions = [
    { value: 'all', label: 'All', count: notifications.length },
    { value: 'unread', label: 'Unread', count: unreadCount },
    { value: 'job', label: 'Jobs', count: notifications.filter(n => n.type === 'job').length },
    { value: 'payment', label: 'Payments', count: notifications.filter(n => n.type === 'payment').length },
    { value: 'media', label: 'Media', count: notifications.filter(n => n.type === 'media').length },
    { value: 'booking', label: 'Bookings', count: notifications.filter(n => n.type === 'booking').length },
    { value: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length },
  ];

  // Load notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className={`notifications-page ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="notifications-header">
        <div className="notifications-title">
          <MdNotifications className="title-icon" />
          <h1>Notifications</h1>
          {unreadCount > 0 && (
            <span className="unread-badge">
              {unreadCount} unread
            </span>
          )}
        </div>
        
        <div className="notifications-actions">
          <button 
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <MdFilterList className="filter-icon" />
            Filters
          </button>
          
          {unreadCount > 0 && (
            <button 
              className="mark-all-btn"
              onClick={handleMarkAllAsRead}
            >
              <MdCheck className="mark-all-icon" />
              Mark all as read
            </button>
          )}
          
          <button 
            className="refresh-btn"
            onClick={() => fetchNotifications(currentPage)}
          >
            <MdRefresh className="refresh-icon" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="notifications-filters">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              className={`filter-btn ${filter === option.value ? 'active' : ''}`}
              onClick={() => handleFilterChange(option.value)}
            >
              {option.label}
              {option.count > 0 && (
                <span className="filter-count">{option.count}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="notifications-content">
        {loading ? (
          <div className="notifications-loading">
            <LoadingSpinner />
            <span>Loading notifications...</span>
          </div>
        ) : error ? (
          <div className="notifications-error">
            <MdNotifications className="error-icon" />
            <h3>Error loading notifications</h3>
            <p>{error}</p>
            <button 
              className="retry-btn"
              onClick={() => fetchNotifications(currentPage)}
            >
              Try again
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="notifications-empty">
            <MdNotifications className="empty-icon" />
            <h3>No notifications</h3>
            <p>
              {filter === 'all' 
                ? "You're all caught up! No notifications to show."
                : `No ${filter} notifications found.`
              }
            </p>
          </div>
        ) : (
          <>
            <div className="notifications-list">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">
                      {notification.title}
                    </div>
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-meta">
                      <span className="notification-time">
                        {formatTimestamp(notification.created_at)}
                      </span>
                      <span className="notification-type">
                        {notification.type}
                      </span>
                    </div>
                  </div>
                  {!notification.is_read && (
                    <div className="unread-indicator"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="notifications-pagination">
                <button
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>
                
                <div className="pagination-info">
                  Page {currentPage} of {totalPages}
                </div>
                
                <button
                  className="pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Notifications;

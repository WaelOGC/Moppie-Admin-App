import React, { useState, useEffect, useRef } from 'react';
import { MdNotifications, MdCheck, MdChevronRight } from 'react-icons/md';
import { getAllNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../../api/notifications';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../context/ToastContext';

const NotificationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const { isDarkMode } = useTheme();
  const { showSuccess, showError } = useToast();

  // Fetch notifications and unread count
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const [notificationsResponse, unreadResponse] = await Promise.all([
        getAllNotifications({ limit: 5, ordering: '-created_at' }),
        getUnreadCount()
      ]);
      
      setNotifications(notificationsResponse.data.results || []);
      setUnreadCount(unreadResponse.data.count || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to mock data for development
      setNotifications([
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
      ]);
      setUnreadCount(2);
    } finally {
      setLoading(false);
    }
  };

  // Handle dropdown toggle
  const toggleDropdown = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
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
    
    // Close dropdown
    setIsOpen(false);
    
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

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'job': return '🛠️';
      case 'media': return '📸';
      case 'payment': return '💰';
      case 'booking': return '📅';
      default: return '🔔';
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="notifications-dropdown-container" ref={dropdownRef}>
      <button 
        className="topbar-btn notification-btn"
        onClick={toggleDropdown}
        title="Notifications"
      >
        <MdNotifications className="topbar-btn-icon" />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={`notifications-dropdown ${isDarkMode ? 'dark' : 'light'}`}>
          <div className="notifications-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button 
                className="mark-all-btn"
                onClick={handleMarkAllAsRead}
              >
                <MdCheck className="mark-all-icon" />
                Mark all as read
              </button>
            )}
          </div>

          <div className="notifications-list">
            {loading ? (
              <div className="notifications-loading">
                <div className="loading-spinner"></div>
                <span>Loading notifications...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="notifications-empty">
                <MdNotifications className="empty-icon" />
                <span>No notifications</span>
              </div>
            ) : (
              notifications && notifications.map((notification) => (
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
                    <div className="notification-time">
                      {formatTimestamp(notification.created_at)}
                    </div>
                  </div>
                  <MdChevronRight className="notification-arrow" />
                </div>
              ))
            )}
          </div>

          <div className="notifications-footer">
            <button 
              className="view-all-btn"
              onClick={() => {
                setIsOpen(false);
                // TODO: Navigate to notifications page
                window.location.href = '/notifications';
              }}
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;

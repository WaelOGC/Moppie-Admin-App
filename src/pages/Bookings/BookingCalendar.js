import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBookingsForCalendar } from '../../api/bookings';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useNotifications } from '../../hooks/useNotifications';
import './BookingCalendar.css';

const BookingCalendar = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [filters, setFilters] = useState({
    staff: 'all',
    status: 'all',
    search: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedDay, setExpandedDay] = useState(null);
  const { showNotification } = useNotifications();

  // Mock booking data
  const mockBookings = [
    {
      id: 1,
      date: '2025-09-15',
      time: '09:00 - 10:30',
      customerName: 'Anna Johnson',
      serviceType: 'Deep Cleaning',
      status: 'confirmed',
      price: 120.00,
      staff: 'Maria Garcia',
      customerAddress: '123 Oak Street, Amsterdam',
      customerPhone: '+31 6 1234 5678',
      customerEmail: 'anna.johnson@email.com',
      notes: 'Please use eco-friendly products'
    },
    {
      id: 2,
      date: '2025-09-15',
      time: '14:00 - 15:30',
      customerName: 'Jan de Vries',
      serviceType: 'Regular Cleaning',
      status: 'pending',
      price: 85.00,
      staff: 'John Smith',
      customerAddress: '456 Pine Avenue, Amsterdam',
      customerPhone: '+31 6 2345 6789',
      customerEmail: 'jan.devries@email.com',
      notes: 'Pet-friendly cleaning required'
    },
    {
      id: 3,
      date: '2025-09-16',
      time: '10:00 - 11:30',
      customerName: 'Emma van der Berg',
      serviceType: 'Window Cleaning',
      status: 'completed',
      price: 95.00,
      staff: 'Maria Garcia',
      customerAddress: '789 Elm Street, Amsterdam',
      customerPhone: '+31 6 3456 7890',
      customerEmail: 'emma.vandenberg@email.com',
      notes: 'High windows only'
    },
    {
      id: 4,
      date: '2025-09-16',
      time: '16:00 - 17:30',
      customerName: 'Peter Bakker',
      serviceType: 'Deep Cleaning',
      status: 'cancelled',
      price: 120.00,
      staff: 'John Smith',
      customerAddress: '321 Maple Drive, Amsterdam',
      customerPhone: '+31 6 4567 8901',
      customerEmail: 'peter.bakker@email.com',
      notes: 'Cancelled due to scheduling conflict'
    },
    {
      id: 5,
      date: '2025-09-17',
      time: '08:30 - 10:00',
      customerName: 'Lisa Chen',
      serviceType: 'Regular Cleaning',
      status: 'confirmed',
      price: 75.00,
      staff: 'Maria Garcia',
      customerAddress: '654 Birch Lane, Amsterdam',
      customerPhone: '+31 6 5678 9012',
      customerEmail: 'lisa.chen@email.com',
      notes: 'Weekly recurring service'
    },
    {
      id: 6,
      date: '2025-09-17',
      time: '13:00 - 14:30',
      customerName: 'Michael Brown',
      serviceType: 'Deep Cleaning',
      status: 'pending',
      price: 110.00,
      staff: 'John Smith',
      customerAddress: '987 Cedar Court, Amsterdam',
      customerPhone: '+31 6 6789 0123',
      customerEmail: 'michael.brown@email.com',
      notes: 'First-time customer'
    },
    {
      id: 7,
      date: '2025-09-18',
      time: '11:00 - 12:30',
      customerName: 'Sophie van Dijk',
      serviceType: 'Window Cleaning',
      status: 'confirmed',
      price: 90.00,
      staff: 'Maria Garcia',
      customerAddress: '147 Spruce Street, Amsterdam',
      customerPhone: '+31 6 7890 1234',
      customerEmail: 'sophie.vandijk@email.com',
      notes: 'Bi-weekly service'
    },
    {
      id: 8,
      date: '2025-09-19',
      time: '15:00 - 16:30',
      customerName: 'David Wilson',
      serviceType: 'Regular Cleaning',
      status: 'completed',
      price: 80.00,
      staff: 'John Smith',
      customerAddress: '258 Willow Way, Amsterdam',
      customerPhone: '+31 6 8901 2345',
      customerEmail: 'david.wilson@email.com',
      notes: 'Office cleaning'
    },
    {
      id: 9,
      date: '2025-09-20',
      time: '09:30 - 11:00',
      customerName: 'Sarah Johnson',
      serviceType: 'Deep Cleaning',
      status: 'confirmed',
      price: 125.00,
      staff: 'Maria Garcia',
      customerAddress: '369 Poplar Place, Amsterdam',
      customerPhone: '+31 6 9012 3456',
      customerEmail: 'sarah.johnson@email.com',
      notes: 'Move-out cleaning'
    },
    {
      id: 10,
      date: '2025-09-21',
      time: '14:00 - 15:30',
      customerName: 'Tom Anderson',
      serviceType: 'Regular Cleaning',
      status: 'pending',
      price: 85.00,
      staff: 'John Smith',
      customerAddress: '741 Ash Avenue, Amsterdam',
      customerPhone: '+31 6 0123 4567',
      customerEmail: 'tom.anderson@email.com',
      notes: 'Monthly service'
    }
  ];

  const statusColors = {
    confirmed: '#3b82f6', // Blue
    pending: '#f59e0b',   // Orange
    completed: '#10b981', // Green
    cancelled: '#ef4444'  // Red
  };

  const statusLabels = {
    confirmed: 'Confirmed',
    pending: 'Pending',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };

  const staffMembers = [
    { id: 'all', name: 'All Staff' },
    { id: 'maria', name: 'Maria Garcia' },
    { id: 'john', name: 'John Smith' }
  ];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Initialize with mock data
  useEffect(() => {
    setBookings(mockBookings);
  }, []);

  // Filter bookings based on current filters
  const getFilteredBookings = () => {
    return mockBookings.filter(booking => {
      const matchesStaff = filters.staff === 'all' || 
        (filters.staff === 'maria' && booking.staff === 'Maria Garcia') ||
        (filters.staff === 'john' && booking.staff === 'John Smith');
      
      const matchesStatus = filters.status === 'all' || booking.status === filters.status;
      
      const matchesSearch = filters.search === '' || 
        booking.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
        booking.serviceType.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesStaff && matchesStatus && matchesSearch;
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getBookingsForDate = (day) => {
    if (!day) return [];
    
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return getFilteredBookings().filter(booking => booking.date === dateString);
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day) => {
    if (!day || !selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handleDateClick = (day, event) => {
    if (!day) return;
    
    // Prevent event bubbling to avoid conflicts
    if (event) {
      event.stopPropagation();
    }
    
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    
    // Clear any expanded day when selecting a new date
    setExpandedDay(null);
  };

  const getSelectedDateBookings = () => {
    if (!selectedDate) return [];
    const dateString = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    return bookings.filter(booking => booking.date === dateString);
  };

  const days = getDaysInMonth(currentDate);
  const selectedDateBookings = getSelectedDateBookings();

  return (
    <div className="content-area">
      <div className="page-header">
        <h1 className="page-title">Booking Calendar</h1>
        <p className="page-description">View and manage bookings in a modern calendar interface</p>
      </div>

      {/* Calendar Controls */}
      <div className="booking-calendar-controls">
        <div className="calendar-navigation">
          <Link to="/bookings" className="btn btn-secondary">
            ← Back to List
          </Link>
          
          <div className="calendar-nav-center">
            <button
              className="btn btn-ghost calendar-nav-btn"
              onClick={() => navigateMonth(-1)}
            >
              ← Previous
            </button>
            <h2 className="calendar-month-title">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              className="btn btn-ghost calendar-nav-btn"
              onClick={() => navigateMonth(1)}
            >
              Next →
            </button>
          </div>

          <div className="calendar-nav-right">
            <button
              className="btn btn-primary"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </button>
            <button
              className="btn btn-primary add-booking-btn"
              onClick={() => setShowAddModal(true)}
            >
              + Add Booking
            </button>
          </div>
        </div>

        {/* View Toggle and Filters */}
        <div className="calendar-filters">
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'month' ? 'active' : ''}`}
              onClick={() => setViewMode('month')}
            >
              Month
            </button>
            <button
              className={`view-btn ${viewMode === 'week' ? 'active' : ''}`}
              onClick={() => setViewMode('week')}
            >
              Week
            </button>
            <button
              className={`view-btn ${viewMode === 'day' ? 'active' : ''}`}
              onClick={() => setViewMode('day')}
            >
              Day
            </button>
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <label>Staff:</label>
              <select
                value={filters.staff}
                onChange={(e) => setFilters(prev => ({ ...prev, staff: e.target.value }))}
                className="filter-select"
              >
                {staffMembers.map(staff => (
                  <option key={staff.id} value={staff.id}>{staff.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Status:</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Search:</label>
              <input
                type="text"
                placeholder="Search clients..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="filter-search"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="booking-calendar-container">
        <div className="booking-calendar-grid">
          {/* Day Headers */}
          {dayNames.map(day => (
            <div key={day} className="calendar-day-header">
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {days.map((day, index) => {
            const dayBookings = getBookingsForDate(day);
            const isCurrentDay = isToday(day);
            const isSelectedDay = isSelected(day);
            const isExpanded = expandedDay === day;

            return (
              <div
                key={index}
                className={`calendar-day ${isCurrentDay ? 'today' : ''} ${isSelectedDay ? 'selected' : ''} ${isExpanded ? 'expanded' : ''}`}
                onClick={(e) => handleDateClick(day, e)}
              >
                {day && (
                  <>
                    <div className="calendar-day-number">
                      {day}
                    </div>
                    <div className="calendar-day-bookings">
                      {dayBookings.slice(0, isExpanded ? dayBookings.length : 2).map((booking, idx) => (
                        <div
                          key={idx}
                          className="booking-pill"
                          style={{
                            backgroundColor: statusColors[booking.status],
                            color: 'white'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            showNotification(`Booking: ${booking.customerName} - ${booking.time}`, 'info');
                          }}
                          title={`${booking.customerName} - ${booking.time} - ${statusLabels[booking.status]}`}
                        >
                          <div className="booking-time">{booking.time.split(' - ')[0]}</div>
                          <div className="booking-client">{booking.customerName}</div>
                          <div className="booking-status-badge">
                            {statusLabels[booking.status]}
                          </div>
                        </div>
                      ))}
                      {dayBookings.length > 2 && !isExpanded && (
                        <div 
                          className="more-bookings"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedDay(day);
                          }}
                        >
                          +{dayBookings.length - 2} more
                        </div>
                      )}
                      {isExpanded && dayBookings.length > 2 && (
                        <div 
                          className="collapse-bookings"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedDay(null);
                          }}
                        >
                          Show less
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="selected-date-details">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                Bookings for {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h2>
              <p className="card-description">
                {selectedDateBookings.length} booking{selectedDateBookings.length !== 1 ? 's' : ''} scheduled
              </p>
            </div>
            <div className="card-content">
              {selectedDateBookings.length === 0 ? (
                <div className="no-bookings">
                  <div className="no-bookings-icon">📅</div>
                  <h3>No bookings</h3>
                  <p>No bookings scheduled for this date.</p>
                </div>
              ) : (
                <div className="bookings-list">
                  {selectedDateBookings.map((booking) => (
                    <div key={booking.id} className="booking-card">
                      <div className="booking-card-header">
                        <div className="booking-info">
                          <h3>{booking.customerName}</h3>
                          <p>{booking.serviceType} • {booking.time}</p>
                        </div>
                        <div className="booking-meta">
                          <span
                            className="status-badge"
                            style={{
                              backgroundColor: statusColors[booking.status],
                              color: 'white'
                            }}
                          >
                            {statusLabels[booking.status]}
                          </span>
                          <span className="booking-price">${booking.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="booking-details">
                        <p>{booking.customerAddress}</p>
                        <p>{booking.customerPhone} • {booking.customerEmail}</p>
                        {booking.notes && (
                          <p className="booking-notes">"{booking.notes}"</p>
                        )}
                      </div>
                      <div className="booking-actions">
                        <Link
                          to={`/bookings/${booking.id}`}
                          className="btn btn-primary"
                        >
                          View Details
                        </Link>
                        <button
                          className="btn btn-secondary"
                          onClick={() => showNotification('Edit functionality coming soon', 'info')}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Booking Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content booking-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">📅 Add New Booking</h2>
              <button
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body booking-modal-body">
              <div className="booking-modal-content">
                {/* Left Column - Instructions/Form Placeholders */}
                <div className="booking-modal-left">
                  <div className="booking-instructions">
                    <h3 className="instructions-title">📋 Booking Information</h3>
                    <div className="instructions-list">
                      <div className="instruction-item">
                        <div className="instruction-icon">👤</div>
                        <div className="instruction-content">
                          <h4>Customer Information</h4>
                          <p>Name, email, phone number, and address</p>
                        </div>
                      </div>
                      
                      <div className="instruction-item">
                        <div className="instruction-icon">🧹</div>
                        <div className="instruction-content">
                          <h4>Service Type</h4>
                          <p>Regular Cleaning, Deep Cleaning, Window Cleaning</p>
                        </div>
                      </div>
                      
                      <div className="instruction-item">
                        <div className="instruction-icon">📅</div>
                        <div className="instruction-content">
                          <h4>Date & Time</h4>
                          <p>Select preferred date and time slot</p>
                        </div>
                      </div>
                      
                      <div className="instruction-item">
                        <div className="instruction-icon">👨‍💼</div>
                        <div className="instruction-content">
                          <h4>Staff Assignment</h4>
                          <p>Assign to available staff member</p>
                        </div>
                      </div>
                      
                      <div className="instruction-item">
                        <div className="instruction-icon">📝</div>
                        <div className="instruction-content">
                          <h4>Special Notes</h4>
                          <p>Any special requirements or instructions</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Action Buttons */}
                <div className="booking-modal-right">
                  <div className="booking-actions-panel">
                    <div className="action-buttons">
                      <button
                        className="btn btn-secondary cancel-btn"
                        onClick={() => setShowAddModal(false)}
                      >
                        <span className="btn-icon">❌</span>
                        <span className="btn-text">Cancel</span>
                      </button>
                      
                      <button
                        className="btn btn-primary create-btn"
                        onClick={() => {
                          setShowAddModal(false);
                          showNotification('Booking creation coming soon!', 'info');
                        }}
                      >
                        <span className="btn-icon">✅</span>
                        <span className="btn-text">Create Booking</span>
                      </button>
                    </div>
                    
                    <div className="booking-preview">
                      <h4 className="preview-title">📊 Quick Preview</h4>
                      <div className="preview-stats">
                        <div className="preview-stat">
                          <span className="stat-label">Estimated Duration:</span>
                          <span className="stat-value">2-3 hours</span>
                        </div>
                        <div className="preview-stat">
                          <span className="stat-label">Base Price:</span>
                          <span className="stat-value">€85-120</span>
                        </div>
                        <div className="preview-stat">
                          <span className="stat-label">Available Staff:</span>
                          <span className="stat-value">2 members</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;

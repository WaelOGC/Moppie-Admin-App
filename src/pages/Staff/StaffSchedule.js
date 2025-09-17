import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import { getAllEmployees } from '../../api/staff';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './StaffSchedule.css';

const StaffSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedule, setSchedule] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'month'
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignData, setAssignData] = useState({
    staffId: '',
    date: '',
    startTime: '',
    endTime: ''
  });
  const { showNotification } = useNotifications();

  // Load initial data
  useEffect(() => {
    loadData();
  }, [currentDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load staff list
      const staffResponse = await getAllEmployees();
      setStaff(staffResponse.data);

      // Load schedule for current week/month
      const startDate = getStartOfPeriod(currentDate, viewMode);
      const endDate = getEndOfPeriod(currentDate, viewMode);
      
      // For now, we'll use mock schedule data since the backend schedule endpoint
      // might need to be implemented differently
      const scheduleResponse = await fetch('/api/employees/schedule/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        params: {
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0]
        }
      });
      
      if (scheduleResponse.ok) {
        const scheduleData = await scheduleResponse.json();
        setSchedule(scheduleData);
      } else {
        // Fallback to empty schedule if endpoint not available
        setSchedule([]);
      }
    } catch (error) {
      console.error('Error loading schedule data:', error);
      setError('Failed to load schedule data');
      showNotification('error', 'Failed to load schedule data');
    } finally {
      setLoading(false);
    }
  };

  const getStartOfPeriod = (date, mode) => {
    const d = new Date(date);
    if (mode === 'week') {
      const day = d.getDay();
      const diff = d.getDate() - day;
      return new Date(d.setDate(diff));
    } else {
      return new Date(d.getFullYear(), d.getMonth(), 1);
    }
  };

  const getEndOfPeriod = (date, mode) => {
    const d = new Date(date);
    if (mode === 'week') {
      const day = d.getDay();
      const diff = d.getDate() - day + 6;
      return new Date(d.setDate(diff));
    } else {
      return new Date(d.getFullYear(), d.getMonth() + 1, 0);
    }
  };

  const getDaysInPeriod = () => {
    const start = getStartOfPeriod(currentDate, viewMode);
    const end = getEndOfPeriod(currentDate, viewMode);
    const days = [];
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    
    return days;
  };

  const getShiftsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return schedule.filter(shift => shift.date === dateStr);
  };

  const getShiftsForStaff = (staffId) => {
    return schedule.filter(shift => shift.staffId === staffId);
  };

  const handleDateChange = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const handleAssignShift = async () => {
    if (!assignData.staffId || !assignData.date || !assignData.startTime || !assignData.endTime) {
      showNotification('error', 'Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/employees/shifts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          employee_id: assignData.staffId,
          date: assignData.date,
          start_time: assignData.startTime,
          end_time: assignData.endTime
        })
      });

      if (response.ok) {
        const newShift = await response.json();
        setSchedule(prev => [...prev, newShift]);
        setShowAssignModal(false);
        setAssignData({ staffId: '', date: '', startTime: '', endTime: '' });
        showNotification('success', 'Shift assigned successfully');
      } else {
        showNotification('error', 'Failed to assign shift');
      }
    } catch (error) {
      console.error('Error assigning shift:', error);
      showNotification('error', 'Failed to assign shift');
    }
  };

  const handleRemoveShift = async (shiftId) => {
    if (window.confirm('Are you sure you want to remove this shift?')) {
      try {
        // In a real app, you'd call an API to remove the shift
        setSchedule(prev => prev.filter(shift => shift.id !== shiftId));
        showNotification('success', 'Shift removed successfully');
      } catch (error) {
        showNotification('error', 'Failed to remove shift');
      }
    }
  };

  const openAssignModal = (date, timeSlot) => {
    setAssignData({
      staffId: '',
      date: date.toISOString().split('T')[0],
      startTime: timeSlot || '09:00',
      endTime: timeSlot ? addHours(timeSlot, 8) : '17:00'
    });
    setShowAssignModal(true);
  };

  const addHours = (timeStr, hours) => {
    const [hoursStr, minutesStr] = timeStr.split(':');
    const totalMinutes = parseInt(hoursStr) * 60 + parseInt(minutesStr) + hours * 60;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getStaffName = (staffId) => {
    const staffMember = staff.find(s => s.id === staffId);
    return staffMember ? staffMember.name : 'Unknown';
  };

  const getStaffStatus = (staffId) => {
    const staffMember = staff.find(s => s.id === staffId);
    return staffMember ? staffMember.status : 'offline';
  };

  if (loading) {
    return (
      <div className="schedule-loading">
        <LoadingSpinner size="lg" />
        <p>Loading schedule...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="schedule-error">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Schedule</h3>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadData}>
          🔄 Retry
        </button>
      </div>
    );
  }

  return (
    <div className="staff-schedule-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Staff Schedule</h1>
          <p className="page-description">
            Manage staff shifts and view weekly schedules
          </p>
        </div>
        <div className="page-actions">
          <Link to="/staff" className="btn btn-secondary">
            👥 Staff Directory
          </Link>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAssignModal(true)}
          >
            ➕ Assign Shift
          </button>
        </div>
      </div>

      {/* Schedule Controls */}
      <div className="schedule-controls">
        <div className="date-navigation">
          <button 
            className="nav-btn"
            onClick={() => handleDateChange('prev')}
          >
            ← Previous
          </button>
          
          <div className="current-period">
            <h2>
              {viewMode === 'week' 
                ? `Week of ${getStartOfPeriod(currentDate, 'week').toLocaleDateString()}`
                : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              }
            </h2>
          </div>
          
          <button 
            className="nav-btn"
            onClick={() => handleDateChange('next')}
          >
            Next →
          </button>
        </div>

        <div className="view-controls">
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'week' ? 'active' : ''}`}
              onClick={() => setViewMode('week')}
            >
              📅 Week
            </button>
            <button
              className={`view-btn ${viewMode === 'month' ? 'active' : ''}`}
              onClick={() => setViewMode('month')}
            >
              📆 Month
            </button>
          </div>

          <div className="staff-filter">
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="filter-select"
            >
              <option value="">All Staff</option>
              {staff.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.role})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="schedule-grid">
        {viewMode === 'week' ? (
          <div className="weekly-view">
            <div className="time-slots">
              <div className="time-header">Time</div>
              {Array.from({ length: 12 }, (_, i) => {
                const hour = i + 6; // 6 AM to 6 PM
                return (
                  <div key={hour} className="time-slot">
                    {hour}:00
                  </div>
                );
              })}
            </div>
            
            <div className="days-grid">
              {getDaysInPeriod().map((date, index) => (
                <div key={index} className="day-column">
                  <div className={`day-header ${isToday(date) ? 'today' : ''}`}>
                    <div className="day-name">{formatDate(date)}</div>
                    <div className="day-date">{date.getDate()}</div>
                  </div>
                  
                  <div className="day-slots">
                    {Array.from({ length: 12 }, (_, i) => {
                      const hour = i + 6;
                      const timeStr = `${hour.toString().padStart(2, '0')}:00`;
                      const shifts = getShiftsForDate(date).filter(shift => 
                        shift.startTime.startsWith(hour.toString().padStart(2, '0'))
                      );
                      
                      return (
                        <div 
                          key={hour} 
                          className={`time-cell ${isToday(date) ? 'today' : ''}`}
                          onClick={() => openAssignModal(date, timeStr)}
                        >
                          {shifts.map(shift => (
                            <div 
                              key={shift.id}
                              className={`shift-item ${getStaffStatus(shift.staffId)}`}
                              title={`${getStaffName(shift.staffId)} - ${shift.startTime} to ${shift.endTime}`}
                            >
                              <div className="shift-staff">{getStaffName(shift.staffId)}</div>
                              <div className="shift-time">{shift.startTime}-{shift.endTime}</div>
                              <button 
                                className="shift-remove"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveShift(shift.id);
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="monthly-view">
            <div className="calendar-grid">
              {getDaysInPeriod().map((date, index) => {
                const shifts = getShiftsForDate(date);
                const filteredShifts = selectedStaff 
                  ? shifts.filter(shift => shift.staffId === parseInt(selectedStaff))
                  : shifts;
                
                return (
                  <div 
                    key={index} 
                    className={`calendar-day ${isToday(date) ? 'today' : ''}`}
                    onClick={() => openAssignModal(date)}
                  >
                    <div className="day-number">{date.getDate()}</div>
                    <div className="day-shifts">
                      {filteredShifts.slice(0, 3).map(shift => (
                        <div 
                          key={shift.id}
                          className={`calendar-shift ${getStaffStatus(shift.staffId)}`}
                          title={`${getStaffName(shift.staffId)} - ${shift.startTime} to ${shift.endTime}`}
                        >
                          {getStaffName(shift.staffId)}
                        </div>
                      ))}
                      {filteredShifts.length > 3 && (
                        <div className="more-shifts">
                          +{filteredShifts.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Assign Shift Modal */}
      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Assign Shift</h3>
              <button 
                className="modal-close"
                onClick={() => setShowAssignModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="staff-select">Staff Member</label>
                <select
                  id="staff-select"
                  value={assignData.staffId}
                  onChange={(e) => setAssignData(prev => ({ ...prev, staffId: e.target.value }))}
                  className="form-select"
                >
                  <option value="">Select staff member</option>
                  {staff.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.role})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="shift-date">Date</label>
                <input
                  id="shift-date"
                  type="date"
                  value={assignData.date}
                  onChange={(e) => setAssignData(prev => ({ ...prev, date: e.target.value }))}
                  className="form-input"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="start-time">Start Time</label>
                  <input
                    id="start-time"
                    type="time"
                    value={assignData.startTime}
                    onChange={(e) => setAssignData(prev => ({ ...prev, startTime: e.target.value }))}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="end-time">End Time</label>
                  <input
                    id="end-time"
                    type="time"
                    value={assignData.endTime}
                    onChange={(e) => setAssignData(prev => ({ ...prev, endTime: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowAssignModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleAssignShift}
              >
                Assign Shift
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffSchedule;

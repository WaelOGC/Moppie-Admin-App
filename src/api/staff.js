import api from "./config";

// Backend API endpoints for staff management
export const getAllEmployees = () => api.get("/employees/");

export const getEmployeeProfile = (id) => api.get(`/employees/${id}/`);

export const getEmployeeSchedule = (params) =>
  api.get("/employees/me/schedule/", { params });

export const getEmployeeJobs = (params) =>
  api.get("/employees/me/jobs/", { params });

export const getEmployeeEarnings = (params) =>
  api.get("/employees/me/earnings/", { params });

export const getEmployeeMedia = (params) =>
  api.get("/employees/me/media/", { params });

// Legacy API functions for backward compatibility
export const staffAPI = {
  // Get all staff members
  getStaffList: async (filters = {}) => {
    try {
      const response = await getAllEmployees();
      let filteredStaff = response.data;
      
      // Apply filters
      if (filters.role) {
        filteredStaff = filteredStaff.filter(staff => 
          staff.role?.toLowerCase() === filters.role.toLowerCase()
        );
      }
      
      if (filters.status) {
        filteredStaff = filteredStaff.filter(staff => 
          staff.status === filters.status
        );
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredStaff = filteredStaff.filter(staff => 
          staff.name?.toLowerCase().includes(searchTerm) ||
          staff.email?.toLowerCase().includes(searchTerm) ||
          staff.phone?.includes(searchTerm)
        );
      }
      
      return {
        success: true,
        data: filteredStaff,
        total: filteredStaff.length
      };
    } catch (error) {
      console.error('Error fetching staff list:', error);
      return {
        success: false,
        error: 'Failed to fetch staff list',
        data: []
      };
    }
  },

  // Get staff member by ID
  getStaffById: async (id) => {
    try {
      const response = await getEmployeeProfile(id);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching staff member:', error);
      return {
        success: false,
        error: 'Staff member not found',
        data: null
      };
    }
  },

  // Get employee schedule
  getEmployeeSchedule: async (params) => {
    try {
      const response = await getEmployeeSchedule(params);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching employee schedule:', error);
      return {
        success: false,
        error: 'Failed to fetch employee schedule',
        data: []
      };
    }
  },

  // Get employee jobs
  getEmployeeJobs: async (params) => {
    try {
      const response = await getEmployeeJobs(params);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching employee jobs:', error);
      return {
        success: false,
        error: 'Failed to fetch employee jobs',
        data: []
      };
    }
  },

  // Get employee earnings
  getEmployeeEarnings: async (params) => {
    try {
      const response = await getEmployeeEarnings(params);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching employee earnings:', error);
      return {
        success: false,
        error: 'Failed to fetch employee earnings',
        data: []
      };
    }
  },

  // Get employee media
  getEmployeeMedia: async (params) => {
    try {
      const response = await getEmployeeMedia(params);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching employee media:', error);
      return {
        success: false,
        error: 'Failed to fetch employee media',
        data: []
      };
    }
  },

  // Update staff status (online/offline)
  updateStaffStatus: async (id, newStatus) => {
    try {
      const response = await api.patch(`/employees/${id}/status/`, { status: newStatus });
      
      return {
        success: true,
        data: response.data,
        message: `Status updated to ${newStatus}`
      };
    } catch (error) {
      console.error('Error updating staff status:', error);
      return {
        success: false,
        error: 'Failed to update staff status'
      };
    }
  },

  // Delete staff member
  deleteStaff: async (id) => {
    try {
      await api.delete(`/employees/${id}/`);
      
      return {
        success: true,
        message: 'Staff member deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting staff member:', error);
      return {
        success: false,
        error: 'Failed to delete staff member'
      };
    }
  },

  // Assign shift to staff member
  assignShift: async (staffId, date, timeRange) => {
    try {
      const response = await api.post('/employees/shifts/', {
        employee_id: staffId,
        date: date,
        start_time: timeRange.startTime,
        end_time: timeRange.endTime
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Shift assigned successfully'
      };
    } catch (error) {
      console.error('Error assigning shift:', error);
      return {
        success: false,
        error: 'Failed to assign shift'
      };
    }
  },

  // Get shift history for staff member
  getShiftHistory: async (staffId, days = 30) => {
    try {
      const response = await api.get(`/employees/${staffId}/shifts/`, {
        params: { days }
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching shift history:', error);
      return {
        success: false,
        error: 'Failed to fetch shift history',
        data: []
      };
    }
  },

  // Get weekly schedule for calendar view
  getWeeklySchedule: async (startDate, endDate) => {
    try {
      const response = await api.get('/employees/schedule/', {
        params: { start_date: startDate, end_date: endDate }
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching weekly schedule:', error);
      return {
        success: false,
        error: 'Failed to fetch weekly schedule',
        data: []
      };
    }
  },

  // Add note to staff member
  addStaffNote: async (staffId, noteText, author) => {
    try {
      const response = await api.post(`/employees/${staffId}/notes/`, {
        text: noteText,
        author: author || 'Admin'
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Note added successfully'
      };
    } catch (error) {
      console.error('Error adding staff note:', error);
      return {
        success: false,
        error: 'Failed to add note'
      };
    }
  },

  // Update staff member profile
  updateStaffProfile: async (staffId, updates) => {
    try {
      const response = await api.patch(`/employees/${staffId}/`, updates);
      
      return {
        success: true,
        data: response.data,
        message: 'Staff profile updated successfully'
      };
    } catch (error) {
      console.error('Error updating staff profile:', error);
      return {
        success: false,
        error: 'Failed to update staff profile'
      };
    }
  }
};

export default staffAPI;

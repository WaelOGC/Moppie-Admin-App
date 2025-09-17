import api from './index';

export const employeesAPI = {
  // Get all employees
  getEmployees: async (params = {}) => {
    const response = await api.get('/employees', { params });
    return response;
  },

  // Get employee by ID
  getEmployee: async (employeeId) => {
    const response = await api.get(`/employees/${employeeId}`);
    return response;
  },

  // Create new employee
  createEmployee: async (employeeData) => {
    const response = await api.post('/employees', employeeData);
    return response;
  },

  // Update employee
  updateEmployee: async (employeeId, employeeData) => {
    const response = await api.put(`/employees/${employeeId}`, employeeData);
    return response;
  },

  // Delete employee
  deleteEmployee: async (employeeId) => {
    const response = await api.delete(`/employees/${employeeId}`);
    return response;
  },

  // Update employee status
  updateEmployeeStatus: async (employeeId, status) => {
    const response = await api.patch(`/employees/${employeeId}/status`, { status });
    return response;
  },

  // Get employee schedule
  getEmployeeSchedule: async (employeeId, params = {}) => {
    const response = await api.get(`/employees/${employeeId}/schedule`, { params });
    return response;
  },

  // Update employee schedule
  updateEmployeeSchedule: async (employeeId, scheduleData) => {
    const response = await api.put(`/employees/${employeeId}/schedule`, scheduleData);
    return response;
  },

  // Get employee performance
  getEmployeePerformance: async (employeeId, params = {}) => {
    const response = await api.get(`/employees/${employeeId}/performance`, { params });
    return response;
  },

  // Get employee availability
  getEmployeeAvailability: async (employeeId, params = {}) => {
    const response = await api.get(`/employees/${employeeId}/availability`, { params });
    return response;
  },

  // Update employee availability
  updateEmployeeAvailability: async (employeeId, availabilityData) => {
    const response = await api.put(`/employees/${employeeId}/availability`, availabilityData);
    return response;
  },

  // Get employee documents
  getEmployeeDocuments: async (employeeId) => {
    const response = await api.get(`/employees/${employeeId}/documents`);
    return response;
  },

  // Upload employee document
  uploadEmployeeDocument: async (employeeId, documentData) => {
    const response = await api.post(`/employees/${employeeId}/documents`, documentData);
    return response;
  },

  // Delete employee document
  deleteEmployeeDocument: async (employeeId, documentId) => {
    const response = await api.delete(`/employees/${employeeId}/documents/${documentId}`);
    return response;
  },

  // Get employee statistics
  getEmployeeStats: async (params = {}) => {
    const response = await api.get('/employees/stats', { params });
    return response;
  },
};

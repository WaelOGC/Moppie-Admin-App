import api from './index';

export const analyticsAPI = {
  // Get dashboard analytics
  getDashboardAnalytics: async (params = {}) => {
    const response = await api.get('/analytics/dashboard', { params });
    return response;
  },

  // Get revenue analytics
  getRevenueAnalytics: async (params = {}) => {
    const response = await api.get('/analytics/revenue', { params });
    return response;
  },

  // Get job analytics
  getJobAnalytics: async (params = {}) => {
    const response = await api.get('/analytics/jobs', { params });
    return response;
  },

  // Get employee performance analytics
  getEmployeeAnalytics: async (params = {}) => {
    const response = await api.get('/analytics/employees', { params });
    return response;
  },

  // Get client analytics
  getClientAnalytics: async (params = {}) => {
    const response = await api.get('/analytics/clients', { params });
    return response;
  },

  // Get inventory analytics
  getInventoryAnalytics: async (params = {}) => {
    const response = await api.get('/analytics/inventory', { params });
    return response;
  },

  // Get KPIs
  getKPIs: async (params = {}) => {
    const response = await api.get('/analytics/kpis', { params });
    return response;
  },

  // Get reports
  getReports: async (params = {}) => {
    const response = await api.get('/analytics/reports', { params });
    return response;
  },

  // Generate custom report
  generateReport: async (reportConfig) => {
    const response = await api.post('/analytics/reports/generate', reportConfig);
    return response;
  },

  // Export report
  exportReport: async (reportId, format = 'pdf') => {
    const response = await api.get(`/analytics/reports/${reportId}/export`, {
      params: { format },
      responseType: 'blob'
    });
    return response;
  },

  // Get trends
  getTrends: async (params = {}) => {
    const response = await api.get('/analytics/trends', { params });
    return response;
  },

  // Get comparative analytics
  getComparativeAnalytics: async (params = {}) => {
    const response = await api.get('/analytics/comparative', { params });
    return response;
  },

  // Get geographic analytics
  getGeographicAnalytics: async (params = {}) => {
    const response = await api.get('/analytics/geographic', { params });
    return response;
  },

  // Get time-based analytics
  getTimeBasedAnalytics: async (params = {}) => {
    const response = await api.get('/analytics/time-based', { params });
    return response;
  },

  // Get efficiency metrics
  getEfficiencyMetrics: async (params = {}) => {
    const response = await api.get('/analytics/efficiency', { params });
    return response;
  },

  // Get customer satisfaction metrics
  getCustomerSatisfactionMetrics: async (params = {}) => {
    const response = await api.get('/analytics/customer-satisfaction', { params });
    return response;
  },

  // Get financial metrics
  getFinancialMetrics: async (params = {}) => {
    const response = await api.get('/analytics/financial', { params });
    return response;
  },

  // Get operational metrics
  getOperationalMetrics: async (params = {}) => {
    const response = await api.get('/analytics/operational', { params });
    return response;
  },

  // Get real-time metrics
  getRealTimeMetrics: async () => {
    const response = await api.get('/analytics/real-time');
    return response;
  },
};

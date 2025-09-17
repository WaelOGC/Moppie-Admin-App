import api from "./config";

// Admin-side endpoints
export const getAllPayments = (params) => api.get("/payments/", { params });
export const getAllEstimates = (params) => api.get("/payments/estimates/", { params });
export const getEstimateById = (id) => api.get(`/payments/estimates/${id}/`);
export const createEstimate = (data) => api.post("/payments/estimates/", data);
export const updateEstimate = (id, data) => api.put(`/payments/estimates/${id}/`, data);

// Client-side endpoints
export const getClientEstimates = (params) =>
  api.get("/clients/me/payment-estimates/", { params });
export const approveEstimate = (jobId, data) =>
  api.post(`/clients/me/jobs/${jobId}/approve/`, data);
export const rejectEstimate = (jobId, data) =>
  api.post(`/clients/me/jobs/${jobId}/reject/`, data);

// Additional endpoints for enhanced functionality
export const getPaymentById = (id) => api.get(`/payments/${id}/`);
export const createPayment = (data) => api.post("/payments/", data);
export const updatePayment = (id, data) => api.put(`/payments/${id}/`, data);
export const deletePayment = (id) => api.delete(`/payments/${id}/`);
export const processPayment = (id, paymentMethod) => 
  api.post(`/payments/${id}/process/`, { payment_method: paymentMethod });
export const refundPayment = (id, amount, reason) => 
  api.post(`/payments/${id}/refund/`, { amount, reason });

// Invoice endpoints
export const getInvoices = (params) => api.get("/invoices/", { params });
export const getInvoiceById = (id) => api.get(`/invoices/${id}/`);
export const createInvoice = (data) => api.post("/invoices/", data);
export const updateInvoice = (id, data) => api.put(`/invoices/${id}/`, data);
export const sendInvoice = (id) => api.post(`/invoices/${id}/send/`);
export const markInvoiceAsPaid = (id, paymentData) => 
  api.post(`/invoices/${id}/mark-paid/`, paymentData);

// Statistics and utilities
export const getPaymentStats = (params) => api.get("/payments/stats/", { params });
export const getOverduePayments = () => api.get("/payments/overdue/");
export const getPaymentMethods = () => api.get("/payments/methods/");

// Legacy API object for backward compatibility
export const paymentsAPI = {
  getPayments: getAllPayments,
  getPayment: getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  processPayment,
  refundPayment,
  getInvoices,
  getInvoice: getInvoiceById,
  createInvoice,
  updateInvoice,
  sendInvoice,
  markInvoiceAsPaid,
  getEstimates: getAllEstimates,
  getEstimate: getEstimateById,
  createEstimate,
  updateEstimate,
  getPaymentStats,
  getOverduePayments,
  getPaymentMethods,
};

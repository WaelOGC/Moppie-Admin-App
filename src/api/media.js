import api from "./config";

// Backend API endpoints for Media Management
export const getEmployeeMedia = (params) =>
  api.get("/employees/me/media/", { params });

export const getJobMedia = (jobId) =>
  api.get(`/jobs/${jobId}/media/`);

export const updateMediaStatus = (mediaId, status) =>
  api.post(`/media/${mediaId}/update-status/`, { status });

// Additional endpoints for enhanced functionality
export const getMediaItems = (filters = {}) => api.get("/media/", { params: filters });
export const bulkUpdateMediaStatus = (mediaIds, status) => 
  api.post("/media/bulk-update-status/", { media_ids: mediaIds, status });
export const updateMediaImportance = (mediaId, isImportant) => 
  api.patch(`/media/${mediaId}/importance/`, { is_important: isImportant });
export const getMediaItem = (mediaId) => api.get(`/media/${mediaId}/`);
export const getJobsList = () => api.get("/jobs/", { params: { page_size: 100 } });

// Note: All functions now use backend API endpoints
// The updateMediaStatus function uses the specific endpoint format requested

import api from "./config";

export const getAllNotifications = (params) =>
  api.get("/notifications/", { params });

export const getUnreadCount = () =>
  api.get("/notifications/unread-count/");

export const markAsRead = (id) =>
  api.post(`/notifications/${id}/mark-as-read/`);

export const markAllAsRead = () =>
  api.post("/notifications/mark-all-as-read/");


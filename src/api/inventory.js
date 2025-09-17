import api from "./config";

export const getInventoryItems = (params) =>
  api.get("/inventory/", { params });

export const getInventoryItem = (id) =>
  api.get(`/inventory/${id}/`);

export const updateInventoryItem = (id, data) =>
  api.put(`/inventory/${id}/`, data);

export const createInventoryItem = (data) =>
  api.post("/inventory/", data);

export const deleteInventoryItem = (id) =>
  api.delete(`/inventory/${id}/`);
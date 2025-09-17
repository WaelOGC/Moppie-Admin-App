import api from "./config";

export const getAllClients = (params) =>
  api.get("/clients/", { params });

export const getClientDetails = (id) =>
  api.get(`/clients/${id}/`);

export const createClient = (data) =>
  api.post("/clients/", data);

export const updateClientInfo = (id, data) =>
  api.put(`/clients/${id}/`, data);

export const deleteClient = (id) =>
  api.delete(`/clients/${id}/`);
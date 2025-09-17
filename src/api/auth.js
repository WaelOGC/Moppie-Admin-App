import api from "./config";

export const login = (data) => api.post("/auth/login/", data);
export const register = (data) => api.post("/auth/register/", data);
export const logout = (data) => api.post("/auth/logout/", data);
export const getProfile = () => api.get("/auth/profile/");

// Additional auth functions for future use
export const forgotPassword = (email) => api.post("/auth/forgot-password/", { email });
export const resetPassword = (token, password) => api.post("/auth/reset-password/", { token, password });
export const changePassword = (currentPassword, newPassword) => api.post("/auth/change-password/", { currentPassword, newPassword });
export const verify2FA = (code, tempToken) => api.post("/auth/verify-2fa/", { code, temp_token: tempToken });
export const refreshToken = (refreshToken) => api.post("/auth/refresh/", { refresh_token: refreshToken });
export const enable2FA = () => api.post("/auth/enable-2fa/");
export const disable2FA = (password) => api.post("/auth/disable-2fa/", { password });

// Legacy authAPI export for backward compatibility during transition
export const authAPI = {
  login,
  register,
  logout,
  verifyToken: getProfile,
  verify2FA,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  enable2FA,
  disable2FA,
};
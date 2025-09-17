import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { login, register, logout, getProfile, verify2FA, refreshToken as refreshTokenAPI } from '../api/auth';

const AuthContext = createContext();

// DEV BYPASS - Only enabled in development with explicit flag
const DEV_BYPASS_AUTH = process.env.NODE_ENV === 'development' && 
                       process.env.REACT_APP_BYPASS_AUTH === 'true';

const initialState = {
  user: DEV_BYPASS_AUTH ? {
    id: 1,
    email: "admin@moppie.nl",
    name: "Admin User",
    role: "admin",
    is_verified: true,
    is_active: true,
    avatar: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } : null,
  accessToken: DEV_BYPASS_AUTH ? 'dev-bypass-token' : localStorage.getItem('access_token'),
  refreshToken: DEV_BYPASS_AUTH ? 'dev-bypass-refresh-token' : localStorage.getItem('refresh_token'),
  isAuthenticated: DEV_BYPASS_AUTH,
  isLoading: !DEV_BYPASS_AUTH,
  error: null,
  requires2FA: false,
  tempToken: null, // Temporary token for 2FA flow
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        requires2FA: false,
        tempToken: null,
      };
    case 'AUTH_2FA_REQUIRED':
      return {
        ...state,
        isLoading: false,
        requires2FA: true,
        tempToken: action.payload.tempToken,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        requires2FA: false,
        tempToken: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        requires2FA: false,
        tempToken: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Helper function to store tokens
  const storeTokens = (accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  };

  // Helper function to clear tokens
  const clearTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  // Initialize auth on app start
  useEffect(() => {
    const initializeAuth = async () => {
      // TEMPORARY ADMIN BYPASS FOR LOCAL DEVELOPMENT
      // TODO: Remove this before production deployment
      const DEV_BYPASS_AUTH = process.env.REACT_APP_BYPASS_AUTH === 'true' || 
                             process.env.NODE_ENV === 'development' ||
                             window.location.hostname === 'localhost';
      
      if (DEV_BYPASS_AUTH) {
        console.log('🚀 DEV MODE: Bypassing authentication for local development');
        console.log('Environment check:', {
          NODE_ENV: process.env.NODE_ENV,
          REACT_APP_BYPASS_AUTH: process.env.REACT_APP_BYPASS_AUTH,
          hostname: window.location.hostname
        });
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: {
              id: 1,
              email: "admin@moppie.nl",
              name: "Admin User",
              role: "admin",
              is_verified: true,
              is_active: true,
              avatar: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            accessToken: 'dev-bypass-token',
            refreshToken: 'dev-bypass-refresh-token',
          },
        });
        return;
      }

      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        try {
          dispatch({ type: 'AUTH_START' });
          // Verify token with backend API
          const response = await getProfile();
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: response.data,
              accessToken: accessToken,
              refreshToken: localStorage.getItem('refresh_token'),
            },
          });
        } catch (error) {
          // Token is invalid, try to refresh
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            try {
              const refreshResponse = await refreshTokenAPI(refreshToken);
              const { access_token, refresh_token, user } = refreshResponse.data;
              storeTokens(access_token, refresh_token);
              dispatch({
                type: 'AUTH_SUCCESS',
                payload: {
                  user,
                  accessToken: access_token,
                  refreshToken: refresh_token,
                },
              });
            } catch (refreshError) {
              // Refresh failed, clear tokens and redirect to login
              clearTokens();
              dispatch({ type: 'AUTH_FAILURE', payload: null });
            }
          } else {
            clearTokens();
            dispatch({ type: 'AUTH_FAILURE', payload: null });
          }
        }
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: null });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const loginUser = async (credentials) => {
    // TEMPORARY ADMIN BYPASS FOR LOCAL DEVELOPMENT
    const DEV_BYPASS_AUTH = process.env.REACT_APP_BYPASS_AUTH === 'true' || 
                           process.env.NODE_ENV === 'development' ||
                           window.location.hostname === 'localhost';
    
    if (DEV_BYPASS_AUTH) {
      console.log('🚀 DEV MODE: Bypassing login for local development');
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: {
            id: 1,
            email: "admin@moppie.nl",
            name: "Admin User",
            role: "admin",
            is_verified: true,
            is_active: true,
            avatar: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          accessToken: 'dev-bypass-token',
          refreshToken: 'dev-bypass-refresh-token',
        },
      });
      return { success: true };
    }

    try {
      dispatch({ type: 'AUTH_START' });
      const response = await login(credentials);
      const { user, access_token, refresh_token, requires_2fa, temp_token } = response.data;
      
      if (requires_2fa) {
        // 2FA required, store temp token and redirect to 2FA page
        dispatch({
          type: 'AUTH_2FA_REQUIRED',
          payload: { tempToken: temp_token },
        });
        return { success: true, requires2FA: true };
      } else {
        // Login successful, store tokens
        storeTokens(access_token, refresh_token);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user,
            accessToken: access_token,
            refreshToken: refresh_token,
          },
        });
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response?.status === 401) {
        errorMessage = error.response.data?.message || 'Invalid credentials';
      } else if (error.response?.status === 422) {
        errorMessage = error.response.data?.message || 'Please check your input and try again.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // 2FA verification function
  const verify2FAUser = async (code) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await verify2FA(code, state.tempToken);
      const { user, access_token, refresh_token } = response.data;
      
      storeTokens(access_token, refresh_token);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user,
          accessToken: access_token,
          refreshToken: refresh_token,
        },
      });
      return { success: true };
    } catch (error) {
      console.error('2FA verification error:', error);
      let errorMessage = '2FA verification failed. Please try again.';
      
      if (error.response?.status === 401) {
        errorMessage = error.response.data?.message || 'Invalid 2FA code';
      } else if (error.response?.status === 422) {
        errorMessage = error.response.data?.message || 'Please enter a valid 6-digit code.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const registerUser = async (userData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await register(userData);
      const { user, access_token, refresh_token, requires_2fa, temp_token } = response.data;
      
      if (requires_2fa) {
        dispatch({
          type: 'AUTH_2FA_REQUIRED',
          payload: { tempToken: temp_token },
        });
        return { success: true, requires2FA: true };
      } else {
        storeTokens(access_token, refresh_token);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user,
            accessToken: access_token,
            refreshToken: refresh_token,
          },
        });
        return { success: true };
      }
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response?.status === 400) {
        errorMessage = 'Invalid registration data. Please check your information.';
      } else if (error.response?.status === 422) {
        errorMessage = error.response.data?.message || 'Please check your input and try again.';
      } else if (error.response?.status === 409) {
        errorMessage = error.response.data?.message || 'An account with this email already exists.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Refresh token function
  const refreshTokenUser = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refresh_token');
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const response = await refreshTokenAPI(refreshTokenValue);
      const { access_token, refresh_token: newRefreshToken, user } = response.data;
      
      storeTokens(access_token, newRefreshToken);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user,
          accessToken: access_token,
          refreshToken: newRefreshToken,
        },
      });
      return { success: true };
    } catch (error) {
      // Refresh failed, logout user
      logoutUser();
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logoutUser = async () => {
    try {
      // Call logout endpoint if we have a token
      if (state.accessToken) {
        await logout();
      }
    } catch (error) {
      // Ignore logout errors, still clear local state
      console.warn('Logout API call failed:', error);
    } finally {
      clearTokens();
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Update user function
  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login: loginUser,
    register: registerUser,
    verify2FA: verify2FAUser,
    logout: logoutUser,
    refreshToken: refreshTokenUser,
    updateUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

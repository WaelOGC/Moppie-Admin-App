import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import TwoFactorAuth from './pages/Auth/TwoFactorAuth';

// Main Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Bookings from './pages/Bookings/Bookings';
import BookingCalendar from './pages/Bookings/BookingCalendar';
import BookingDetails from './pages/Bookings/BookingDetails';
import Staff from './pages/Staff/Staff';
import StaffSchedule from './pages/Staff/StaffSchedule';
import StaffDetails from './pages/Staff/StaffDetails';
import Jobs from './pages/Jobs/Jobs';
import JobDetails from './pages/Jobs/JobDetails';
import JobCalendar from './pages/Jobs/JobCalendar';
import MediaReview from './pages/Jobs/MediaReview';
import Media from './pages/Media/Media';
import Payments from './pages/Payments/Payments';
import Estimates from './pages/Payments/Estimates';
import ClientEstimates from './pages/Payments/ClientEstimates';
import Analytics from './pages/Analytics/Analytics';
import Inventory from './pages/Inventory/Inventory';
import Notifications from './pages/Notifications/Notifications';
import ClientCRM from './pages/Clients/ClientCRM';
import Settings from './pages/Settings/Settings';

// Layout Components
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, requires2FA } = useAuth();

  if (isLoading) {
    return (
      <div className="auth-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requires2FA) {
    return <Navigate to="/2fa" replace />;
  }

  return children;
};

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading, requires2FA } = useAuth();

  if (isLoading) {
    return (
      <div className="auth-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (isAuthenticated && !requires2FA) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// 2FA Route Component (only accessible when 2FA is required)
const TwoFARoute = ({ children }) => {
  const { isAuthenticated, isLoading, requires2FA } = useAuth();

  if (isLoading) {
    return (
      <div className="auth-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!requires2FA) {
    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/2fa"
        element={
          <TwoFARoute>
            <TwoFactorAuth />
          </TwoFARoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="bookings/calendar" element={<BookingCalendar />} />
        <Route path="bookings/:id" element={<BookingDetails />} />
        <Route path="staff" element={<Staff />} />
        <Route path="staff/schedule" element={<StaffSchedule />} />
        <Route path="staff/:id" element={<StaffDetails />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="jobs/:id" element={<JobDetails />} />
        <Route path="jobs/calendar" element={<JobCalendar />} />
        <Route path="jobs/media-review" element={<MediaReview />} />
        <Route path="media" element={<Media />} />
        <Route path="payments" element={<Payments />} />
        <Route path="payments/estimates" element={<Estimates />} />
        <Route path="client/estimates" element={<ClientEstimates />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="clients" element={<ClientCRM />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;

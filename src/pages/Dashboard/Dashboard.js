import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dashboardStats } from '../../mock/dashboardStats'; // Fallback data
import KpiCards from '../../components/dashboard/KpiCards';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import QuickActions from '../../components/dashboard/QuickActions';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import usePageTitle from '../../hooks/usePageTitle';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  usePageTitle('Dashboard');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call in production
      // const response = await dashboardAPI.getDashboardStats();
      // setDashboardData(response.data);
      
      // For now, use mock data with a delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDashboardData(dashboardStats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
      // Fallback to mock data
      setDashboardData(dashboardStats);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="content-area">
        <div className="dashboard-loading">
          <LoadingSpinner size="large" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="content-area">
        <div className="dashboard-error">
          <h2>⚠️ Unable to load dashboard</h2>
          <p>{error}</p>
          <button onClick={loadDashboardData} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-area">
      {/* Welcome Header */}
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1 className="dashboard-title">
            Welcome, {user?.name || 'Admin'} 👋
          </h1>
          <p className="dashboard-subtitle">
            Here's what's happening with your business today
          </p>
        </div>
        <div className="dashboard-date">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="dashboard-section">
        <KpiCards data={dashboardData?.kpiCards} />
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Left Column - Activity Feed */}
        <div className="dashboard-column dashboard-column-left">
          <div className="dashboard-card activity-feed-card">
            <ActivityFeed activities={dashboardData?.activities} />
          </div>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="dashboard-column dashboard-column-right">
          <div className="dashboard-card quick-actions-card">
            <QuickActions actions={dashboardData?.quickActions} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="dashboard-footer">
        <div className="dashboard-footer-content">
          <div className="footer-info">
            <span className="footer-version">Moppie Admin v1.0.0</span>
            <span className="footer-separator">•</span>
            <span className="footer-timestamp">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
          <div className="footer-copyright">
            © 2024 Moppie Admin. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
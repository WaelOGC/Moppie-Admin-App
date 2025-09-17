import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNotifications } from '../../hooks/useNotifications';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './Analytics.css';

const Analytics = () => {
  const [loading, setLoading] = useState(false);
  const [kpiData, setKpiData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const { showNotification } = useNotifications();

  // Mock data for analytics
  const mockKpiData = {
    totalBookings: 156,
    totalRevenue: 18750,
    activeStaff: 8,
    averageRating: 4.8
  };

  const mockBookingsData = [
    { week: 'Week 1', bookings: 12 },
    { week: 'Week 2', bookings: 18 },
    { week: 'Week 3', bookings: 15 },
    { week: 'Week 4', bookings: 22 },
    { week: 'Week 5', bookings: 19 },
    { week: 'Week 6', bookings: 25 },
    { week: 'Week 7', bookings: 21 },
    { week: 'Week 8', bookings: 24 }
  ];

  const mockServiceData = [
    { name: 'Regular Cleaning', value: 45, color: '#3b82f6' },
    { name: 'Deep Cleaning', value: 30, color: '#10b981' },
    { name: 'Window Cleaning', value: 15, color: '#f59e0b' },
    { name: 'Office Cleaning', value: 10, color: '#8b5cf6' }
  ];

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setKpiData(mockKpiData);
      setChartData({
        bookings: mockBookingsData,
        services: mockServiceData
      });
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      showNotification('Failed to load analytics data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">
            {payload[0].value} bookings
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="content-area">
        <div className="loading-container">
          <LoadingSpinner size="lg" />
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-area">
      <div className="page-header">
        <h1 className="page-title">📊 Analytics Dashboard</h1>
        <p className="page-description">Business insights, KPIs, and performance metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="analytics-kpi-grid">
        <div className="kpi-card bookings-card">
          <div className="kpi-icon">📅</div>
          <div className="kpi-content">
            <div className="kpi-value">{kpiData?.totalBookings || 0}</div>
            <div className="kpi-label">Total Bookings</div>
            <div className="kpi-change positive">+12% from last month</div>
          </div>
        </div>

        <div className="kpi-card revenue-card">
          <div className="kpi-icon">💰</div>
          <div className="kpi-content">
            <div className="kpi-value">{formatCurrency(kpiData?.totalRevenue || 0)}</div>
            <div className="kpi-label">Total Revenue</div>
            <div className="kpi-change positive">+8% from last month</div>
          </div>
        </div>

        <div className="kpi-card staff-card">
          <div className="kpi-icon">👥</div>
          <div className="kpi-content">
            <div className="kpi-value">{kpiData?.activeStaff || 0}</div>
            <div className="kpi-label">Active Staff</div>
            <div className="kpi-change neutral">2 new hires this month</div>
          </div>
        </div>

        <div className="kpi-card rating-card">
          <div className="kpi-icon">⭐</div>
          <div className="kpi-content">
            <div className="kpi-value">{kpiData?.averageRating || 0}</div>
            <div className="kpi-label">Average Rating</div>
            <div className="kpi-change positive">+0.2 from last month</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="analytics-charts-grid">
        {/* Bookings Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">📈 Bookings per Week</h3>
            <p className="chart-description">Weekly booking trends over the last 8 weeks</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData?.bookings || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis 
                  dataKey="week" 
                  stroke="var(--text-secondary)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--text-secondary)"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="var(--primary-color)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--primary-color)', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'var(--primary-color)', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Distribution Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">🥧 Service Type Distribution</h3>
            <p className="chart-description">Breakdown of services by type</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData?.services || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(chartData?.services || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Analytics Cards */}
      <div className="analytics-insights-grid">
        <div className="insight-card">
          <div className="insight-header">
            <h4 className="insight-title">🎯 Top Performing Services</h4>
          </div>
          <div className="insight-content">
            <div className="service-rank">
              <span className="rank-number">1</span>
              <span className="service-name">Regular Cleaning</span>
              <span className="service-count">45 bookings</span>
            </div>
            <div className="service-rank">
              <span className="rank-number">2</span>
              <span className="service-name">Deep Cleaning</span>
              <span className="service-count">30 bookings</span>
            </div>
            <div className="service-rank">
              <span className="rank-number">3</span>
              <span className="service-name">Window Cleaning</span>
              <span className="service-count">15 bookings</span>
            </div>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-header">
            <h4 className="insight-title">👨‍💼 Staff Performance</h4>
          </div>
          <div className="insight-content">
            <div className="staff-performance">
              <div className="staff-item">
                <span className="staff-name">Maria Garcia</span>
                <span className="staff-rating">4.9 ⭐</span>
              </div>
              <div className="staff-item">
                <span className="staff-name">John Smith</span>
                <span className="staff-rating">4.7 ⭐</span>
              </div>
              <div className="staff-item">
                <span className="staff-name">Sarah Johnson</span>
                <span className="staff-rating">4.8 ⭐</span>
              </div>
            </div>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-header">
            <h4 className="insight-title">📅 Peak Hours</h4>
          </div>
          <div className="insight-content">
            <div className="peak-hours">
              <div className="hour-item">
                <span className="hour-time">9:00 AM</span>
                <span className="hour-bookings">12 bookings</span>
              </div>
              <div className="hour-item">
                <span className="hour-time">2:00 PM</span>
                <span className="hour-bookings">15 bookings</span>
              </div>
              <div className="hour-item">
                <span className="hour-time">10:00 AM</span>
                <span className="hour-bookings">11 bookings</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { getAllPayments } from '../../api/payments';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    paymentMethod: 'all',
    status: 'all',
    staff: 'all',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [dateRange, setDateRange] = useState('30'); // days
  const { showNotification } = useNotifications();

  // Load payments data from backend
  useEffect(() => {
    loadPayments();
  }, [filters, dateRange]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Transform frontend filters to backend parameters
      const params = {
        status: filters.status !== 'all' ? filters.status : undefined,
        payment_method: filters.paymentMethod !== 'all' ? filters.paymentMethod : undefined,
        staff: filters.staff !== 'all' ? filters.staff : undefined,
        search: filters.search || undefined,
        date_from: filters.dateFrom || undefined,
        date_to: filters.dateTo || undefined,
        page: currentPage,
        page_size: itemsPerPage
      };

      // Remove undefined values
      Object.keys(params).forEach(key => 
        params[key] === undefined && delete params[key]
      );

      const response = await getAllPayments(params);
      
      if (response.data && response.data.results) {
        // Handle paginated response
        setPayments(response.data.results);
      } else if (Array.isArray(response.data)) {
        // Handle direct array response
        setPayments(response.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Failed to load payments:', error);
      setError('Failed to load payments');
      showNotification(
        error.response?.data?.message || 'Failed to load payments', 
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  // Payment method icons and labels
  const paymentMethods = {
    card: { icon: '💳', label: 'Card', color: '#3b82f6' },
    cash: { icon: '💵', label: 'Cash', color: '#10b981' },
    bank_transfer: { icon: '🏦', label: 'Bank Transfer', color: '#8b5cf6' },
    paypal: { icon: '🅿️', label: 'PayPal', color: '#0070ba' }
  };

  // Status configurations
  const statusConfig = {
    paid: { icon: '✅', label: 'Paid', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' },
    pending: { icon: '⏳', label: 'Pending', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' },
    failed: { icon: '❌', label: 'Failed', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
    refunded: { icon: '💸', label: 'Refunded', color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.1)' }
  };

  // Staff members
  const staffMembers = [
    { id: 'all', name: 'All Staff' },
    { id: 'maria', name: 'Maria Garcia' },
    { id: 'john', name: 'John Smith' }
  ];


  // Calculate summary statistics
  const calculateSummary = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

    const currentPeriod = payments.filter(p => new Date(p.date) >= thirtyDaysAgo);

    const totalRevenue = currentPeriod
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalPayouts = currentPeriod
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + (p.amount * 0.7), 0); // 70% to staff

    const pendingPayments = currentPeriod
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);

    const refundedAmounts = currentPeriod
      .filter(p => p.status === 'refunded')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      totalRevenue,
      totalPayouts,
      pendingPayments,
      refundedAmounts,
      revenueChange: 0 // Will be calculated from backend stats if available
    };
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-EU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Pagination
  const totalPages = Math.ceil(payments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = payments.slice(startIndex, startIndex + itemsPerPage);

  const summary = calculateSummary();

  const handleExportCSV = () => {
    showNotification('CSV export functionality coming soon!', 'info');
  };

  const handleExportPDF = () => {
    showNotification('PDF export functionality coming soon!', 'info');
  };

  const handleViewPayment = (paymentId) => {
    showNotification(`Viewing payment ${paymentId}`, 'info');
  };

  const handleEditPayment = (paymentId) => {
    showNotification(`Editing payment ${paymentId}`, 'info');
  };

  if (loading) {
    return (
      <div className="content-area">
        <div className="loading-container">
          <LoadingSpinner size="lg" />
          <p>Loading payments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-area">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Payments</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadPayments}>
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-area">
      {/* Header Section */}
      <div className="page-header">
        <h1 className="page-title">💳 Payments Overview</h1>
        <p className="page-description">Manage and track all payment transactions</p>
      </div>

      {/* Header Controls */}
      <div className="payments-header-controls">
        <div className="date-range-selector">
          <label>Date Range:</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="date-range-select"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
        
        <div className="export-buttons">
          <button
            className="btn btn-secondary export-btn"
            onClick={handleExportCSV}
          >
            📊 Export CSV
          </button>
          <button
            className="btn btn-secondary export-btn"
            onClick={handleExportPDF}
          >
            📄 Export PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="payments-summary-cards">
        <div className="summary-card revenue-card">
          <div className="summary-card-icon">
            💰
          </div>
          <div className="summary-card-content">
            <div className="summary-card-value">{formatCurrency(summary.totalRevenue)}</div>
            <div className="summary-card-title">Total Revenue</div>
            <div className="summary-card-subtitle">Last 30 days</div>
            <div className={`summary-card-change ${summary.revenueChange >= 0 ? 'positive' : 'negative'}`}>
              {summary.revenueChange >= 0 ? '↗' : '↘'} {Math.abs(summary.revenueChange).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="summary-card payouts-card">
          <div className="summary-card-icon">
            💸
          </div>
          <div className="summary-card-content">
            <div className="summary-card-value">{formatCurrency(summary.totalPayouts)}</div>
            <div className="summary-card-title">Total Payouts</div>
            <div className="summary-card-subtitle">Staff payments</div>
            <div className="summary-card-change positive">
              ↗ 70% of revenue
            </div>
          </div>
        </div>

        <div className="summary-card pending-card">
          <div className="summary-card-icon">
            ⏳
          </div>
          <div className="summary-card-content">
            <div className="summary-card-value">{formatCurrency(summary.pendingPayments)}</div>
            <div className="summary-card-title">Pending Payments</div>
            <div className="summary-card-subtitle">Awaiting processing</div>
            <div className="summary-card-change neutral">
              {payments.filter(p => p.status === 'pending').length} transactions
            </div>
          </div>
        </div>

        <div className="summary-card refunds-card">
          <div className="summary-card-icon">
            🔄
          </div>
          <div className="summary-card-content">
            <div className="summary-card-value">{formatCurrency(summary.refundedAmounts)}</div>
            <div className="summary-card-title">Refunded Amounts</div>
            <div className="summary-card-subtitle">Processed refunds</div>
            <div className="summary-card-change negative">
              {payments.filter(p => p.status === 'refunded').length} refunds
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <div className="payments-filters">
        <div className="filter-group">
          <label>Date From:</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Date To:</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Payment Method:</label>
          <select
            value={filters.paymentMethod}
            onChange={(e) => setFilters(prev => ({ ...prev, paymentMethod: e.target.value }))}
            className="filter-select"
          >
            <option value="all">All Methods</option>
            <option value="card">💳 Card</option>
            <option value="cash">💵 Cash</option>
            <option value="bank_transfer">🏦 Bank Transfer</option>
            <option value="paypal">🅿️ PayPal</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="paid">✅ Paid</option>
            <option value="pending">⏳ Pending</option>
            <option value="failed">❌ Failed</option>
            <option value="refunded">💸 Refunded</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Staff:</label>
          <select
            value={filters.staff}
            onChange={(e) => setFilters(prev => ({ ...prev, staff: e.target.value }))}
            className="filter-select"
          >
            {staffMembers.map(staff => (
              <option key={staff.id} value={staff.id}>{staff.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Customer name or Payment ID..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="filter-search"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="payments-table-container">
        <div className="table-header">
          <h3>Payment Records ({payments.length})</h3>
          <div className="table-actions">
            <span>Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, payments.length)} of {payments.length}</span>
          </div>
        </div>

        <div className="payments-table-wrapper">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Staff</th>
                <th>Service</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.map((payment) => (
                <tr key={payment.id}>
                  <td className="payment-id">{payment.id}</td>
                  <td className="payment-date">{formatDate(payment.date)}</td>
                  <td className="customer-name">{payment.customerName}</td>
                  <td className="staff-member">{payment.staffMember}</td>
                  <td className="service-type">{payment.serviceType}</td>
                  <td className="amount">{formatCurrency(payment.amount)}</td>
                  <td className="payment-method">
                    <span className="method-icon" style={{ color: paymentMethods[payment.method].color }}>
                      {paymentMethods[payment.method].icon}
                    </span>
                    {paymentMethods[payment.method].label}
                  </td>
                  <td className="status">
                    <span
                      className="status-badge"
                      style={{
                        color: statusConfig[payment.status].color,
                        backgroundColor: statusConfig[payment.status].bgColor,
                        borderColor: statusConfig[payment.status].color
                      }}
                    >
                      {statusConfig[payment.status].icon} {statusConfig[payment.status].label}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="action-btn view-btn"
                      onClick={() => handleViewPayment(payment.id)}
                      title="View Details"
                    >
                      👁️
                    </button>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEditPayment(payment.id)}
                      title="Edit Payment"
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            
            <div className="pagination-info">
              Page {currentPage} of {totalPages}
            </div>
            
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
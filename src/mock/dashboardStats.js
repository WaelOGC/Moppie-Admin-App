// Mock dashboard data for the Moppie Admin Dashboard
export const dashboardStats = {
  totalBookings: 1024,
  pendingJobs: 23,
  staffOnline: 7,
  revenue: "€12,450",
  
  // KPI Cards data
  kpiCards: [
    {
      id: 'total-bookings',
      title: 'Total Bookings',
      value: 1024,
      subtitle: '12 this week',
      icon: 'MdCalendarToday',
      color: '#3b82f6',
      trend: '+12%',
      trendUp: true
    },
    {
      id: 'pending-jobs',
      title: 'Pending Jobs',
      value: 23,
      subtitle: '3 urgent',
      icon: 'MdWork',
      color: '#f59e0b',
      trend: '+5%',
      trendUp: false
    },
    {
      id: 'staff-online',
      title: 'Staff Online',
      value: 7,
      subtitle: 'of 12 total',
      icon: 'MdPeople',
      color: '#10b981',
      trend: '2 new',
      trendUp: true
    },
    {
      id: 'revenue',
      title: 'Revenue',
      value: '€12,450',
      subtitle: 'this month',
      icon: 'MdPayment',
      color: '#8b5cf6',
      trend: '+18%',
      trendUp: true
    }
  ],

  // Activity feed data
  activities: [
    {
      id: 1,
      type: 'booking',
      text: 'New booking from Jan de Vries',
      time: '5m ago',
      icon: 'MdCalendarToday',
      color: '#3b82f6'
    },
    {
      id: 2,
      type: 'payment',
      text: 'Invoice #452 paid by Anna',
      time: '1h ago',
      icon: 'MdPayment',
      color: '#10b981'
    },
    {
      id: 3,
      type: 'feedback',
      text: 'New 5⭐ rating from Emma',
      time: '3h ago',
      icon: 'MdStar',
      color: '#f59e0b'
    },
    {
      id: 4,
      type: 'job',
      text: 'Job #J-2024-015 completed',
      time: '4h ago',
      icon: 'MdWork',
      color: '#8b5cf6'
    },
    {
      id: 5,
      type: 'staff',
      text: 'Maria clocked in for shift',
      time: '6h ago',
      icon: 'MdPeople',
      color: '#06b6d4'
    },
    {
      id: 6,
      type: 'booking',
      text: 'Booking rescheduled by John',
      time: '8h ago',
      icon: 'MdCalendarToday',
      color: '#ef4444'
    }
  ],

  // Quick actions data
  quickActions: [
    {
      id: 'new-booking',
      title: 'New Booking',
      description: 'Create a new cleaning service booking',
      icon: 'MdAdd',
      color: '#3b82f6',
      href: '/bookings/new'
    },
    {
      id: 'assign-job',
      title: 'Assign Job',
      description: 'Assign pending jobs to staff members',
      icon: 'MdWork',
      color: '#10b981',
      href: '/jobs/assign'
    },
    {
      id: 'view-analytics',
      title: 'View Analytics',
      description: 'Check business performance metrics',
      icon: 'MdAnalytics',
      color: '#8b5cf6',
      href: '/analytics'
    }
  ],

  // Recent bookings summary
  recentBookings: [
    {
      id: 'BK-2024-001',
      client: 'Jan de Vries',
      service: 'Office Cleaning',
      date: 'Today, 14:00',
      status: 'confirmed',
      amount: '€85'
    },
    {
      id: 'BK-2024-002',
      client: 'Anna Schmidt',
      service: 'Deep Clean',
      date: 'Tomorrow, 09:00',
      status: 'pending',
      amount: '€150'
    },
    {
      id: 'BK-2024-003',
      client: 'Emma Johnson',
      service: 'Regular Cleaning',
      date: 'Tomorrow, 16:00',
      status: 'confirmed',
      amount: '€65'
    }
  ],

  // Staff status
  staffStatus: [
    {
      id: 1,
      name: 'Maria Garcia',
      status: 'online',
      currentJob: 'Office Clean - Amsterdam',
      avatar: 'M'
    },
    {
      id: 2,
      name: 'John Smith',
      status: 'online',
      currentJob: 'Deep Clean - Rotterdam',
      avatar: 'J'
    },
    {
      id: 3,
      name: 'Sarah Wilson',
      status: 'offline',
      currentJob: null,
      avatar: 'S'
    }
  ],

  // Performance metrics
  performanceMetrics: {
    completionRate: 94,
    customerSatisfaction: 4.8,
    averageResponseTime: '2.5h',
    monthlyGrowth: 18
  }
};

export default dashboardStats;

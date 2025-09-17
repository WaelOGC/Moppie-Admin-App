import api from './config';

// Backend API endpoints for Jobs Management
export const getJobs = (params) => api.get("/jobs/", { params });
export const getJobDetails = (id) => api.get(`/jobs/${id}/details/`);
export const getJobMedia = (id) => api.get(`/jobs/${id}/media/`);
export const assignEmployees = (id, data) =>
  api.post(`/jobs/${id}/assign-employees/`, data);
export const checkConflicts = (id, params) =>
  api.get(`/jobs/${id}/conflicts/`, { params });

// Additional job management endpoints
export const updateJobStatus = (id, status, note = '', updatedBy = 'Admin') =>
  api.post(`/jobs/${id}/update-status/`, { status, note, updatedBy });

export const uploadJobMedia = (id, file, type = 'before') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  return api.post(`/jobs/${id}/media/upload/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getJobsForCalendar = (startDate, endDate, additionalFilters = {}) =>
  api.get("/jobs/calendar/", { 
    params: { 
      start_date: startDate, 
      end_date: endDate,
      ...additionalFilters
    } 
  });

export const createJob = (jobData) => api.post("/jobs/", jobData);

export const cancelJob = (id, reason = '') =>
  api.post(`/jobs/${id}/cancel/`, { reason });

export const addJobNote = (id, noteText, author = 'Admin') =>
  api.post(`/jobs/${id}/notes/`, { text: noteText, author });

export const updateJob = (id, updates) => api.patch(`/jobs/${id}/`, updates);

// Legacy API functions for backward compatibility during transition
const mockJobsData = [
  {
    id: 1,
    jobId: 'JOB-001',
    customer: {
      name: 'Anna Johnson',
      phone: '+31 6 1234 5678',
      email: 'anna.johnson@email.com',
      address: 'Keizersgracht 123, 1015 CJ Amsterdam'
    },
    assignedStaff: {
      id: 1,
      name: 'Maria Garcia',
      role: 'Supervisor',
      avatar: null,
      phone: '+31 6 1234 5678'
    },
    bookingInfo: {
      date: '2024-01-16',
      time: '09:00',
      duration: 3,
      serviceType: 'Deep Cleaning',
      estimatedPrice: 120.00
    },
    status: 'in_progress',
    priority: 'normal',
    description: 'Deep cleaning of 3-bedroom apartment including kitchen, bathrooms, and living areas',
    services: ['Kitchen Cleaning', 'Bathroom Sanitization', 'Floor Mopping'],
    statusLogs: [
      {
        id: 1,
        status: 'pending',
        timestamp: '2024-01-15T14:30:00Z',
        updatedBy: 'Admin',
        note: 'Job created and assigned to Maria Garcia'
      },
      {
        id: 2,
        status: 'in_progress',
        timestamp: '2024-01-16T09:00:00Z',
        updatedBy: 'Maria Garcia',
        note: 'Started cleaning at scheduled time'
      }
    ],
    media: {
      before: [],
      after: []
    },
    notes: [
      {
        id: 1,
        text: 'Customer requested extra attention to kitchen appliances',
        timestamp: '2024-01-15T16:45:00Z',
        author: 'Admin'
      }
    ],
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-01-16T09:00:00Z'
  },
  {
    id: 2,
    jobId: 'JOB-002',
    customer: {
      name: 'Jan de Vries',
      phone: '+31 6 2345 6789',
      email: 'jan.devries@email.com',
      address: 'Prinsengracht 456, 1016 GC Amsterdam'
    },
    assignedStaff: {
      id: 2,
      name: 'John Smith',
      role: 'Cleaner',
      avatar: null,
      phone: '+31 6 2345 6789'
    },
    bookingInfo: {
      date: '2024-01-17',
      time: '08:00',
      duration: 2,
      serviceType: 'Regular Cleaning',
      estimatedPrice: 85.00
    },
    status: 'pending',
    priority: 'urgent',
    description: 'Regular cleaning of 2-bedroom apartment with focus on kitchen and bathroom',
    services: ['Kitchen Cleaning', 'Bathroom Cleaning', 'Vacuuming'],
    statusLogs: [
      {
        id: 3,
        status: 'pending',
        timestamp: '2024-01-15T10:15:00Z',
        updatedBy: 'Admin',
        note: 'Urgent job created - customer requested ASAP'
      }
    ],
    media: {
      before: [],
      after: []
    },
    notes: [],
    createdAt: '2024-01-15T10:15:00Z',
    updatedAt: '2024-01-15T10:15:00Z'
  },
  {
    id: 3,
    jobId: 'JOB-003',
    customer: {
      name: 'Emma van der Berg',
      phone: '+31 6 3456 7890',
      email: 'emma.vandenberg@email.com',
      address: 'Herengracht 789, 1017 BX Amsterdam'
    },
    assignedStaff: {
      id: 1,
      name: 'Maria Garcia',
      role: 'Supervisor',
      avatar: null,
      phone: '+31 6 1234 5678'
    },
    bookingInfo: {
      date: '2024-01-16',
      time: '14:00',
      duration: 4,
      serviceType: 'Window Cleaning',
      estimatedPrice: 95.00
    },
    status: 'completed',
    priority: 'normal',
    description: 'Window cleaning for 4-story townhouse including exterior windows',
    services: ['Window Cleaning', 'Window Frame Cleaning', 'Sill Cleaning'],
    statusLogs: [
      {
        id: 4,
        status: 'pending',
        timestamp: '2024-01-14T09:00:00Z',
        updatedBy: 'Admin',
        note: 'Window cleaning job scheduled'
      },
      {
        id: 5,
        status: 'in_progress',
        timestamp: '2024-01-16T14:00:00Z',
        updatedBy: 'Maria Garcia',
        note: 'Started window cleaning'
      },
      {
        id: 6,
        status: 'completed',
        timestamp: '2024-01-16T18:00:00Z',
        updatedBy: 'Maria Garcia',
        note: 'Completed all windows and frames'
      }
    ],
    media: {
      before: [
        {
          id: 1,
          fileName: 'before_windows_1.jpg',
          uploadedAt: '2024-01-16T14:00:00Z'
        }
      ],
      after: [
        {
          id: 2,
          fileName: 'after_windows_1.jpg',
          uploadedAt: '2024-01-16T18:00:00Z'
        }
      ]
    },
    notes: [
      {
        id: 2,
        text: 'Used eco-friendly cleaning products as requested',
        timestamp: '2024-01-16T18:15:00Z',
        author: 'Maria Garcia'
      }
    ],
    createdAt: '2024-01-14T09:00:00Z',
    updatedAt: '2024-01-16T18:00:00Z'
  },
  {
    id: 4,
    jobId: 'JOB-004',
    customer: {
      name: 'Peter Bakker',
      phone: '+31 6 4567 8901',
      email: 'peter.bakker@email.com',
      address: 'Singel 321, 1012 WP Amsterdam'
    },
    assignedStaff: {
      id: 2,
      name: 'John Smith',
      role: 'Cleaner',
      avatar: null,
      phone: '+31 6 2345 6789'
    },
    bookingInfo: {
      date: '2024-01-18',
      time: '10:00',
      duration: 2,
      serviceType: 'Deep Cleaning',
      estimatedPrice: 110.00
    },
    status: 'pending',
    priority: 'normal',
    description: 'Deep cleaning of studio apartment after renovation',
    services: ['Deep Kitchen Cleaning', 'Bathroom Sanitization', 'Floor Polishing'],
    statusLogs: [
      {
        id: 7,
        status: 'pending',
        timestamp: '2024-01-15T11:30:00Z',
        updatedBy: 'Admin',
        note: 'Post-renovation cleaning scheduled'
      }
    ],
    media: {
      before: [],
      after: []
    },
    notes: [],
    createdAt: '2024-01-15T11:30:00Z',
    updatedAt: '2024-01-15T11:30:00Z'
  },
  {
    id: 5,
    jobId: 'JOB-005',
    customer: {
      name: 'Lisa Chen',
      phone: '+31 6 5678 9012',
      email: 'lisa.chen@email.com',
      address: 'Rokin 654, 1012 KT Amsterdam'
    },
    assignedStaff: {
      id: 1,
      name: 'Maria Garcia',
      role: 'Supervisor',
      avatar: null,
      phone: '+31 6 1234 5678'
    },
    bookingInfo: {
      date: '2024-01-17',
      time: '16:00',
      duration: 3,
      serviceType: 'Regular Cleaning',
      estimatedPrice: 75.00
    },
    status: 'completed',
    priority: 'normal',
    description: 'Regular cleaning of 1-bedroom apartment',
    services: ['Kitchen Cleaning', 'Bathroom Cleaning', 'Living Area Cleaning'],
    statusLogs: [
      {
        id: 8,
        status: 'pending',
        timestamp: '2024-01-14T15:00:00Z',
        updatedBy: 'Admin',
        note: 'Regular cleaning job scheduled'
      },
      {
        id: 9,
        status: 'in_progress',
        timestamp: '2024-01-17T16:00:00Z',
        updatedBy: 'Maria Garcia',
        note: 'Started regular cleaning'
      },
      {
        id: 10,
        status: 'completed',
        timestamp: '2024-01-17T19:00:00Z',
        updatedBy: 'Maria Garcia',
        note: 'Completed all cleaning tasks'
      }
    ],
    media: {
      before: [],
      after: []
    },
    notes: [],
    createdAt: '2024-01-14T15:00:00Z',
    updatedAt: '2024-01-17T19:00:00Z'
  },
  {
    id: 6,
    jobId: 'JOB-006',
    customer: {
      name: 'Michael Brown',
      phone: '+31 6 6789 0123',
      email: 'michael.brown@email.com',
      address: 'Damrak 987, 1012 LP Amsterdam'
    },
    assignedStaff: {
      id: 2,
      name: 'John Smith',
      role: 'Cleaner',
      avatar: null,
      phone: '+31 6 2345 6789'
    },
    bookingInfo: {
      date: '2024-01-19',
      time: '09:30',
      duration: 4,
      serviceType: 'Deep Cleaning',
      estimatedPrice: 140.00
    },
    status: 'cancelled',
    priority: 'normal',
    description: 'Deep cleaning of 2-bedroom apartment',
    services: ['Deep Kitchen Cleaning', 'Bathroom Sanitization', 'Floor Mopping', 'Dusting'],
    statusLogs: [
      {
        id: 11,
        status: 'pending',
        timestamp: '2024-01-15T12:00:00Z',
        updatedBy: 'Admin',
        note: 'Deep cleaning job scheduled'
      },
      {
        id: 12,
        status: 'cancelled',
        timestamp: '2024-01-19T08:00:00Z',
        updatedBy: 'Admin',
        note: 'Cancelled due to customer emergency'
      }
    ],
    media: {
      before: [],
      after: []
    },
    notes: [
      {
        id: 3,
        text: 'Customer will reschedule for next week',
        timestamp: '2024-01-19T08:15:00Z',
        author: 'Admin'
      }
    ],
    createdAt: '2024-01-15T12:00:00Z',
    updatedAt: '2024-01-19T08:00:00Z'
  },
  {
    id: 7,
    jobId: 'JOB-007',
    customer: {
      name: 'Sophie van Dijk',
      phone: '+31 6 7890 1234',
      email: 'sophie.vandijk@email.com',
      address: 'Leidseplein 147, 1017 PS Amsterdam'
    },
    assignedStaff: {
      id: 1,
      name: 'Maria Garcia',
      role: 'Supervisor',
      avatar: null,
      phone: '+31 6 1234 5678'
    },
    bookingInfo: {
      date: '2024-01-20',
      time: '11:00',
      duration: 2,
      serviceType: 'Window Cleaning',
      estimatedPrice: 90.00
    },
    status: 'pending',
    priority: 'normal',
    description: 'Window cleaning for ground floor apartment',
    services: ['Window Cleaning', 'Window Frame Cleaning'],
    statusLogs: [
      {
        id: 13,
        status: 'pending',
        timestamp: '2024-01-16T10:00:00Z',
        updatedBy: 'Admin',
        note: 'Window cleaning job scheduled'
      }
    ],
    media: {
      before: [],
      after: []
    },
    notes: [],
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z'
  },
  {
    id: 8,
    jobId: 'JOB-008',
    customer: {
      name: 'David Wilson',
      phone: '+31 6 8901 2345',
      email: 'david.wilson@email.com',
      address: 'Vondelpark 258, 1071 AA Amsterdam'
    },
    assignedStaff: {
      id: 2,
      name: 'John Smith',
      role: 'Cleaner',
      avatar: null,
      phone: '+31 6 2345 6789'
    },
    bookingInfo: {
      date: '2024-01-18',
      time: '13:00',
      duration: 3,
      serviceType: 'Regular Cleaning',
      estimatedPrice: 80.00
    },
    status: 'in_progress',
    priority: 'normal',
    description: 'Regular cleaning of 1-bedroom apartment near Vondelpark',
    services: ['Kitchen Cleaning', 'Bathroom Cleaning', 'Vacuuming'],
    statusLogs: [
      {
        id: 14,
        status: 'pending',
        timestamp: '2024-01-16T14:30:00Z',
        updatedBy: 'Admin',
        note: 'Regular cleaning job scheduled'
      },
      {
        id: 15,
        status: 'in_progress',
        timestamp: '2024-01-18T13:00:00Z',
        updatedBy: 'John Smith',
        note: 'Started cleaning at scheduled time'
      }
    ],
    media: {
      before: [],
      after: []
    },
    notes: [],
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-18T13:00:00Z'
  },
  {
    id: 9,
    jobId: 'JOB-009',
    customer: {
      name: 'Sarah Johnson',
      phone: '+31 6 9012 3456',
      email: 'sarah.johnson@email.com',
      address: 'Jordaan 369, 1015 NJ Amsterdam'
    },
    assignedStaff: {
      id: 1,
      name: 'Maria Garcia',
      role: 'Supervisor',
      avatar: null,
      phone: '+31 6 1234 5678'
    },
    bookingInfo: {
      date: '2024-01-21',
      time: '08:30',
      duration: 4,
      serviceType: 'Deep Cleaning',
      estimatedPrice: 125.00
    },
    status: 'pending',
    priority: 'urgent',
    description: 'Deep cleaning of 2-bedroom apartment in Jordaan',
    services: ['Deep Kitchen Cleaning', 'Bathroom Sanitization', 'Floor Mopping', 'Dusting'],
    statusLogs: [
      {
        id: 16,
        status: 'pending',
        timestamp: '2024-01-17T09:00:00Z',
        updatedBy: 'Admin',
        note: 'Urgent deep cleaning job scheduled'
      }
    ],
    media: {
      before: [],
      after: []
    },
    notes: [],
    createdAt: '2024-01-17T09:00:00Z',
    updatedAt: '2024-01-17T09:00:00Z'
  },
  {
    id: 10,
    jobId: 'JOB-010',
    customer: {
      name: 'Tom Anderson',
      phone: '+31 6 0123 4567',
      email: 'tom.anderson@email.com',
      address: 'Oud-Zuid 741, 1071 AA Amsterdam'
    },
    assignedStaff: {
      id: 2,
      name: 'John Smith',
      role: 'Cleaner',
      avatar: null,
      phone: '+31 6 2345 6789'
    },
    bookingInfo: {
      date: '2024-01-19',
      time: '15:00',
      duration: 2,
      serviceType: 'Regular Cleaning',
      estimatedPrice: 85.00
    },
    status: 'completed',
    priority: 'normal',
    description: 'Regular cleaning of studio apartment',
    services: ['Kitchen Cleaning', 'Bathroom Cleaning', 'Vacuuming'],
    statusLogs: [
      {
        id: 17,
        status: 'pending',
        timestamp: '2024-01-17T11:00:00Z',
        updatedBy: 'Admin',
        note: 'Regular cleaning job scheduled'
      },
      {
        id: 18,
        status: 'in_progress',
        timestamp: '2024-01-19T15:00:00Z',
        updatedBy: 'John Smith',
        note: 'Started cleaning'
      },
      {
        id: 19,
        status: 'completed',
        timestamp: '2024-01-19T17:00:00Z',
        updatedBy: 'John Smith',
        note: 'Completed all cleaning tasks'
      }
    ],
    media: {
      before: [],
      after: []
    },
    notes: [],
    createdAt: '2024-01-17T11:00:00Z',
    updatedAt: '2024-01-19T17:00:00Z'
  },
  {
    id: 11,
    jobId: 'JOB-011',
    customer: {
      name: 'Jennifer Martinez',
      phone: '+31 6 1234 5679',
      email: 'jennifer.martinez@email.com',
      address: 'De Pijp 852, 1072 AB Amsterdam'
    },
    assignedStaff: {
      id: 1,
      name: 'Maria Garcia',
      role: 'Supervisor',
      avatar: null,
      phone: '+31 6 1234 5678'
    },
    bookingInfo: {
      date: '2024-01-22',
      time: '10:00',
      duration: 3,
      serviceType: 'Monthly Cleaning',
      estimatedPrice: 140.00
    },
    status: 'pending',
    priority: 'normal',
    description: 'Monthly deep cleaning of 3-bedroom apartment',
    services: ['Deep Kitchen Cleaning', 'Bathroom Sanitization', 'Floor Mopping', 'Dusting', 'Window Cleaning'],
    statusLogs: [
      {
        id: 20,
        status: 'pending',
        timestamp: '2024-01-18T08:00:00Z',
        updatedBy: 'Admin',
        note: 'Monthly cleaning job scheduled'
      }
    ],
    media: {
      before: [],
      after: []
    },
    notes: [],
    createdAt: '2024-01-18T08:00:00Z',
    updatedAt: '2024-01-18T08:00:00Z'
  },
  {
    id: 12,
    jobId: 'JOB-012',
    customer: {
      name: 'Christopher Lee',
      phone: '+31 6 2345 6780',
      email: 'christopher.lee@email.com',
      address: 'Nieuw-West 963, 1061 AA Amsterdam'
    },
    assignedStaff: {
      id: 2,
      name: 'John Smith',
      role: 'Cleaner',
      avatar: null,
      phone: '+31 6 2345 6789'
    },
    bookingInfo: {
      date: '2024-01-20',
      time: '12:00',
      duration: 2,
      serviceType: 'Commercial Cleaning',
      estimatedPrice: 450.00
    },
    status: 'pending',
    priority: 'normal',
    description: 'Commercial cleaning of small office space',
    services: ['Office Cleaning', 'Floor Mopping', 'Bathroom Sanitization', 'Trash Removal'],
    statusLogs: [
      {
        id: 21,
        status: 'pending',
        timestamp: '2024-01-18T14:00:00Z',
        updatedBy: 'Admin',
        note: 'Commercial cleaning job scheduled'
      }
    ],
    media: {
      before: [],
      after: []
    },
    notes: [],
    createdAt: '2024-01-18T14:00:00Z',
    updatedAt: '2024-01-18T14:00:00Z'
  }
];

// Legacy API functions for backward compatibility during transition
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const jobsAPI = {
  // Get all jobs with filtering - now uses backend API
  getJobsList: async (filters = {}) => {
    try {
      // Transform frontend filters to backend parameters
      const params = {
        status: filters.status !== 'all' ? filters.status : undefined,
        staff_id: filters.staff !== 'all' ? filters.staff : undefined,
        start_date: filters.dateFrom || undefined,
        end_date: filters.dateTo || undefined,
        search: filters.search || undefined,
        priority: filters.priority !== 'all' ? filters.priority : undefined,
        page: filters.page || 1,
        page_size: filters.page_size || 20
      };

      // Remove undefined values
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

      const response = await getJobs(params);
      
      return {
        success: true,
        data: response.data.results || response.data,
        total: response.data.count || response.data.length
      };
    } catch (error) {
      console.error('Error fetching jobs list:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch jobs list',
        data: []
      };
    }
  },

  // Get job by ID - now uses backend API
  getJobById: async (id) => {
    try {
      const response = await getJobDetails(id);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching job:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Job not found',
        data: null
      };
    }
  },

  // Update job status - now uses backend API
  updateJobStatus: async (id, status, note = '', updatedBy = 'Admin') => {
    try {
      const response = await updateJobStatus(id, status, note, updatedBy);
      
      return {
        success: true,
        data: response.data,
        message: `Job status updated to ${status}`
      };
    } catch (error) {
      console.error('Error updating job status:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update job status'
      };
    }
  },

  // Upload job media - now uses backend API
  uploadJobMedia: async (id, file, type = 'before') => {
    try {
      const response = await uploadJobMedia(id, file, type);
      
      return {
        success: true,
        data: response.data,
        message: 'Media uploaded successfully'
      };
    } catch (error) {
      console.error('Error uploading media:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to upload media'
      };
    }
  },

  // Get jobs for calendar view - now uses backend API
  getJobsForCalendar: async (startDate, endDate) => {
    try {
      const response = await getJobsForCalendar(startDate, endDate);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching calendar jobs:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch calendar jobs',
        data: {}
      };
    }
  },

  // Create new job - now uses backend API
  createJob: async (jobData) => {
    try {
      const response = await createJob(jobData);
      
      return {
        success: true,
        data: response.data,
        message: 'Job created successfully'
      };
    } catch (error) {
      console.error('Error creating job:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create job'
      };
    }
  },

  // Cancel job - now uses backend API
  cancelJob: async (id, reason = '') => {
    try {
      const response = await cancelJob(id, reason);
      
      return {
        success: true,
        data: response.data,
        message: 'Job cancelled successfully'
      };
    } catch (error) {
      console.error('Error cancelling job:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to cancel job'
      };
    }
  },

  // Add note to job - now uses backend API
  addJobNote: async (id, noteText, author = 'Admin') => {
    try {
      const response = await addJobNote(id, noteText, author);
      
      return {
        success: true,
        data: response.data,
        message: 'Note added successfully'
      };
    } catch (error) {
      console.error('Error adding job note:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add note'
      };
    }
  },

  // Update job details - now uses backend API
  updateJob: async (id, updates) => {
    try {
      const response = await updateJob(id, updates);
      
      return {
        success: true,
        data: response.data,
        message: 'Job updated successfully'
      };
    } catch (error) {
      console.error('Error updating job:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update job'
      };
    }
  },

  // New functions for employee assignment and conflict detection
  assignEmployees: async (id, employeeIds, assignmentNotes = '') => {
    try {
      const response = await assignEmployees(id, { 
        employee_ids: employeeIds, 
        assignment_notes: assignmentNotes 
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Employees assigned successfully'
      };
    } catch (error) {
      console.error('Error assigning employees:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to assign employees'
      };
    }
  },

  checkConflicts: async (id, startDatetime, endDatetime, employeeIds) => {
    try {
      const response = await checkConflicts(id, {
        start_datetime: startDatetime,
        end_datetime: endDatetime,
        employee_ids: employeeIds
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error checking conflicts:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to check conflicts'
      };
    }
  },

  getJobMedia: async (id) => {
    try {
      const response = await getJobMedia(id);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching job media:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch job media'
      };
    }
  }
};

export default jobsAPI;
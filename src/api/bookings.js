// Mock data for bookings
const mockBookings = [
  {
    id: 'BK001',
    customerName: 'John Smith',
    customerPhone: '+1 (555) 123-4567',
    customerEmail: 'john.smith@email.com',
    customerAddress: '123 Main St, Anytown, ST 12345',
    date: '2024-01-15',
    time: '10:00 AM',
    status: 'pending',
    notes: 'Regular cleaning service requested. Customer prefers eco-friendly products.',
    price: 150.00,
    duration: '2 hours',
    serviceType: 'House Cleaning',
    createdAt: '2024-01-10T08:30:00Z',
    photos: [
      { id: 1, url: '/api/placeholder/300/200', caption: 'Before cleaning' },
      { id: 2, url: '/api/placeholder/300/200', caption: 'After cleaning' }
    ],
    videos: [
      { id: 1, url: '/api/placeholder/video', caption: 'Cleaning process' }
    ]
  },
  {
    id: 'BK002',
    customerName: 'Sarah Johnson',
    customerPhone: '+1 (555) 234-5678',
    customerEmail: 'sarah.j@email.com',
    customerAddress: '456 Oak Ave, Springfield, ST 67890',
    date: '2024-01-16',
    time: '2:00 PM',
    status: 'approved',
    notes: 'Deep cleaning for move-out. Focus on kitchen and bathrooms.',
    price: 280.00,
    duration: '4 hours',
    serviceType: 'Deep Cleaning',
    createdAt: '2024-01-11T14:20:00Z',
    photos: [],
    videos: []
  },
  {
    id: 'BK003',
    customerName: 'Mike Wilson',
    customerPhone: '+1 (555) 345-6789',
    customerEmail: 'mike.wilson@email.com',
    customerAddress: '789 Pine St, Riverside, ST 54321',
    date: '2024-01-17',
    time: '9:00 AM',
    status: 'completed',
    notes: 'Weekly maintenance cleaning. Customer very satisfied.',
    price: 120.00,
    duration: '1.5 hours',
    serviceType: 'Maintenance Cleaning',
    createdAt: '2024-01-12T09:15:00Z',
    photos: [
      { id: 3, url: '/api/placeholder/300/200', caption: 'Completed work' }
    ],
    videos: []
  },
  {
    id: 'BK004',
    customerName: 'Emily Davis',
    customerPhone: '+1 (555) 456-7890',
    customerEmail: 'emily.davis@email.com',
    customerAddress: '321 Elm St, Lakeside, ST 98765',
    date: '2024-01-18',
    time: '11:30 AM',
    status: 'cancelled',
    notes: 'Customer cancelled due to schedule conflict.',
    price: 200.00,
    duration: '3 hours',
    serviceType: 'Office Cleaning',
    createdAt: '2024-01-13T11:45:00Z',
    photos: [],
    videos: []
  },
  {
    id: 'BK005',
    customerName: 'David Brown',
    customerPhone: '+1 (555) 567-8901',
    customerEmail: 'david.brown@email.com',
    customerAddress: '654 Maple Dr, Hilltop, ST 13579',
    date: '2024-01-19',
    time: '3:00 PM',
    status: 'pending',
    notes: 'First-time customer. Special request for pet-safe products.',
    price: 175.00,
    duration: '2.5 hours',
    serviceType: 'Pet-Friendly Cleaning',
    createdAt: '2024-01-14T16:30:00Z',
    photos: [],
    videos: []
  },
  {
    id: 'BK006',
    customerName: 'Lisa Anderson',
    customerPhone: '+1 (555) 678-9012',
    customerEmail: 'lisa.anderson@email.com',
    customerAddress: '987 Cedar Ln, Valley View, ST 24680',
    date: '2024-01-20',
    time: '8:00 AM',
    status: 'approved',
    notes: 'Post-renovation cleanup. Heavy dust and debris expected.',
    price: 350.00,
    duration: '5 hours',
    serviceType: 'Post-Renovation Cleaning',
    createdAt: '2024-01-15T10:20:00Z',
    photos: [],
    videos: []
  },
  {
    id: 'BK007',
    customerName: 'Robert Taylor',
    customerPhone: '+1 (555) 789-0123',
    customerEmail: 'robert.taylor@email.com',
    customerAddress: '147 Birch St, Mountain View, ST 97531',
    date: '2024-01-21',
    time: '1:00 PM',
    status: 'completed',
    notes: 'Excellent service. Customer left 5-star review.',
    price: 160.00,
    duration: '2 hours',
    serviceType: 'House Cleaning',
    createdAt: '2024-01-16T13:45:00Z',
    photos: [
      { id: 4, url: '/api/placeholder/300/200', caption: 'Clean kitchen' },
      { id: 5, url: '/api/placeholder/300/200', caption: 'Clean bathroom' }
    ],
    videos: []
  },
  {
    id: 'BK008',
    customerName: 'Jennifer Martinez',
    customerPhone: '+1 (555) 890-1234',
    customerEmail: 'jennifer.martinez@email.com',
    customerAddress: '258 Spruce Ave, Garden City, ST 86420',
    date: '2024-01-22',
    time: '10:30 AM',
    status: 'pending',
    notes: 'Recurring monthly service. Customer prefers morning appointments.',
    price: 140.00,
    duration: '2 hours',
    serviceType: 'Monthly Cleaning',
    createdAt: '2024-01-17T15:10:00Z',
    photos: [],
    videos: []
  },
  {
    id: 'BK009',
    customerName: 'Christopher Lee',
    customerPhone: '+1 (555) 901-2345',
    customerEmail: 'chris.lee@email.com',
    customerAddress: '369 Willow Way, Sunset Hills, ST 75319',
    date: '2024-01-23',
    time: '4:00 PM',
    status: 'approved',
    notes: 'Commercial office space. Need security clearance.',
    price: 450.00,
    duration: '6 hours',
    serviceType: 'Commercial Cleaning',
    createdAt: '2024-01-18T12:00:00Z',
    photos: [],
    videos: []
  },
  {
    id: 'BK010',
    customerName: 'Amanda White',
    customerPhone: '+1 (555) 012-3456',
    customerEmail: 'amanda.white@email.com',
    customerAddress: '741 Poplar Blvd, Sunrise Valley, ST 64208',
    date: '2024-01-24',
    time: '9:30 AM',
    status: 'completed',
    notes: 'Move-in cleaning completed successfully.',
    price: 220.00,
    duration: '3 hours',
    serviceType: 'Move-In Cleaning',
    createdAt: '2024-01-19T08:45:00Z',
    photos: [
      { id: 6, url: '/api/placeholder/300/200', caption: 'Move-in complete' }
    ],
    videos: [
      { id: 2, url: '/api/placeholder/video', caption: 'Final walkthrough' }
    ]
  },
  {
    id: 'BK011',
    customerName: 'Michael Garcia',
    customerPhone: '+1 (555) 123-4567',
    customerEmail: 'michael.garcia@email.com',
    customerAddress: '852 Ash St, Greenfield, ST 53197',
    date: '2024-01-25',
    time: '2:30 PM',
    status: 'pending',
    notes: 'New customer referral. Special discount applied.',
    price: 110.00,
    duration: '1.5 hours',
    serviceType: 'House Cleaning',
    createdAt: '2024-01-20T14:30:00Z',
    photos: [],
    videos: []
  },
  {
    id: 'BK012',
    customerName: 'Jessica Thompson',
    customerPhone: '+1 (555) 234-5678',
    customerEmail: 'jessica.thompson@email.com',
    customerAddress: '963 Hickory Rd, Brookside, ST 42086',
    date: '2024-01-26',
    time: '11:00 AM',
    status: 'cancelled',
    notes: 'Customer rescheduled for next week.',
    price: 180.00,
    duration: '2.5 hours',
    serviceType: 'Deep Cleaning',
    createdAt: '2024-01-21T11:20:00Z',
    photos: [],
    videos: []
  },
  {
    id: 'BK013',
    customerName: 'Daniel Rodriguez',
    customerPhone: '+1 (555) 345-6789',
    customerEmail: 'daniel.rodriguez@email.com',
    customerAddress: '159 Cherry Ln, Riverside, ST 31975',
    date: '2024-01-27',
    time: '7:00 AM',
    status: 'approved',
    notes: 'Early morning service requested. Customer works night shift.',
    price: 190.00,
    duration: '2.5 hours',
    serviceType: 'House Cleaning',
    createdAt: '2024-01-22T16:45:00Z',
    photos: [],
    videos: []
  },
  {
    id: 'BK014',
    customerName: 'Ashley Wilson',
    customerPhone: '+1 (555) 456-7890',
    customerEmail: 'ashley.wilson@email.com',
    customerAddress: '357 Dogwood Dr, Meadowbrook, ST 20864',
    date: '2024-01-28',
    time: '12:00 PM',
    status: 'completed',
    notes: 'Regular bi-weekly service. Customer very happy with results.',
    price: 130.00,
    duration: '2 hours',
    serviceType: 'Bi-Weekly Cleaning',
    createdAt: '2024-01-23T09:30:00Z',
    photos: [],
    videos: []
  },
  {
    id: 'BK015',
    customerName: 'Kevin Moore',
    customerPhone: '+1 (555) 567-8901',
    customerEmail: 'kevin.moore@email.com',
    customerAddress: '468 Sycamore St, Oakwood, ST 19753',
    date: '2024-01-29',
    time: '3:30 PM',
    status: 'pending',
    notes: 'Large home with multiple floors. Team cleaning required.',
    price: 320.00,
    duration: '4 hours',
    serviceType: 'Large Home Cleaning',
    createdAt: '2024-01-24T13:15:00Z',
    photos: [],
    videos: []
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const getBookings = async (filters = {}) => {
  await delay(500); // Simulate network delay
  
  let filteredBookings = [...mockBookings];
  
  // Apply filters
  if (filters.status && filters.status !== 'all') {
    filteredBookings = filteredBookings.filter(booking => booking.status === filters.status);
  }
  
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredBookings = filteredBookings.filter(booking => 
      booking.customerName.toLowerCase().includes(searchTerm) ||
      booking.id.toLowerCase().includes(searchTerm) ||
      booking.customerEmail.toLowerCase().includes(searchTerm)
    );
  }
  
  if (filters.dateFrom) {
    filteredBookings = filteredBookings.filter(booking => booking.date >= filters.dateFrom);
  }
  
  if (filters.dateTo) {
    filteredBookings = filteredBookings.filter(booking => booking.date <= filters.dateTo);
  }
  
  // Sort by date (newest first)
  filteredBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  return {
    success: true,
    data: filteredBookings,
    total: filteredBookings.length
  };
};

export const getBookingById = async (id) => {
  await delay(300);
  
  const booking = mockBookings.find(b => b.id === id);
  
  if (!booking) {
    return {
      success: false,
      error: 'Booking not found'
    };
  }
  
  return {
    success: true,
    data: booking
  };
};

export const updateBookingStatus = async (id, status) => {
  await delay(400);
  
  const bookingIndex = mockBookings.findIndex(b => b.id === id);
  
  if (bookingIndex === -1) {
    return {
      success: false,
      error: 'Booking not found'
    };
  }
  
  // Update the booking status
  mockBookings[bookingIndex].status = status;
  mockBookings[bookingIndex].updatedAt = new Date().toISOString();
  
  return {
    success: true,
    data: mockBookings[bookingIndex]
  };
};

export const deleteBooking = async (id) => {
  await delay(400);
  
  const bookingIndex = mockBookings.findIndex(b => b.id === id);
  
  if (bookingIndex === -1) {
    return {
      success: false,
      error: 'Booking not found'
    };
  }
  
  // Remove the booking
  const deletedBooking = mockBookings.splice(bookingIndex, 1)[0];
  
  return {
    success: true,
    data: deletedBooking
  };
};

export const getBookingsForCalendar = async (month, year) => {
  await delay(300);
  
  // Filter bookings for the specified month/year
  const filteredBookings = mockBookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    return bookingDate.getMonth() === month - 1 && bookingDate.getFullYear() === year;
  });
  
  return {
    success: true,
    data: filteredBookings
  };
};

// Mock error function for testing error states
export const mockError = async () => {
  await delay(500);
  throw new Error('Error loading bookings (mock)');
};

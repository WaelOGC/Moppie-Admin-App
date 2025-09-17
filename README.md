# Moppie Admin Dashboard

A comprehensive React-based admin dashboard for managing cleaning services business operations.

## Features

- **Dashboard**: Overview of business metrics and KPIs
- **Bookings**: Calendar view and booking management
- **Staff**: Employee management and scheduling
- **Jobs**: Job assignment and conflict resolution
- **Media**: Job media review and management
- **Payments**: Estimates, invoices, and payment processing
- **Analytics**: Business insights and reporting
- **Inventory**: Stock management and supplies tracking
- **Notifications**: Real-time alerts and messaging
- **Settings**: System configuration and user preferences

## Tech Stack

- **Frontend**: React 18, React Router DOM
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Project Structure

```
moppie-admin/
├── public/                   # Static assets
│   ├── index.html            # Root HTML template
│   ├── favicon.ico
│   └── assets/               # Logos, icons, static images
│
├── src/
│   ├── api/                  # API integration (per module)
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   ├── employees.js
│   │   ├── clients.js
│   │   ├── payments.js
│   │   ├── inventory.js
│   │   ├── analytics.js
│   │   ├── notifications.js
│   │   └── index.js
│   │
│   ├── components/           # Reusable UI components
│   │   ├── common/           # Buttons, Inputs, Modals, Toasts
│   │   ├── layout/           # Sidebar, Topbar, Footer
│   │   ├── dashboard/        # Dashboard widgets
│   │   └── tables/           # DataTables, Pagination, Filters
│   │
│   ├── pages/                # Main application pages
│   │   ├── Auth/             # Login, 2FA, Forgot Password
│   │   ├── Dashboard/        # Overview page
│   │   ├── Bookings/         # Calendar + List
│   │   ├── Staff/            # Employee Management
│   │   ├── Jobs/             # Job assignment, details, conflicts
│   │   ├── Media/            # Job media review
│   │   ├── Payments/         # Estimates, invoices
│   │   ├── Analytics/        # KPIs, reports
│   │   ├── Inventory/        # Stock management
│   │   ├── Notifications/    # Notification center
│   │   └── Settings/         # Roles, profiles, system settings
│   │
│   ├── context/              # React Context (Auth, Theme, Notifications)
│   ├── hooks/                # Custom hooks (useAuth, useFetch, useDarkMode)
│   ├── styles/               # Global CSS, variables, dark mode
│   ├── utils/                # Helpers (dateFormatter, validators, constants)
│   ├── App.js                # Root component with routes
│   ├── routes.js             # Central route definitions
│   └── index.js              # App entry point
│
├── .env.example              # Environment variables template
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd moppie-admin
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update environment variables in `.env`:
```env
# Backend API Configuration
REACT_APP_API_URL=http://localhost:8000/api

# Optional: For production deployment
# REACT_APP_API_URL=https://your-api-domain.com/api
```

5. Start the development server:
```bash
npm start
# or
yarn start
```

6. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Features Overview

### Authentication
- Secure login with email/password
- Two-factor authentication support
- Password reset functionality
- JWT token management

### Dashboard
- Real-time business metrics
- Quick action buttons
- Recent activity feed
- Upcoming tasks and appointments

### Staff Management
- Employee directory
- Role-based access control
- Performance tracking
- Schedule management

### Job Management
- Job creation and assignment
- Status tracking
- Conflict detection
- Media attachment support

### Payment Processing
- Invoice generation
- Payment tracking
- Estimate creation
- Financial reporting

### Analytics & Reporting
- Business KPIs
- Revenue analytics
- Employee performance metrics
- Custom report generation

## API Integration

The application is designed to work with a RESTful API backend. All API calls are centralized in the `src/api/` directory with separate modules for each feature area.

### API Structure
- **Base URL**: Configurable via `REACT_APP_API_URL` environment variable (defaults to `http://localhost:8000/api`)
- **Authentication**: JWT token-based with automatic token refresh
- **Request Interceptors**: Automatic Bearer token attachment to all authenticated requests
- **Error Handling**: Centralized error handling with automatic token refresh on 401 errors

### Authentication Flow
1. **Login**: POST `/auth/login/` with email/password
2. **Register**: POST `/auth/register/` with user data
3. **Profile**: GET `/auth/profile/` to fetch user data
4. **Logout**: POST `/auth/logout/` to invalidate tokens
5. **Token Refresh**: Automatic refresh using refresh token
6. **Route Protection**: All protected routes require valid JWT token

## Styling

The application uses Tailwind CSS with a custom design system:

- **Colors**: Primary and secondary color palettes
- **Components**: Pre-built component classes
- **Dark Mode**: Automatic dark/light theme switching
- **Responsive**: Mobile-first responsive design

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

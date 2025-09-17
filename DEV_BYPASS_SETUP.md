# Development Authentication Bypass Setup

## Overview
This setup allows you to bypass authentication during local development and automatically log in as an admin user.

## Setup Instructions

### 1. Create Environment File
Create a `.env.local` file in your project root with the following content:

```bash
# TEMPORARY ADMIN BYPASS FOR LOCAL DEVELOPMENT
# Set this to 'true' to bypass authentication and automatically log in as admin
# TODO: Remove this before production deployment
REACT_APP_BYPASS_AUTH=true

# API Configuration
REACT_APP_API_URL=http://localhost:8000/api
```

### 2. Restart Development Server
After creating the `.env.local` file, restart your development server:

```bash
npm start
```

## How It Works

### Authentication Bypass
- When `REACT_APP_BYPASS_AUTH=true` and `NODE_ENV=development`, the app automatically logs you in as an admin user
- No login form is shown - you're redirected directly to the dashboard
- The bypass creates a fake admin user with the following details:
  - **Email**: admin@moppie.nl
  - **Role**: admin
  - **Status**: verified and active

### Bypass Locations
The bypass is implemented in two places in `src/context/AuthContext.js`:

1. **App Initialization** (`useEffect` in `AuthProvider`):
   - Automatically sets up the fake admin session on app start
   - Skips token validation and API calls

2. **Login Function** (`loginUser`):
   - Bypasses the actual login API call
   - Returns success immediately with fake admin data

### Console Logging
When the bypass is active, you'll see this message in the browser console:
```
🚀 DEV MODE: Bypassing authentication for local development
```

## Disabling the Bypass

### Option 1: Environment Variable
Set `REACT_APP_BYPASS_AUTH=false` in your `.env.local` file:

```bash
REACT_APP_BYPASS_AUTH=false
```

### Option 2: Remove Environment Variable
Delete the `REACT_APP_BYPASS_AUTH` line from your `.env.local` file entirely.

### Option 3: Production Mode
The bypass only works in development mode (`NODE_ENV=development`), so it's automatically disabled in production builds.

## Security Notes

⚠️ **IMPORTANT**: This bypass is for development only and should never be used in production.

- The bypass only works when `NODE_ENV=development`
- It's controlled by an environment variable that can be easily disabled
- All bypass code is clearly marked with `TODO: Remove this before production deployment`
- The fake tokens (`dev-bypass-token`) are clearly identifiable

## Testing the Bypass

1. **Enable the bypass** by setting `REACT_APP_BYPASS_AUTH=true`
2. **Start the development server** with `npm start`
3. **Open the app** in your browser
4. **Verify** that you're automatically logged in as admin and redirected to the dashboard
5. **Check the console** for the bypass confirmation message

## Troubleshooting

### Bypass Not Working
- Ensure `.env.local` file exists in the project root
- Verify `REACT_APP_BYPASS_AUTH=true` is set
- Restart the development server after making changes
- Check browser console for bypass confirmation message

### Still Seeing Login Form
- Clear browser cache and localStorage
- Restart the development server
- Verify the environment variable is correctly set

### API Calls Failing
- The bypass only affects authentication, not API calls
- Ensure your backend server is running on the configured URL
- Check that `REACT_APP_API_URL` is correctly set

## Production Deployment

Before deploying to production:

1. **Remove or disable** the bypass by setting `REACT_APP_BYPASS_AUTH=false`
2. **Test** that normal authentication works
3. **Remove** the `.env.local` file or ensure it doesn't contain the bypass flag
4. **Verify** that the app requires proper login in production

---

**Status**: ✅ Ready for Development
This bypass allows immediate access to the Admin App for UI/UX inspection and data binding testing without requiring backend authentication.

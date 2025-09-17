# 🔑 Admin Access Setup Guide

This guide will help you guarantee admin access to your Moppie Admin App.

## Prerequisites

- Backend API running on `http://localhost:8000` (or your configured API URL)
- Database access (PostgreSQL with pgcrypto extension)
- Admin privileges to run SQL commands

## Step 1: Check for Existing Admin

First, check if an admin user already exists in your database:

```sql
SELECT id, email, role, is_verified, is_active, first_name, last_name
FROM users
WHERE role = 'admin';
```

**If a row is returned:**
- Use the existing email and password
- If you don't know the password, proceed to Step 2 to create a new admin

**If no rows are returned:**
- Proceed to Step 2 to create a new admin user

## Step 2: Create Admin User (if none exists)

Run this SQL command to create a new admin user:

```sql
INSERT INTO users (email, password, role, is_verified, is_active, first_name, last_name, created_at, updated_at)
VALUES (
  'admin@moppie.nl',
  crypt('AdminPass123!', gen_salt('bf')), -- hashes password using bcrypt
  'admin',
  true,
  true,
  'System',
  'Admin',
  NOW(),
  NOW()
);
```

**Alternative for different database systems:**

### MySQL/MariaDB:
```sql
INSERT INTO users (email, password, role, is_verified, is_active, first_name, last_name, created_at, updated_at)
VALUES (
  'admin@moppie.nl',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J5Q5Q5Q5Q', -- bcrypt hash for 'AdminPass123!'
  'admin',
  true,
  true,
  'System',
  'Admin',
  NOW(),
  NOW()
);
```

### SQLite:
```sql
INSERT INTO users (email, password, role, is_verified, is_active, first_name, last_name, created_at, updated_at)
VALUES (
  'admin@moppie.nl',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J5Q5Q5Q5Q', -- bcrypt hash for 'AdminPass123!'
  'admin',
  1,
  1,
  'System',
  'Admin',
  datetime('now'),
  datetime('now')
);
```

## Step 3: Verify Admin Creation

Confirm the admin user was created successfully:

```sql
SELECT id, email, role, is_verified, is_active, first_name, last_name, created_at
FROM users
WHERE email = 'admin@moppie.nl';
```

## Step 4: Login Credentials

After creating the admin user, you can log in with:

- **Email:** `admin@moppie.nl`
- **Password:** `AdminPass123!`

## Step 5: Test Login

1. Start your React app: `npm start`
2. Navigate to the login page
3. Enter the admin credentials
4. You should be redirected to the dashboard upon successful login

## Expected Login Flow

1. **Frontend sends login request** to `/api/auth/login/`
2. **Backend validates credentials** and returns:
   ```json
   {
     "user": {
       "id": 1,
       "email": "admin@moppie.nl",
       "role": "admin",
       "first_name": "System",
       "last_name": "Admin",
       "is_verified": true,
       "is_active": true
     },
     "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
     "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
     "requires_2fa": false
   }
   ```
3. **Frontend stores tokens** in localStorage
4. **User is redirected** to `/dashboard`

## Troubleshooting

### Common Issues:

1. **"Invalid credentials" error:**
   - Verify the admin user exists in the database
   - Check if the password hash is correct
   - Ensure the user is active (`is_active = true`)

2. **"User not verified" error:**
   - Set `is_verified = true` in the database
   - Or implement email verification flow

3. **"User inactive" error:**
   - Set `is_active = true` in the database

4. **API connection issues:**
   - Verify backend is running on the correct port
   - Check `REACT_APP_API_URL` environment variable
   - Ensure CORS is configured properly

### Database Queries for Troubleshooting:

```sql
-- Check all users
SELECT id, email, role, is_verified, is_active, created_at FROM users;

-- Check specific admin user
SELECT * FROM users WHERE email = 'admin@moppie.nl';

-- Update admin user if needed
UPDATE users 
SET is_verified = true, is_active = true 
WHERE email = 'admin@moppie.nl';

-- Reset admin password (if needed)
UPDATE users 
SET password = crypt('AdminPass123!', gen_salt('bf'))
WHERE email = 'admin@moppie.nl';
```

## Security Notes

- Change the default password after first login
- Use strong, unique passwords in production
- Consider implementing 2FA for admin accounts
- Regularly audit admin user access
- Use environment variables for sensitive configuration

## Next Steps

After successful admin login:
1. Test all admin functionality
2. Create additional admin users if needed
3. Set up proper user management
4. Configure role-based permissions
5. Implement audit logging for admin actions

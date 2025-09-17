/**
 * Mock Backend Server for Moppie Admin App
 * 
 * This is a simple Express.js server that provides mock API endpoints
 * for testing the admin login functionality.
 * 
 * Usage: node mock-backend.js
 */

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8000;
const JWT_SECRET = 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Mock database - In a real app, this would be a database
const users = [
  {
    id: 1,
    email: 'admin@moppie.nl',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: AdminPass123!
    role: 'admin',
    first_name: 'System',
    last_name: 'Admin',
    is_verified: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Helper function to generate JWT tokens
function generateTokens(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };
  
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  
  return { accessToken, refreshToken };
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Mock backend server is running',
    timestamp: new Date().toISOString()
  });
});

// Authentication endpoints
app.post('/api/auth/login/', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log(`🔐 Login attempt for: ${email}`);
    
    // Validate input
    if (!email || !password) {
      return res.status(422).json({
        message: 'Email and password are required'
      });
    }
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }
    
    // Check if user is active
    if (!user.is_active) {
      console.log(`❌ User inactive: ${email}`);
      return res.status(401).json({
        message: 'Account is inactive'
      });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log(`❌ Invalid password for: ${email}`);
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);
    
    console.log(`✅ Login successful for: ${email} (${user.role})`);
    
    // Return success response
    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        is_verified: user.is_verified,
        is_active: user.is_active
      },
      access_token: accessToken,
      refresh_token: refreshToken,
      requires_2fa: false
    });
    
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Profile endpoint
app.get('/api/auth/profile/', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Authorization token required'
      });
    }
    
    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = users.find(u => u.id === decoded.id);
      
      if (!user) {
        return res.status(401).json({
          message: 'User not found'
        });
      }
      
      res.json({
        id: user.id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        is_verified: user.is_verified,
        is_active: user.is_active
      });
      
    } catch (jwtError) {
      return res.status(401).json({
        message: 'Invalid token'
      });
    }
    
  } catch (error) {
    console.error('❌ Profile error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Register endpoint (for testing)
app.post('/api/auth/register/', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    console.log(`📝 Registration attempt for: ${email}`);
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      role: 'user',
      first_name: name || 'User',
      last_name: '',
      is_verified: false,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    users.push(newUser);
    
    console.log(`✅ User registered: ${email}`);
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      }
    });
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Logout endpoint
app.post('/api/auth/logout/', (req, res) => {
  console.log('🚪 Logout request');
  res.json({ message: 'Logged out successfully' });
});

// Refresh token endpoint
app.post('/api/auth/refresh/', (req, res) => {
  try {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
      return res.status(401).json({
        message: 'Refresh token required'
      });
    }
    
    try {
      const decoded = jwt.verify(refresh_token, JWT_SECRET);
      const user = users.find(u => u.id === decoded.id);
      
      if (!user) {
        return res.status(401).json({
          message: 'User not found'
        });
      }
      
      const { accessToken, refreshToken } = generateTokens(user);
      
      res.json({
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name,
          is_verified: user.is_verified,
          is_active: user.is_active
        }
      });
      
    } catch (jwtError) {
      return res.status(401).json({
        message: 'Invalid refresh token'
      });
    }
    
  } catch (error) {
    console.error('❌ Refresh error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Mock jobs endpoints (basic structure)
app.get('/api/jobs/', (req, res) => {
  res.json({
    count: 0,
    next: null,
    previous: null,
    results: []
  });
});

// Mock media endpoints (basic structure)
app.get('/api/media/', (req, res) => {
  res.json({
    count: 0,
    results: []
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Mock Backend Server Started!');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log('');
  console.log('👤 Admin Credentials:');
  console.log('   Email: admin@moppie.nl');
  console.log('   Password: AdminPass123!');
  console.log('');
  console.log('🔧 Available Endpoints:');
  console.log('   GET  /api/health - Health check');
  console.log('   POST /api/auth/login/ - Login');
  console.log('   GET  /api/auth/profile/ - Get profile');
  console.log('   POST /api/auth/register/ - Register');
  console.log('   POST /api/auth/logout/ - Logout');
  console.log('   POST /api/auth/refresh/ - Refresh token');
  console.log('');
  console.log('💡 To test admin login, run: npm run test-admin');
  console.log('💡 To verify backend, run: npm run verify-backend');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down mock backend server...');
  process.exit(0);
});

module.exports = app;

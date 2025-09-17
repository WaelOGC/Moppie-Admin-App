/**
 * Simple Mock Backend Server for Moppie Admin App
 * 
 * This is a minimal HTTP server using Node.js built-in modules only.
 * No external dependencies required.
 * 
 * Usage: node simple-mock-backend.js
 */

const http = require('http');
const url = require('url');

const PORT = 8000;

// Mock database
const users = [
  {
    id: 1,
    email: 'admin@moppie.nl',
    password: 'AdminPass123!', // In real app, this would be hashed
    role: 'admin',
    first_name: 'System',
    last_name: 'Admin',
    is_verified: true,
    is_active: true
  }
];

// Simple JWT-like token (for demo purposes)
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + (60 * 60 * 1000) // 1 hour
  };
  
  // Simple base64 encoding (not secure, just for demo)
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// Parse JSON from request body
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
  });
}

// Send JSON response
function sendJSON(res, data, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Handle CORS preflight
function handleCORS(res) {
  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end();
}

// Create server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  console.log(`${method} ${path}`);

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return handleCORS(res);
  }

  // Health check
  if (path === '/api/health' && method === 'GET') {
    return sendJSON(res, {
      status: 'OK',
      message: 'Simple mock backend server is running',
      timestamp: new Date().toISOString()
    });
  }

  // Login endpoint
  if (path === '/api/auth/login/' && method === 'POST') {
    try {
      const body = await parseBody(req);
      const { email, password } = body;

      console.log(`🔐 Login attempt for: ${email}`);

      if (!email || !password) {
        return sendJSON(res, {
          message: 'Email and password are required'
        }, 422);
      }

      const user = users.find(u => u.email === email);
      if (!user) {
        console.log(`❌ User not found: ${email}`);
        return sendJSON(res, {
          message: 'Invalid credentials'
        }, 401);
      }

      if (!user.is_active) {
        console.log(`❌ User inactive: ${email}`);
        return sendJSON(res, {
          message: 'Account is inactive'
        }, 401);
      }

      if (user.password !== password) {
        console.log(`❌ Invalid password for: ${email}`);
        return sendJSON(res, {
          message: 'Invalid credentials'
        }, 401);
      }

      const token = generateToken(user);
      console.log(`✅ Login successful for: ${email} (${user.role})`);

      return sendJSON(res, {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name,
          is_verified: user.is_verified,
          is_active: user.is_active
        },
        access_token: token,
        refresh_token: token, // Same token for simplicity
        requires_2fa: false
      });

    } catch (error) {
      console.error('❌ Login error:', error);
      return sendJSON(res, {
        message: 'Internal server error'
      }, 500);
    }
  }

  // Profile endpoint
  if (path === '/api/auth/profile/' && method === 'GET') {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendJSON(res, {
          message: 'Authorization token required'
        }, 401);
      }

      const token = authHeader.substring(7);
      
      try {
        const payload = JSON.parse(Buffer.from(token, 'base64').toString());
        
        if (payload.exp < Date.now()) {
          return sendJSON(res, {
            message: 'Token expired'
          }, 401);
        }

        const user = users.find(u => u.id === payload.id);
        if (!user) {
          return sendJSON(res, {
            message: 'User not found'
          }, 401);
        }

        return sendJSON(res, {
          id: user.id,
          email: user.email,
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name,
          is_verified: user.is_verified,
          is_active: user.is_active
        });

      } catch (jwtError) {
        return sendJSON(res, {
          message: 'Invalid token'
        }, 401);
      }

    } catch (error) {
      console.error('❌ Profile error:', error);
      return sendJSON(res, {
        message: 'Internal server error'
      }, 500);
    }
  }

  // Register endpoint
  if (path === '/api/auth/register/' && method === 'POST') {
    try {
      const body = await parseBody(req);
      const { email, password, name } = body;

      console.log(`📝 Registration attempt for: ${email}`);

      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return sendJSON(res, {
          message: 'User already exists'
        }, 409);
      }

      const newUser = {
        id: users.length + 1,
        email,
        password,
        role: 'user',
        first_name: name || 'User',
        last_name: '',
        is_verified: false,
        is_active: true
      };

      users.push(newUser);
      console.log(`✅ User registered: ${email}`);

      return sendJSON(res, {
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role
        }
      }, 201);

    } catch (error) {
      console.error('❌ Registration error:', error);
      return sendJSON(res, {
        message: 'Internal server error'
      }, 500);
    }
  }

  // Logout endpoint
  if (path === '/api/auth/logout/' && method === 'POST') {
    console.log('🚪 Logout request');
    return sendJSON(res, { message: 'Logged out successfully' });
  }

  // Mock jobs endpoint
  if (path === '/api/jobs/' && method === 'GET') {
    return sendJSON(res, {
      count: 0,
      next: null,
      previous: null,
      results: []
    });
  }

  // Mock media endpoint
  if (path === '/api/media/' && method === 'GET') {
    return sendJSON(res, {
      count: 0,
      results: []
    });
  }

  // 404 for unknown routes
  return sendJSON(res, {
    message: 'Endpoint not found'
  }, 404);
});

// Start server
server.listen(PORT, () => {
  console.log('🚀 Simple Mock Backend Server Started!');
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
  console.log('');
  console.log('💡 To test admin login, run: npm run test-admin');
  console.log('💡 To verify backend, run: npm run verify-backend');
  console.log('');
  console.log('🛑 Press Ctrl+C to stop the server');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down simple mock backend server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});

module.exports = server;

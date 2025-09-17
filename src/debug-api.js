// Debug script to test API connection
// Run this in your browser console to test API connectivity

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

console.log('🔧 API Debug Information:');
console.log('API Base URL:', API_BASE_URL);
console.log('');

// Test 1: Check if API is reachable
async function testAPIConnection() {
  console.log('🔌 Testing API connection...');
  try {
    const response = await fetch(`${API_BASE_URL}/health/`);
    if (response.ok) {
      console.log('✅ API connection successful');
      return true;
    } else {
      console.log('❌ API connection failed:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.log('❌ API connection error:', error.message);
    return false;
  }
}

// Test 2: Test login endpoint
async function testLoginEndpoint() {
  console.log('🔐 Testing login endpoint...');
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@moppie.nl',
        password: 'AdminPass123!'
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
    if (response.ok) {
      console.log('✅ Login endpoint is working');
      return true;
    } else {
      console.log('❌ Login endpoint failed:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.log('❌ Login endpoint error:', error.message);
    return false;
  }
}

// Test 3: Check if user exists
async function testUserExists() {
  console.log('👤 Testing if admin user exists...');
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Admin',
        email: 'admin@moppie.nl',
        password: 'TestPassword123'
      })
    });
    
    const responseText = await response.text();
    console.log('Register response:', response.status, responseText);
    
    if (response.status === 409) {
      console.log('✅ Admin user already exists');
      return true;
    } else if (response.status === 201) {
      console.log('ℹ️ Admin user was created');
      return true;
    } else {
      console.log('❌ Unexpected response:', response.status, responseText);
      return false;
    }
  } catch (error) {
    console.log('❌ User check error:', error.message);
    return false;
  }
}

// Run all tests
async function runDebugTests() {
  console.log('🧪 Starting API Debug Tests\n');
  
  const connectionOk = await testAPIConnection();
  console.log('');
  
  if (connectionOk) {
    await testLoginEndpoint();
    console.log('');
    await testUserExists();
  }
  
  console.log('\n📋 Debug Summary:');
  console.log('1. Check if your backend API is running on:', API_BASE_URL);
  console.log('2. Check browser console for any error messages');
  console.log('3. Check Network tab for failed requests');
  console.log('4. Verify your .env file has correct API_URL');
}

// Export for manual testing
window.debugAPI = {
  testAPIConnection,
  testLoginEndpoint,
  testUserExists,
  runDebugTests
};

console.log('💡 To run debug tests, type: debugAPI.runDebugTests()');
console.log('💡 To test individual functions, use: debugAPI.testAPIConnection()');

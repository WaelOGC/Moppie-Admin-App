/**
 * Admin Login Test Script
 * 
 * This script tests the admin login functionality by making direct API calls
 * to your backend. Run this with Node.js to verify your admin setup.
 * 
 * Usage: node test-admin-login.js
 */

const axios = require('axios');

// Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const ADMIN_EMAIL = 'admin@moppie.nl';
const ADMIN_PASSWORD = 'AdminPass123!';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Test functions
async function testAdminLogin() {
  console.log('🔑 Testing Admin Login...\n');
  
  try {
    // Test 1: Check if API is reachable
    console.log('1. Testing API connectivity...');
    try {
      await api.get('/health'); // Adjust endpoint as needed
      console.log('   ✅ API is reachable');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('   ⚠️  API is reachable but /health endpoint not found (this is OK)');
      } else {
        console.log('   ❌ API connectivity issue:', error.message);
        return;
      }
    }

    // Test 2: Attempt admin login
    console.log('\n2. Testing admin login...');
    const loginData = {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    };

    const loginResponse = await api.post('/auth/login/', loginData);
    
    if (loginResponse.data) {
      console.log('   ✅ Login successful!');
      console.log('   📧 Email:', loginResponse.data.user?.email);
      console.log('   👤 Role:', loginResponse.data.user?.role);
      console.log('   ✅ Verified:', loginResponse.data.user?.is_verified);
      console.log('   ✅ Active:', loginResponse.data.user?.is_active);
      console.log('   🔑 Access Token:', loginResponse.data.access_token ? 'Present' : 'Missing');
      console.log('   🔄 Refresh Token:', loginResponse.data.refresh_token ? 'Present' : 'Missing');
      
      // Test 3: Verify profile access
      if (loginResponse.data.access_token) {
        console.log('\n3. Testing profile access...');
        try {
          const profileResponse = await api.get('/auth/profile/', {
            headers: {
              Authorization: `Bearer ${loginResponse.data.access_token}`,
            },
          });
          console.log('   ✅ Profile access successful');
          console.log('   👤 User ID:', profileResponse.data.id);
          console.log('   📧 Email:', profileResponse.data.email);
          console.log('   👤 Role:', profileResponse.data.role);
        } catch (error) {
          console.log('   ❌ Profile access failed:', error.response?.data?.message || error.message);
        }
      }
      
    } else {
      console.log('   ❌ Login failed: No response data');
    }

  } catch (error) {
    console.log('   ❌ Login failed:');
    
    if (error.response) {
      // Server responded with error status
      console.log('   📊 Status:', error.response.status);
      console.log('   📝 Message:', error.response.data?.message || 'No error message');
      console.log('   📋 Details:', error.response.data?.details || 'No additional details');
      
      // Provide specific troubleshooting based on status code
      switch (error.response.status) {
        case 401:
          console.log('\n   🔧 Troubleshooting for 401 (Unauthorized):');
          console.log('   - Check if admin user exists in database');
          console.log('   - Verify password is correct');
          console.log('   - Ensure user is active (is_active = true)');
          break;
        case 422:
          console.log('\n   🔧 Troubleshooting for 422 (Validation Error):');
          console.log('   - Check email format');
          console.log('   - Verify password meets requirements');
          break;
        case 500:
          console.log('\n   🔧 Troubleshooting for 500 (Server Error):');
          console.log('   - Check backend server logs');
          console.log('   - Verify database connection');
          console.log('   - Check if pgcrypto extension is installed');
          break;
        default:
          console.log('\n   🔧 General troubleshooting:');
          console.log('   - Check backend server is running');
          console.log('   - Verify API endpoint URL');
          console.log('   - Check database connection');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.log('   🌐 Network error: No response from server');
      console.log('   🔧 Troubleshooting:');
      console.log('   - Check if backend server is running');
      console.log('   - Verify API URL:', API_BASE_URL);
      console.log('   - Check firewall/network settings');
    } else {
      // Something else happened
      console.log('   ⚠️  Unexpected error:', error.message);
    }
  }
}

// Test invalid credentials
async function testInvalidCredentials() {
  console.log('\n4. Testing invalid credentials...');
  
  try {
    await api.post('/auth/login/', {
      email: 'invalid@example.com',
      password: 'wrongpassword',
    });
    console.log('   ❌ Should have failed but succeeded (security issue!)');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('   ✅ Correctly rejected invalid credentials');
    } else {
      console.log('   ⚠️  Unexpected error for invalid credentials:', error.message);
    }
  }
}

// Main execution
async function main() {
  console.log('🚀 Moppie Admin Login Test\n');
  console.log('📋 Configuration:');
  console.log('   API URL:', API_BASE_URL);
  console.log('   Admin Email:', ADMIN_EMAIL);
  console.log('   Admin Password:', '*'.repeat(ADMIN_PASSWORD.length));
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testAdminLogin();
  await testInvalidCredentials();
  
  console.log('\n' + '='.repeat(50));
  console.log('🏁 Test completed!');
  console.log('\n📖 Next steps:');
  console.log('1. If login failed, check the troubleshooting tips above');
  console.log('2. Run the SQL commands in ADMIN_ACCESS_SETUP.md');
  console.log('3. Verify your backend server is running');
  console.log('4. Check your database connection and user table');
}

// Run the test
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testAdminLogin, testInvalidCredentials };

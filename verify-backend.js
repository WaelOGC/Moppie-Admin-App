/**
 * Backend Connection Verification Script
 * 
 * This script verifies that your backend API is running and accessible.
 * Run this before testing admin login.
 * 
 * Usage: node verify-backend.js
 */

const axios = require('axios');

// Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

async function verifyBackendConnection() {
  console.log('🔍 Verifying Backend Connection...\n');
  console.log('📋 Configuration:');
  console.log('   API URL:', API_BASE_URL);
  console.log('\n' + '='.repeat(50) + '\n');

  try {
    // Test basic connectivity
    console.log('1. Testing basic connectivity...');
    
    // Try to reach the base API URL
    const response = await axios.get(API_BASE_URL, {
      timeout: 5000,
      validateStatus: function (status) {
        // Accept any status code (200, 404, 500, etc.)
        return status >= 200 && status < 600;
      }
    });
    
    console.log('   ✅ Backend is reachable!');
    console.log('   📊 Status Code:', response.status);
    console.log('   📝 Response:', response.statusText);
    
    if (response.data) {
      console.log('   📋 Response Data:', JSON.stringify(response.data, null, 2));
    }

  } catch (error) {
    console.log('   ❌ Backend connection failed!');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('   🔧 Issue: Connection refused');
      console.log('   💡 Solution: Make sure your backend server is running');
      console.log('   💡 Check: Is the server running on the correct port?');
    } else if (error.code === 'ENOTFOUND') {
      console.log('   🔧 Issue: Host not found');
      console.log('   💡 Solution: Check your API URL configuration');
      console.log('   💡 Current URL:', API_BASE_URL);
    } else if (error.code === 'ETIMEDOUT') {
      console.log('   🔧 Issue: Connection timeout');
      console.log('   💡 Solution: Check if the server is responding');
      console.log('   💡 Check: Firewall or network issues?');
    } else {
      console.log('   🔧 Issue:', error.message);
    }
    
    console.log('\n   📖 Troubleshooting Steps:');
    console.log('   1. Verify your backend server is running');
    console.log('   2. Check the port number (default: 8000)');
    console.log('   3. Ensure no firewall is blocking the connection');
    console.log('   4. Try accessing the API URL in your browser');
    console.log('   5. Check backend server logs for errors');
    
    return false;
  }

  // Test specific endpoints
  console.log('\n2. Testing authentication endpoints...');
  
  const endpoints = [
    '/auth/login/',
    '/auth/register/',
    '/auth/profile/',
  ];

  for (const endpoint of endpoints) {
    try {
      const fullUrl = API_BASE_URL + endpoint;
      const response = await axios.get(fullUrl, {
        timeout: 3000,
        validateStatus: function (status) {
          // Accept 200, 404, 405 (method not allowed), etc.
          return status >= 200 && status < 600;
        }
      });
      
      if (response.status === 405) {
        console.log(`   ✅ ${endpoint} - Endpoint exists (Method Not Allowed for GET)`);
      } else if (response.status === 404) {
        console.log(`   ⚠️  ${endpoint} - Endpoint not found`);
      } else {
        console.log(`   ✅ ${endpoint} - Status: ${response.status}`);
      }
      
    } catch (error) {
      console.log(`   ❌ ${endpoint} - Error: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('🏁 Backend verification completed!');
  
  return true;
}

// Main execution
async function main() {
  const isConnected = await verifyBackendConnection();
  
  if (isConnected) {
    console.log('\n✅ Backend is ready! You can now test admin login.');
    console.log('💡 Run: npm run test-admin');
  } else {
    console.log('\n❌ Backend connection failed. Please fix the issues above.');
    console.log('💡 After fixing, run: npm run test-admin');
  }
}

// Run the verification
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { verifyBackendConnection };

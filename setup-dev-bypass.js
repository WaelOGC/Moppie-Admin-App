#!/usr/bin/env node

// Setup script for development authentication bypass
// Run with: node setup-dev-bypass.js

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Development Authentication Bypass...\n');

const envContent = `# TEMPORARY ADMIN BYPASS FOR LOCAL DEVELOPMENT
# Set this to 'true' to bypass authentication and automatically log in as admin
# TODO: Remove this before production deployment
REACT_APP_BYPASS_AUTH=true

# API Configuration
REACT_APP_API_URL=http://localhost:8000/api
`;

const envPath = path.join(__dirname, '.env.local');

try {
  // Check if .env.local already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env.local file already exists');
    console.log('   Please manually add REACT_APP_BYPASS_AUTH=true to your existing file');
    console.log('   Or delete .env.local and run this script again\n');
  } else {
    // Create .env.local file
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env.local file with authentication bypass enabled');
    console.log('   REACT_APP_BYPASS_AUTH=true');
    console.log('   REACT_APP_API_URL=http://localhost:8000/api\n');
  }

  console.log('📋 Next Steps:');
  console.log('   1. Restart your development server: npm start');
  console.log('   2. Open the app in your browser');
  console.log('   3. You should be automatically logged in as admin');
  console.log('   4. Check browser console for bypass confirmation message\n');

  console.log('🔒 Security Notes:');
  console.log('   - This bypass only works in development mode');
  console.log('   - Set REACT_APP_BYPASS_AUTH=false to disable');
  console.log('   - Remove .env.local before production deployment\n');

  console.log('🎉 Development bypass setup complete!');

} catch (error) {
  console.error('❌ Error setting up development bypass:', error.message);
  console.log('\n💡 Manual Setup:');
  console.log('   Create .env.local file in project root with:');
  console.log('   REACT_APP_BYPASS_AUTH=true');
  console.log('   REACT_APP_API_URL=http://localhost:8000/api');
}

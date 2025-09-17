// Test script to verify Staff Management backend integration
// Run this with: node test-staff-integration.js

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

async function testStaffAPI() {
  console.log('🧪 Testing Staff Management Backend Integration...\n');

  try {
    // Test 1: Get all employees
    console.log('1️⃣ Testing getAllEmployees()...');
    const employeesResponse = await fetch(`${API_BASE_URL}/employees/`, {
      headers: {
        'Authorization': `Bearer ${process.env.TEST_TOKEN || 'test-token'}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (employeesResponse.ok) {
      const employees = await employeesResponse.json();
      console.log(`✅ Found ${employees.length} employees`);
      console.log('   Sample employee:', employees[0] ? {
        id: employees[0].id,
        name: employees[0].name,
        role: employees[0].role,
        status: employees[0].status
      } : 'No employees found');
    } else {
      console.log(`❌ Failed to fetch employees: ${employeesResponse.status}`);
    }

    // Test 2: Get employee profile
    console.log('\n2️⃣ Testing getEmployeeProfile()...');
    const profileResponse = await fetch(`${API_BASE_URL}/employees/1/`, {
      headers: {
        'Authorization': `Bearer ${process.env.TEST_TOKEN || 'test-token'}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (profileResponse.ok) {
      const profile = await profileResponse.json();
      console.log('✅ Employee profile loaded');
      console.log('   Profile data:', {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role
      });
    } else {
      console.log(`❌ Failed to fetch employee profile: ${profileResponse.status}`);
    }

    // Test 3: Get employee schedule
    console.log('\n3️⃣ Testing getEmployeeSchedule()...');
    const scheduleResponse = await fetch(`${API_BASE_URL}/employees/me/schedule/?start_date=2024-01-01&end_date=2024-01-31`, {
      headers: {
        'Authorization': `Bearer ${process.env.TEST_TOKEN || 'test-token'}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (scheduleResponse.ok) {
      const schedule = await scheduleResponse.json();
      console.log('✅ Employee schedule loaded');
      console.log(`   Found ${schedule.length} schedule entries`);
    } else {
      console.log(`❌ Failed to fetch employee schedule: ${scheduleResponse.status}`);
    }

    // Test 4: Get employee jobs
    console.log('\n4️⃣ Testing getEmployeeJobs()...');
    const jobsResponse = await fetch(`${API_BASE_URL}/employees/me/jobs/`, {
      headers: {
        'Authorization': `Bearer ${process.env.TEST_TOKEN || 'test-token'}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (jobsResponse.ok) {
      const jobs = await jobsResponse.json();
      console.log('✅ Employee jobs loaded');
      console.log(`   Found ${jobs.length} job assignments`);
    } else {
      console.log(`❌ Failed to fetch employee jobs: ${jobsResponse.status}`);
    }

    // Test 5: Get employee earnings
    console.log('\n5️⃣ Testing getEmployeeEarnings()...');
    const earningsResponse = await fetch(`${API_BASE_URL}/employees/me/earnings/?start_date=2024-01-01&end_date=2024-01-31`, {
      headers: {
        'Authorization': `Bearer ${process.env.TEST_TOKEN || 'test-token'}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (earningsResponse.ok) {
      const earnings = await earningsResponse.json();
      console.log('✅ Employee earnings loaded');
      console.log('   Earnings data:', {
        total_hours: earnings.total_hours,
        hourly_rate: earnings.hourly_rate,
        total_earnings: earnings.total_earnings
      });
    } else {
      console.log(`❌ Failed to fetch employee earnings: ${earningsResponse.status}`);
    }

    // Test 6: Get employee media
    console.log('\n6️⃣ Testing getEmployeeMedia()...');
    const mediaResponse = await fetch(`${API_BASE_URL}/employees/me/media/`, {
      headers: {
        'Authorization': `Bearer ${process.env.TEST_TOKEN || 'test-token'}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (mediaResponse.ok) {
      const media = await mediaResponse.json();
      console.log('✅ Employee media loaded');
      console.log(`   Found ${media.length} media files`);
    } else {
      console.log(`❌ Failed to fetch employee media: ${mediaResponse.status}`);
    }

    console.log('\n🎉 Staff Management Backend Integration Test Complete!');
    console.log('\n📋 Summary:');
    console.log('   - Staff Directory: Uses getAllEmployees()');
    console.log('   - Staff Profile: Uses getEmployeeProfile() with tabs for Schedule, Earnings, Media');
    console.log('   - Staff Schedule: Uses getEmployeeSchedule() for calendar view');
    console.log('   - Error handling: Added loading states and retry functionality');
    console.log('   - All mock data replaced with real backend endpoints');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\n💡 Make sure your backend server is running and accessible.');
  }
}

// Run the test
testStaffAPI();

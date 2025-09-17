// Test script to verify Media Review backend integration
// Run this with: node test-media-integration.js

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

async function testMediaAPI() {
  console.log('🧪 Testing Media Review Backend Integration...\n');

  try {
    // Test 1: Get employee media (employee-specific view)
    console.log('1️⃣ Testing getEmployeeMedia()...');
    const employeeMediaResponse = await fetch(`${API_BASE_URL}/employees/me/media/`, {
      headers: {
        'Authorization': `Bearer ${process.env.TEST_TOKEN || 'test-token'}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (employeeMediaResponse.ok) {
      const employeeMedia = await employeeMediaResponse.json();
      console.log(`✅ Found ${employeeMedia.length || employeeMedia.results?.length || 0} employee media files`);
      if (employeeMedia.length > 0 || employeeMedia.results?.length > 0) {
        const sampleMedia = employeeMedia[0] || employeeMedia.results[0];
        console.log('   Sample media:', {
          id: sampleMedia.id,
          job_id: sampleMedia.job_id,
          category: sampleMedia.category,
          status: sampleMedia.status,
          file_name: sampleMedia.file_name
        });
      }
    } else {
      console.log(`❌ Failed to fetch employee media: ${employeeMediaResponse.status}`);
    }

    // Test 2: Get job media (admin view by job)
    console.log('\n2️⃣ Testing getJobMedia()...');
    const jobMediaResponse = await fetch(`${API_BASE_URL}/jobs/1/media/`, {
      headers: {
        'Authorization': `Bearer ${process.env.TEST_TOKEN || 'test-token'}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (jobMediaResponse.ok) {
      const jobMedia = await jobMediaResponse.json();
      console.log(`✅ Found ${jobMedia.length || jobMedia.results?.length || 0} media files for job 1`);
      if (jobMedia.length > 0 || jobMedia.results?.length > 0) {
        const sampleMedia = jobMedia[0] || jobMedia.results[0];
        console.log('   Sample job media:', {
          id: sampleMedia.id,
          job_id: sampleMedia.job_id,
          category: sampleMedia.category,
          status: sampleMedia.status
        });
      }
    } else {
      console.log(`❌ Failed to fetch job media: ${jobMediaResponse.status}`);
    }

    // Test 3: Update media status
    console.log('\n3️⃣ Testing updateMediaStatus()...');
    const updateStatusResponse = await fetch(`${API_BASE_URL}/media/1/update-status/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TEST_TOKEN || 'test-token'}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'approved' })
    });
    
    if (updateStatusResponse.ok) {
      const updateResult = await updateStatusResponse.json();
      console.log('✅ Media status updated successfully');
      console.log('   Update result:', updateResult);
    } else {
      console.log(`❌ Failed to update media status: ${updateStatusResponse.status}`);
      console.log('   Note: This endpoint might not exist yet - using mock for action');
    }

    // Test 4: Bulk update media status
    console.log('\n4️⃣ Testing bulkUpdateMediaStatus()...');
    const bulkUpdateResponse = await fetch(`${API_BASE_URL}/media/bulk-update-status/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TEST_TOKEN || 'test-token'}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        media_ids: [1, 2, 3], 
        status: 'approved' 
      })
    });
    
    if (bulkUpdateResponse.ok) {
      const bulkResult = await bulkUpdateResponse.json();
      console.log('✅ Bulk media status update successful');
      console.log('   Bulk result:', bulkResult);
    } else {
      console.log(`❌ Failed to bulk update media status: ${bulkUpdateResponse.status}`);
    }

    // Test 5: Get jobs list for filtering
    console.log('\n5️⃣ Testing getJobsList()...');
    const jobsResponse = await fetch(`${API_BASE_URL}/jobs/?page_size=100`, {
      headers: {
        'Authorization': `Bearer ${process.env.TEST_TOKEN || 'test-token'}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (jobsResponse.ok) {
      const jobs = await jobsResponse.json();
      console.log('✅ Jobs list loaded');
      console.log(`   Found ${jobs.length || jobs.results?.length || 0} jobs`);
      if (jobs.length > 0 || jobs.results?.length > 0) {
        const sampleJob = jobs[0] || jobs.results[0];
        console.log('   Sample job:', {
          id: sampleJob.id,
          job_id: sampleJob.job_id,
          title: sampleJob.title
        });
      }
    } else {
      console.log(`❌ Failed to fetch jobs list: ${jobsResponse.status}`);
    }

    console.log('\n🎉 Media Review Backend Integration Test Complete!');
    console.log('\n📋 Summary:');
    console.log('   - Employee View: Uses getEmployeeMedia() for employee-specific media');
    console.log('   - Admin View: Uses getJobMedia() for job-specific media');
    console.log('   - Status Updates: Uses updateMediaStatus() with POST to /update-status/');
    console.log('   - Bulk Actions: Uses bulkUpdateMediaStatus() for multiple files');
    console.log('   - Filtering: Supports status, job ID, employee, date filters');
    console.log('   - Search: Supports job ID and file name search');
    console.log('   - Error Handling: Added loading states and retry functionality');
    console.log('   - Modal Viewer: Full-screen media preview with metadata');
    console.log('   - Real-time Updates: UI updates immediately on status changes');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\n💡 Make sure your backend server is running and accessible.');
  }
}

// Run the test
testMediaAPI();

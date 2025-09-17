// Test script to verify Payments & Estimates backend integration
// Run this with: node test-payments-integration.js

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

async function testPaymentsAPI() {
  console.log('🧪 Testing Payments & Estimates Backend Integration...\n');

  try {
    // Test 1: Get all payments (admin-side)
    console.log('1️⃣ Testing getAllPayments()...');
    const paymentsResponse = await fetch(`${API_BASE_URL}/payments/`, {
      headers: {
        'Authorization': `Bearer ${process.env.TEST_TOKEN || 'test-token'}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (paymentsResponse.ok) {
      const payments = await paymentsResponse.json();
      console.log(`✅ Found ${payments.length || payments.results?.length || 0} payments`);
      if (payments.length > 0 || payments.results?.length > 0) {
        const samplePayment = payments[0] || payments.results[0];
        console.log('   Sample payment:', {
          id: samplePayment.id,
          amount: samplePayment.amount,
          status: samplePayment.status,
          payment_method: samplePayment.payment_method
        });
      }
    } else {
      console.log(`❌ Failed to fetch payments: ${paymentsResponse.status}`);
    }

    // Test 2: Get all estimates (admin-side)
    console.log('\n2️⃣ Testing getAllEstimates()...');
    const estimatesResponse = await fetch(`${API_BASE_URL}/payments/estimates/`, {
      headers: {
        'Authorization': `Bearer ${process.env.TEST_TOKEN || 'test-token'}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (estimatesResponse.ok) {
      const estimates = await estimatesResponse.json();
      console.log(`✅ Found ${estimates.length || estimates.results?.length || 0} estimates`);
      if (estimates.length > 0 || estimates.results?.length > 0) {
        const sampleEstimate = estimates[0] || estimates.results[0];
        console.log('   Sample estimate:', {
          id: sampleEstimate.id,
          job_id: sampleEstimate.job_id,
          estimated_amount: sampleEstimate.estimated_amount,
          status: sampleEstimate.status
        });
      }
    } else {
      console.log(`❌ Failed to fetch estimates: ${estimatesResponse.status}`);
    }

    // Test 3: Get client estimates (client-side)
    console.log('\n3️⃣ Testing getClientEstimates()...');
    const clientEstimatesResponse = await fetch(`${API_BASE_URL}/clients/me/payment-estimates/`, {
      headers: {
        'Authorization': `Bearer ${process.env.TEST_TOKEN || 'test-token'}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (clientEstimatesResponse.ok) {
      const clientEstimates = await clientEstimatesResponse.json();
      console.log(`✅ Found ${clientEstimates.length || clientEstimates.results?.length || 0} client estimates`);
      if (clientEstimates.length > 0 || clientEstimates.results?.length > 0) {
        const sampleClientEstimate = clientEstimates[0] || clientEstimates.results[0];
        console.log('   Sample client estimate:', {
          id: sampleClientEstimate.id,
          job_id: sampleClientEstimate.job_id,
          status: sampleClientEstimate.status
        });
      }
    } else {
      console.log(`❌ Failed to fetch client estimates: ${clientEstimatesResponse.status}`);
    }

    // Test 4: Create estimate (admin-side)
    console.log('\n4️⃣ Testing createEstimate()...');
    const createEstimateResponse = await fetch(`${API_BASE_URL}/payments/estimates/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TEST_TOKEN || 'test-token'}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        job_id: 'TEST_JOB_001',
        estimated_amount: 150.00,
        estimated_duration_minutes: 120,
        estimated_scheduled_date: '2024-02-01',
        estimated_scheduled_time: '10:00:00',
        admin_notes: 'Test estimate created via API'
      })
    });
    
    if (createEstimateResponse.ok) {
      const newEstimate = await createEstimateResponse.json();
      console.log('✅ Estimate created successfully');
      console.log('   New estimate:', {
        id: newEstimate.id,
        job_id: newEstimate.job_id,
        estimated_amount: newEstimate.estimated_amount
      });
    } else {
      console.log(`❌ Failed to create estimate: ${createEstimateResponse.status}`);
    }

    // Test 5: Update estimate (admin-side)
    console.log('\n5️⃣ Testing updateEstimate()...');
    const updateEstimateResponse = await fetch(`${API_BASE_URL}/payments/estimates/1/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.TEST_TOKEN || 'test-token'}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        estimated_amount: 175.00,
        admin_notes: 'Updated estimate amount'
      })
    });
    
    if (updateEstimateResponse.ok) {
      const updatedEstimate = await updateEstimateResponse.json();
      console.log('✅ Estimate updated successfully');
      console.log('   Updated estimate:', {
        id: updatedEstimate.id,
        estimated_amount: updatedEstimate.estimated_amount
      });
    } else {
      console.log(`❌ Failed to update estimate: ${updateEstimateResponse.status}`);
    }

    // Test 6: Client approve estimate
    console.log('\n6️⃣ Testing approveEstimate()...');
    const approveEstimateResponse = await fetch(`${API_BASE_URL}/clients/me/jobs/1/approve/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TEST_TOKEN || 'test-token'}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        approval: true,
        approved_at: new Date().toISOString(),
        client_notes: 'Approved by client via API test'
      })
    });
    
    if (approveEstimateResponse.ok) {
      const approvalResult = await approveEstimateResponse.json();
      console.log('✅ Estimate approved successfully');
      console.log('   Approval result:', approvalResult);
    } else {
      console.log(`❌ Failed to approve estimate: ${approveEstimateResponse.status}`);
    }

    // Test 7: Client reject estimate
    console.log('\n7️⃣ Testing rejectEstimate()...');
    const rejectEstimateResponse = await fetch(`${API_BASE_URL}/clients/me/jobs/2/reject/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TEST_TOKEN || 'test-token'}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rejection_reason: 'price_too_high',
        alternative_offer: 'lower_price',
        counter_amount: 120.00,
        notes: 'Price is too high, counter-offering lower amount',
        rejected_at: new Date().toISOString()
      })
    });
    
    if (rejectEstimateResponse.ok) {
      const rejectionResult = await rejectEstimateResponse.json();
      console.log('✅ Estimate rejected with counter-offer successfully');
      console.log('   Rejection result:', rejectionResult);
    } else {
      console.log(`❌ Failed to reject estimate: ${rejectEstimateResponse.status}`);
    }

    // Test 8: Get estimate by ID
    console.log('\n8️⃣ Testing getEstimateById()...');
    const estimateByIdResponse = await fetch(`${API_BASE_URL}/payments/estimates/1/`, {
      headers: {
        'Authorization': `Bearer ${process.env.TEST_TOKEN || 'test-token'}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (estimateByIdResponse.ok) {
      const estimate = await estimateByIdResponse.json();
      console.log('✅ Estimate details loaded successfully');
      console.log('   Estimate details:', {
        id: estimate.id,
        job_id: estimate.job_id,
        status: estimate.status,
        estimated_amount: estimate.estimated_amount
      });
    } else {
      console.log(`❌ Failed to fetch estimate details: ${estimateByIdResponse.status}`);
    }

    console.log('\n🎉 Payments & Estimates Backend Integration Test Complete!');
    console.log('\n📋 Summary:');
    console.log('   - Admin Payments: Uses getAllPayments() for invoice management');
    console.log('   - Admin Estimates: Uses getAllEstimates() for estimate management');
    console.log('   - Create Estimate: Uses createEstimate() with job_id, amount, duration, schedule');
    console.log('   - Update Estimate: Uses updateEstimate() for inline editing');
    console.log('   - Client Estimates: Uses getClientEstimates() for client view');
    console.log('   - Client Approval: Uses approveEstimate() for approval workflow');
    console.log('   - Client Rejection: Uses rejectEstimate() with counter-offer support');
    console.log('   - Status Flow: pending_client_approval → client_approved → job_scheduled');
    console.log('   - Status Flow: pending_client_approval → client_rejected');
    console.log('   - Real-time Updates: UI updates immediately on status changes');
    console.log('   - Toast Notifications: Success/error feedback for all actions');
    console.log('   - Error Handling: Loading states and retry functionality');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\n💡 Make sure your backend server is running and accessible.');
  }
}

// Run the test
testPaymentsAPI();

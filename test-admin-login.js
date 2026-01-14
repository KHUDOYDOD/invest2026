const fetch = require('node-fetch');

async function testAdminLogin() {
  try {
    console.log('🔐 Testing admin login...');
    
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
      })
    });

    const data = await response.json();
    console.log('📥 Login response:', data);

    if (data.success && data.token) {
      console.log('✅ Admin login successful!');
      console.log('🎫 Token:', data.token.substring(0, 50) + '...');
      
      // Test admin deposit requests API
      console.log('\n🔍 Testing admin deposit requests API...');
      const requestsResponse = await fetch('http://localhost:3000/api/admin/deposit-requests', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data.token}`,
          'Content-Type': 'application/json',
        }
      });

      const requestsData = await requestsResponse.json();
      console.log('📊 Deposit requests response:', requestsData);

      if (requestsData.success) {
        console.log(`✅ Found ${requestsData.requests.length} deposit requests`);
        requestsData.requests.forEach((req, index) => {
          console.log(`  ${index + 1}. ${req.userName} - $${req.amount} (${req.status})`);
        });
      } else {
        console.log('❌ Failed to get deposit requests:', requestsData.error);
      }
    } else {
      console.log('❌ Admin login failed:', data.error);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAdminLogin();
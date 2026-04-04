const http = require('http');

const options = {
  hostname: '213.171.31.215',
  port: 80,
  path: '/api/admin/project-launches',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('=== API RESPONSE ===');
    console.log('Status:', res.statusCode);
    try {
      const json = JSON.parse(data);
      console.log('Data:', JSON.stringify(json, null, 2));
      
      const launched = json.filter(item => item.is_launched === true && item.show_on_site && item.is_active);
      console.log('\n✅ Launched projects:', launched.length);
      if (launched.length > 0) {
        console.log('First launched project:', JSON.stringify(launched[0], null, 2));
      }
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

req.end();

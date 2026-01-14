const https = require('https');

console.log('🔍 Детальная проверка ошибок API...\n');

function checkEndpoint(path) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'invest2025-main.vercel.app',
      port: 443,
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'Node.js',
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📍 ${path}`);
        console.log(`   Статус: ${res.statusCode}`);
        
        try {
          const json = JSON.parse(data);
          console.log(`   Ответ:`, JSON.stringify(json, null, 2));
        } catch (e) {
          console.log(`   Ответ (raw):`, data.substring(0, 500));
        }
        console.log('');
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${path}: ${error.message}\n`);
      resolve();
    });

    req.end();
  });
}

async function main() {
  await checkEndpoint('/api/statistics');
  await checkEndpoint('/api/settings/site');
  await checkEndpoint('/api/testimonials');
  
  console.log('💡 Если ошибка содержит "relation ... does not exist", значит таблицы не созданы');
  console.log('📝 Выполните SQL из файла EXECUTE_THIS_IN_SUPABASE.md\n');
}

main();

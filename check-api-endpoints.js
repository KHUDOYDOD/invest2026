const https = require('https');

const endpoints = [
  '/api/statistics',
  '/api/settings/site',
  '/api/testimonials',
  '/api/investment-plans',
  '/api/messages',
  '/api/notifications'
];

console.log('🔍 Проверка API эндпоинтов на Vercel...\n');

function checkEndpoint(path) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'invest2025-main.vercel.app',
      port: 443,
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'Node.js'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const status = res.statusCode;
        const icon = status === 200 ? '✅' : '❌';
        console.log(`${icon} ${path}`);
        console.log(`   Статус: ${status}`);
        
        if (status !== 200) {
          try {
            const json = JSON.parse(data);
            if (json.error) {
              console.log(`   Ошибка: ${json.error}`);
            }
          } catch (e) {
            if (data.length < 200) {
              console.log(`   Ответ: ${data}`);
            }
          }
        } else {
          try {
            const json = JSON.parse(data);
            console.log(`   Данные получены: ${JSON.stringify(json).substring(0, 100)}...`);
          } catch (e) {
            console.log(`   Данные получены (${data.length} байт)`);
          }
        }
        console.log('');
        resolve({ path, status, data });
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${path}`);
      console.log(`   Ошибка: ${error.message}\n`);
      resolve({ path, status: 0, error: error.message });
    });

    req.end();
  });
}

async function checkAll() {
  for (const endpoint of endpoints) {
    await checkEndpoint(endpoint);
  }
  
  console.log('\n📊 Итог:');
  console.log('Если видите ошибки "relation does not exist" - нужно выполнить SQL в Supabase');
  console.log('Инструкция в файле: EXECUTE_THIS_IN_SUPABASE.md\n');
}

checkAll();

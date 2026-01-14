const https = require('https');

const newDeployUrl = 'invest2025-main-a38b6aywg-xx453925xx-1555s-projects.vercel.app';

console.log('🔍 Проверка нового деплоя...\n');
console.log(`URL: https://${newDeployUrl}\n`);

function checkEndpoint(path) {
  return new Promise((resolve) => {
    const options = {
      hostname: newDeployUrl,
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
        console.log(`${icon} ${path} - Статус: ${status}`);
        
        if (status === 200) {
          try {
            const json = JSON.parse(data);
            console.log(`   Данные: ${JSON.stringify(json).substring(0, 100)}...`);
          } catch (e) {}
        } else {
          try {
            const json = JSON.parse(data);
            if (json.error) {
              console.log(`   Ошибка: ${json.error}`);
            }
          } catch (e) {}
        }
        console.log('');
        resolve({ path, status });
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${path}: ${error.message}\n`);
      resolve({ path, status: 0 });
    });

    req.end();
  });
}

async function main() {
  await checkEndpoint('/api/statistics');
  await checkEndpoint('/api/settings/site');
  await checkEndpoint('/api/testimonials');
  
  console.log('💡 Если всё работает, обновите DNS alias на этот деплой');
}

main();

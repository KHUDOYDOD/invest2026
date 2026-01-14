const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('🚀 Выполнение SQL через Supabase Management API...\n');

// Read .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)="?([^"]+)"?$/);
  if (match) {
    envVars[match[1]] = match[2];
  }
});

const PROJECT_REF = 'kdfxytlaxrcrtsxvqilg';
const SERVICE_ROLE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;

// Read SQL
const sqlFile = fs.readFileSync(path.join(__dirname, 'supabase-setup.sql'), 'utf8');

console.log('📝 SQL скрипт загружен');
console.log('🔑 Используем Service Role Key для авторизации\n');

// Try using PostgREST to create tables via REST API
// We'll use the service role key which has full access

function makeRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    
    const options = {
      hostname: 'kdfxytlaxrcrtsxvqilg.supabase.co',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Prefer': 'return=representation'
      }
    };
    
    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }
    
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ status: res.statusCode, data: responseData });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });
    
    req.on('error', reject);
    
    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

async function createTablesViaInserts() {
  console.log('💡 Попытка создания данных через REST API...\n');
  
  try {
    // Try to insert into platform_statistics
    console.log('📊 Создание записи в platform_statistics...');
    const statsData = {
      users_count: 15420,
      users_change: 12.5,
      investments_amount: 2850000,
      investments_change: 8.3,
      payouts_amount: 1920000,
      payouts_change: 15.7,
      profitability_rate: 24.8,
      profitability_change: 3.2
    };
    
    const result = await makeRequest('POST', '/rest/v1/platform_statistics', statsData);
    console.log('✅ Данные созданы:', result.status);
    
    return true;
  } catch (error) {
    console.log('❌ Ошибка:', error.message);
    
    if (error.message.includes('relation') && error.message.includes('does not exist')) {
      console.log('\n⚠️  Таблицы не существуют. Их нужно создать через SQL Editor.\n');
    }
    
    return false;
  }
}

async function main() {
  const success = await createTablesViaInserts();
  
  if (!success) {
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║   ТРЕБУЕТСЯ РУЧНОЕ ВЫПОЛНЕНИЕ SQL                             ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');
    console.log('Supabase не позволяет создавать таблицы через REST API.');
    console.log('Это можно сделать только через SQL Editor.\n');
    console.log('📝 ПРОСТОЕ РЕШЕНИЕ:\n');
    console.log('1. Запустите: SETUP_DATABASE_ONE_CLICK.bat');
    console.log('   (откроет браузер и скопирует SQL)\n');
    console.log('2. В браузере нажмите Ctrl+V и Run\n');
    console.log('3. Готово! ✅\n');
    console.log('🔗 Или откройте вручную:');
    console.log('   https://supabase.com/dashboard/project/kdfxytlaxrcrtsxvqilg/sql/new\n');
  } else {
    console.log('\n✅ Настройка завершена!');
    console.log('📝 Проверьте API: node check-api-endpoints.js\n');
  }
}

main();

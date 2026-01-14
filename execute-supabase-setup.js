const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Ошибка: SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY не найдены в .env.local');
  process.exit(1);
}

// Читаем SQL файл
const sqlContent = fs.readFileSync('supabase-setup.sql', 'utf8');

// Разбиваем SQL на отдельные команды
const sqlCommands = sqlContent
  .split(';')
  .map(cmd => cmd.trim())
  .filter(cmd => cmd.length > 0 && !cmd.startsWith('--') && !cmd.match(/^\/\*/));

console.log('🚀 Начинаем выполнение SQL команд...');
console.log(`📝 Всего команд: ${sqlCommands.length}`);

let successCount = 0;
let errorCount = 0;

async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query: sql });
    
    const options = {
      hostname: SUPABASE_URL.replace('https://', '').replace('http://', ''),
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data });
        } else {
          resolve({ success: false, error: data, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Альтернативный метод через прямое подключение к PostgreSQL
const { Pool } = require('pg');

async function executeViaPG() {
  const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
  
  if (!connectionString) {
    console.error('❌ Не найдена строка подключения к PostgreSQL');
    return false;
  }

  console.log('🔌 Подключаемся к PostgreSQL...');
  
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    console.log('✅ Подключение установлено');
    
    // Выполняем весь SQL скрипт целиком
    console.log('📝 Выполняем SQL скрипт...');
    await client.query(sqlContent);
    
    console.log('✅ SQL скрипт выполнен успешно!');
    
    // Проверяем созданные таблицы
    console.log('\n📊 Проверка созданных таблиц:');
    const result = await client.query(`
      SELECT 
        table_name,
        (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name IN (
          'platform_statistics',
          'site_settings',
          'appearance_settings',
          'notification_settings',
          'testimonials',
          'messages',
          'user_notifications',
          'user_notification_preferences'
        )
      ORDER BY table_name;
    `);
    
    console.log('\n✅ Созданные таблицы:');
    result.rows.forEach(row => {
      console.log(`   ✓ ${row.table_name} (${row.column_count} колонок)`);
    });
    
    client.release();
    await pool.end();
    
    return true;
  } catch (error) {
    console.error('❌ Ошибка при выполнении SQL:', error.message);
    await pool.end();
    return false;
  }
}

// Запускаем выполнение
executeViaPG().then(success => {
  if (success) {
    console.log('\n🎉 Настройка базы данных завершена успешно!');
    console.log('\n📋 Следующие шаги:');
    console.log('   1. Проверьте API: https://invest2025-main.vercel.app/api/statistics');
    console.log('   2. Проверьте API: https://invest2025-main.vercel.app/api/settings/site');
    console.log('   3. Проверьте API: https://invest2025-main.vercel.app/api/testimonials');
    console.log('\n✨ Все готово к работе!');
  } else {
    console.log('\n❌ Не удалось выполнить настройку базы данных');
    console.log('📖 Попробуйте выполнить SQL вручную в Supabase SQL Editor');
    console.log('📄 Файл: supabase-setup.sql');
    process.exit(1);
  }
}).catch(error => {
  console.error('❌ Критическая ошибка:', error);
  process.exit(1);
});

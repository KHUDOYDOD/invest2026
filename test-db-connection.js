const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

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

const connectionString = envVars.POSTGRES_URL_NON_POOLING;

console.log('🔍 Тестирование подключения к базе данных...\n');

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Подключение установлено\n');
    
    // Test platform_statistics table
    console.log('📊 Проверка таблицы platform_statistics:');
    const statsResult = await client.query('SELECT * FROM platform_statistics LIMIT 1');
    if (statsResult.rows.length > 0) {
      console.log('✅ Таблица существует, данные найдены:');
      console.log(JSON.stringify(statsResult.rows[0], null, 2));
    } else {
      console.log('⚠️  Таблица существует, но данных нет');
    }
    console.log('');
    
    // Test site_settings table
    console.log('⚙️  Проверка таблицы site_settings:');
    const settingsResult = await client.query('SELECT * FROM site_settings LIMIT 3');
    if (settingsResult.rows.length > 0) {
      console.log(`✅ Таблица существует, найдено ${settingsResult.rows.length} настроек`);
      settingsResult.rows.forEach(row => {
        console.log(`  • ${row.setting_key}: ${row.setting_value}`);
      });
    } else {
      console.log('⚠️  Таблица существует, но данных нет');
    }
    console.log('');
    
    // Test testimonials table
    console.log('💬 Проверка таблицы testimonials:');
    const testimonialsResult = await client.query('SELECT COUNT(*) as count FROM testimonials');
    console.log(`✅ Таблица существует, записей: ${testimonialsResult.rows[0].count}`);
    console.log('');
    
    // List all tables
    console.log('📋 Все таблицы в базе данных:');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    tablesResult.rows.forEach(row => {
      console.log(`  • ${row.table_name}`);
    });
    
    client.release();
    await pool.end();
    
    console.log('\n✅ Все проверки пройдены!');
    console.log('\n💡 Если API всё ещё не работают, проблема может быть в:');
    console.log('   1. Кэше Vercel (подождите 1-2 минуты)');
    console.log('   2. Переменных окружения на Vercel');
    console.log('   3. Логах Vercel (проверьте детальные ошибки)');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    if (error.code) {
      console.error('   Код:', error.code);
    }
    await pool.end();
  }
}

testConnection();

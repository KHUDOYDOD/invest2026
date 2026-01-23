// Скрипт для проверки переменных окружения на сервере
require('dotenv').config({ path: '.env.production' });
const { Pool } = require('pg');

console.log('🔍 Проверяем переменные окружения...\n');

// Проверяем основные переменные
const envVars = [
  'DATABASE_URL',
  'POSTGRES_URL',
  'POSTGRES_URL_NON_POOLING',
  'JWT_SECRET',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'NODE_ENV'
];

envVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    if (varName.includes('DATABASE') || varName.includes('POSTGRES')) {
      // Скрываем пароль в строке подключения
      const maskedValue = value.replace(/:([^:@]+)@/, ':***@');
      console.log(`✅ ${varName}: ${maskedValue}`);
    } else if (varName.includes('SECRET')) {
      console.log(`✅ ${varName}: ${'*'.repeat(value.length)}`);
    } else {
      console.log(`✅ ${varName}: ${value}`);
    }
  } else {
    console.log(`❌ ${varName}: НЕ УСТАНОВЛЕНА`);
  }
});

console.log('\n🔍 Тестируем подключение к базе данных...\n');

async function testDatabaseConnection() {
  const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL || process.env.POSTGRES_URL;
  
  if (!connectionString) {
    console.log('❌ Нет строки подключения к базе данных!');
    return;
  }

  const pool = new Pool({ 
    connectionString,
    ssl: connectionString?.includes('sslmode=require') ? { rejectUnauthorized: false } : false
  });

  try {
    const client = await pool.connect();
    console.log('✅ Подключение к базе данных успешно!');
    
    // Проверяем основные таблицы
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log(`\n📋 Найдено таблиц: ${tablesResult.rows.length}`);
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.log(`❌ Ошибка подключения к базе данных: ${error.message}`);
  }
}

testDatabaseConnection();
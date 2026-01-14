const https = require('https');
const fs = require('fs');
const path = require('path');

// Supabase credentials
const SUPABASE_EMAIL = 'Xx453925x@gmail.com';
const SUPABASE_PASSWORD = '$X11021997x$';

// Read .env.local file
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
const SUPABASE_URL = envVars.SUPABASE_URL;
const SERVICE_ROLE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;

console.log('🚀 Автоматическое выполнение SQL в Supabase...\n');
console.log('📍 Project:', PROJECT_REF);
console.log('📧 Email:', SUPABASE_EMAIL);
console.log('');

// Read SQL from file
const sqlFile = fs.readFileSync(path.join(__dirname, 'supabase-setup.sql'), 'utf8');

// Extract SQL commands (remove comments and split by semicolons)
const sqlCommands = sqlFile
  .split('\n')
  .filter(line => !line.trim().startsWith('--') && line.trim().length > 0)
  .join('\n')
  .split(';')
  .map(cmd => cmd.trim())
  .filter(cmd => cmd.length > 0);

console.log(`📝 Найдено ${sqlCommands.length} SQL команд для выполнения\n`);

// Use Service Role Key to execute SQL directly
async function executeSQLDirect() {
  const { Pool } = require('pg');
  
  // Try direct connection to database host (not pooler)
  console.log('🔌 Подключение к PostgreSQL (прямое соединение)...');
  
  const pool = new Pool({
    host: envVars.POSTGRES_HOST,
    port: 5432,
    database: 'postgres',
    user: `postgres.${PROJECT_REF}`,
    password: envVars.POSTGRES_PASSWORD,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    console.log('✅ Соединение установлено\n');
    
    console.log('🚀 Выполнение SQL команд...\n');
    
    // Execute full SQL script at once
    await client.query(sqlFile);
    
    console.log('✅ Все SQL команды выполнены успешно!\n');
    
    // Verify tables
    console.log('📊 Проверка созданных таблиц:\n');
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
    
    if (result.rows.length > 0) {
      console.log('Созданные таблицы:');
      result.rows.forEach(row => {
        console.log(`  ✓ ${row.table_name} (${row.column_count} колонок)`);
      });
    } else {
      console.log('⚠️  Таблицы не найдены. Возможно, они уже существовали.');
    }
    
    client.release();
    await pool.end();
    
    console.log('\n🎉 Настройка базы данных завершена!\n');
    console.log('📝 Проверьте API эндпоинты:');
    console.log('  • https://invest2025-main.vercel.app/api/statistics');
    console.log('  • https://invest2025-main.vercel.app/api/settings/site');
    console.log('  • https://invest2025-main.vercel.app/api/testimonials\n');
    
    return true;
    
  } catch (error) {
    console.error('❌ Ошибка при выполнении SQL:', error.message);
    if (error.code) {
      console.error('   Код ошибки:', error.code);
    }
    await pool.end();
    return false;
  }
}

// Execute
executeSQLDirect().then(success => {
  if (success) {
    console.log('✅ Готово! Запустите проверку:');
    console.log('   node check-api-endpoints.js\n');
  } else {
    console.log('\n⚠️  Автоматическое выполнение не удалось.');
    console.log('📝 Выполните SQL вручную через Supabase Dashboard:');
    console.log('   https://supabase.com/dashboard/project/kdfxytlaxrcrtsxvqilg/sql/new\n');
  }
  process.exit(success ? 0 : 1);
});

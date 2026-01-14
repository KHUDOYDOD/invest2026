const { Client } = require('pg');
const fs = require('fs');

// Читаем .env.local файл вручную
function loadEnv() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const lines = envContent.split('\n');
    const env = {};
    
    lines.forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        env[key] = value;
      }
    });
    
    return env;
  } catch (error) {
    console.error('❌ Не удалось прочитать .env.local:', error.message);
    return null;
  }
}

async function createTables() {
  const env = loadEnv();
  if (!env || !env.DATABASE_URL) {
    console.error('❌ DATABASE_URL не найден в .env.local');
    return;
  }

  const client = new Client({
    connectionString: env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('✅ Подключено к базе данных\n');
    
    console.log('📝 Создание таблиц messages, notifications, notification_preferences...\n');
    
    const sql = fs.readFileSync('scripts/create-messages-tables-fixed.sql', 'utf8');
    await client.query(sql);
    
    console.log('✅ Таблицы успешно созданы!\n');
    
    // Verify tables were created
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name IN ('messages', 'notifications', 'notification_preferences')
      ORDER BY table_name
    `);
    
    console.log('📋 Созданные таблицы:');
    tables.rows.forEach(row => {
      console.log(`   ✅ ${row.table_name}`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await client.end();
  }
}

createTables();

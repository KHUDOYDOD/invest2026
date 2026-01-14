const { Pool } = require('pg');
const fs = require('fs');

function getDatabaseUrl() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const match = envContent.match(/DATABASE_URL=(.+)/);
    return match ? match[1].trim() : null;
  } catch (error) {
    return null;
  }
}

async function checkTables() {
  const databaseUrl = getDatabaseUrl();
  const pool = new Pool({ connectionString: databaseUrl });

  try {
    console.log('📊 Проверка таблиц для планов...\n');
    
    // Проверяем обе таблицы
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('investment_plans', 'profit_settings')
      ORDER BY table_name
    `);
    
    console.log('Найденные таблицы:');
    tables.rows.forEach(row => {
      console.log(`  ✓ ${row.table_name}`);
    });
    
    // Проверяем структуру investment_plans
    if (tables.rows.some(r => r.table_name === 'investment_plans')) {
      console.log('\n📋 Структура investment_plans:');
      const cols = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'investment_plans'
        ORDER BY ordinal_position
      `);
      cols.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type}`);
      });
      
      const count = await pool.query('SELECT COUNT(*) FROM investment_plans');
      console.log(`  Записей: ${count.rows[0].count}`);
    }
    
    // Проверяем структуру profit_settings
    if (tables.rows.some(r => r.table_name === 'profit_settings')) {
      console.log('\n📋 Структура profit_settings:');
      const cols = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'profit_settings'
        ORDER BY ordinal_position
      `);
      cols.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type}`);
      });
      
      const count = await pool.query('SELECT COUNT(*) FROM profit_settings');
      console.log(`  Записей: ${count.rows[0].count}`);
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

checkTables();

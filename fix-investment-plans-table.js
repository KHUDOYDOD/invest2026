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

async function fixTable() {
  const databaseUrl = getDatabaseUrl();
  const pool = new Pool({ connectionString: databaseUrl });

  try {
    console.log('🔧 Исправление таблицы investment_plans...\n');
    
    // Проверяем структуру
    const cols = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'investment_plans'
      ORDER BY ordinal_position
    `);
    
    console.log('Текущие поля:');
    cols.rows.forEach(col => console.log(`  - ${col.column_name}`));
    
    // Добавляем недостающие поля
    const fieldsToAdd = [
      { name: 'updated_at', type: 'TIMESTAMP DEFAULT NOW()' },
      { name: 'payout_interval_hours', type: 'INTEGER DEFAULT 24' }
    ];
    
    for (const field of fieldsToAdd) {
      const exists = cols.rows.some(col => col.column_name === field.name);
      if (!exists) {
        await pool.query(`ALTER TABLE investment_plans ADD COLUMN ${field.name} ${field.type}`);
        console.log(`✅ Добавлено поле: ${field.name}`);
      }
    }
    
    // Проверяем данные
    const data = await pool.query('SELECT id, name, min_amount, max_amount, daily_profit, duration_days FROM investment_plans');
    console.log(`\n📊 Найдено тарифов: ${data.rows.length}`);
    data.rows.forEach(row => {
      console.log(`  ${row.id}. ${row.name} - $${row.min_amount}-$${row.max_amount} (${row.daily_profit}% × ${row.duration_days}д)`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

fixTable();

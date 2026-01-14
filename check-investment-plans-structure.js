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

async function checkStructure() {
  const databaseUrl = getDatabaseUrl();
  const pool = new Pool({ connectionString: databaseUrl });

  try {
    console.log('📊 Проверка структуры таблицы investment_plans...\n');
    
    // Получаем структуру таблицы
    const structure = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'investment_plans'
      ORDER BY ordinal_position;
    `);
    
    console.log('Колонки таблицы investment_plans:');
    console.log('─'.repeat(80));
    structure.rows.forEach(col => {
      console.log(`${col.column_name} | ${col.data_type} | Nullable: ${col.is_nullable}`);
    });
    console.log('─'.repeat(80));
    
    // Проверяем данные
    const data = await pool.query(`
      SELECT * FROM investment_plans LIMIT 1;
    `);
    
    if (data.rows.length > 0) {
      console.log('\nПример данных:');
      console.log(JSON.stringify(data.rows[0], null, 2));
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

checkStructure();

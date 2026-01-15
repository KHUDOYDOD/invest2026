const { Pool } = require('pg');

async function checkColumns() {
  const databaseUrl = 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require';

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Проверяем структуру таблицы investment_plans...\n');

    // Проверяем структуру таблицы
    const structure = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'investment_plans'
      ORDER BY ordinal_position
    `);

    console.log('Колонки таблицы investment_plans:');
    structure.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });
    console.log('');

    // Проверяем данные
    const data = await pool.query('SELECT * FROM investment_plans LIMIT 1');
    
    if (data.rows.length > 0) {
      console.log('Пример данных:');
      console.log(data.rows[0]);
    }

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

checkColumns();

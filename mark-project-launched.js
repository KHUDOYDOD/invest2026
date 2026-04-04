const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function markProjectLaunched() {
  try {
    // Отмечаем проект как запущенный
    const result = await pool.query(`
      UPDATE project_launches 
      SET is_launched = true 
      WHERE name = 'test-launch-2026'
      RETURNING *
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Проект отмечен как запущенный:', result.rows[0].title);
      console.log('📅 Дата запуска:', new Date(result.rows[0].launch_date).toLocaleString('ru-RU'));
    } else {
      console.log('❌ Проект не найден');
    }
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

markProjectLaunched();
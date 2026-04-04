const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function markAsLaunched() {
  try {
    const result = await pool.query(`
      UPDATE project_launches 
      SET is_launched = true
      WHERE name = 'platform-launch'
      RETURNING *
    `);
    
    console.log('✅ Проект помечен как запущенный!');
    console.log('\nОбновлённый проект:');
    console.log('ID:', result.rows[0].id);
    console.log('Название:', result.rows[0].title);
    console.log('Запущен:', result.rows[0].is_launched);
    console.log('Показывать на сайте:', result.rows[0].show_on_site);
    console.log('Активен:', result.rows[0].is_active);
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

markAsLaunched();

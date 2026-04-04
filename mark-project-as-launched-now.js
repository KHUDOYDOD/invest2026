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
      WHERE id = 'cdcc8b6c-0853-415d-b385-0847f7e35e2e'
      RETURNING *
    `);
    
    console.log('✅ Проект помечен как запущенный!');
    console.log('Теперь весь блок исчезнет с главной страницы.');
    console.log('\nОбновите страницу (Ctrl+F5) чтобы увидеть изменения.');
    
  } catch (error) {
    console.error('Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

markAsLaunched();

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function setCountdown() {
  try {
    // Устанавливаем таймер на 30 секунд от текущего времени
    const now = new Date();
    const countdownEnd = new Date(now.getTime() + 30 * 1000); // +30 секунд
    
    const result = await pool.query(`
      UPDATE project_launches 
      SET 
        countdown_end = $1,
        is_launched = false,
        show_countdown = true
      WHERE name = 'platform-launch'
      RETURNING *
    `, [countdownEnd]);
    
    console.log('✅ Таймер установлен на 30 секунд!');
    console.log('Текущее время:', now.toLocaleString('ru-RU'));
    console.log('Конец таймера:', countdownEnd.toLocaleString('ru-RU'));
    console.log('\nОбновлённый проект:');
    console.log(result.rows[0]);
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

setCountdown();

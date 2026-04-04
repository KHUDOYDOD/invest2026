const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('neon.tech') ? { rejectUnauthorized: false } : false
});

async function setCountdownTest() {
  try {
    console.log('🕐 Устанавливаем обратный отсчет на 2 минуты...');
    
    // Устанавливаем время запуска через 2 минуты от текущего момента
    const now = new Date();
    const countdownEnd = new Date(now.getTime() + 2 * 60 * 1000); // +2 минуты
    
    const result = await pool.query(`
      UPDATE project_launches 
      SET is_launched = false,
          show_countdown = true,
          countdown_end = $1,
          updated_at = NOW()
      WHERE name = 'platform-launch'
      RETURNING *
    `, [countdownEnd]);
    
    if (result.rows.length > 0) {
      console.log('✅ Обратный отсчет установлен:');
      console.log('   Текущее время:', now.toLocaleString('ru-RU'));
      console.log('   Время запуска:', countdownEnd.toLocaleString('ru-RU'));
      console.log('   Осталось: 2 минуты');
      console.log('\n📊 Данные проекта:', result.rows[0]);
    } else {
      console.log('❌ Проект не найден');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await pool.end();
  }
}

setCountdownTest();

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false }
});

async function setCountdownActive() {
  try {
    console.log('🔄 Устанавливаем проект в режим обратного отсчёта...\n');
    
    // Устанавливаем is_launched = false и countdown_end на 5 минут вперёд
    const countdownEnd = new Date(Date.now() + 5 * 60 * 1000); // 5 минут
    
    const result = await pool.query(`
      UPDATE project_launches 
      SET 
        is_launched = false,
        show_countdown = true,
        countdown_end = $1,
        updated_at = NOW()
      WHERE id = (SELECT id FROM project_launches ORDER BY created_at DESC LIMIT 1)
      RETURNING *
    `, [countdownEnd]);
    
    if (result.rows.length > 0) {
      const project = result.rows[0];
      console.log('✅ Проект переведён в режим обратного отсчёта!');
      console.log('\n📊 Данные проекта:');
      console.log('ID:', project.id);
      console.log('Название:', project.name);
      console.log('Запущен:', project.is_launched);
      console.log('Показывать обратный отсчёт:', project.show_countdown);
      console.log('Конец обратного отсчёта:', project.countdown_end);
      console.log('\n⏰ Обратный отсчёт установлен на 5 минут');
      console.log('🌐 Откройте сайт и очистите кэш (Ctrl+Shift+Delete)');
    } else {
      console.log('❌ Проект не найден');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

setCountdownActive();

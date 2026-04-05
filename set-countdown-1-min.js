const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false }
});

async function setCountdown() {
  try {
    console.log('🔄 Устанавливаем обратный отсчёт на 1 минуту...\n');
    
    // Устанавливаем countdown_end на 1 минуту вперёд
    const countdownEnd = new Date(Date.now() + (1 * 60 * 1000)); // 1 минута
    
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
      console.log('✅ Обратный отсчёт установлен!');
      console.log('\n📊 Данные проекта:');
      console.log('ID:', project.id);
      console.log('Название:', project.name);
      console.log('Запущен:', project.is_launched);
      console.log('Показывать обратный отсчёт:', project.show_countdown);
      console.log('Конец обратного отсчёта:', project.countdown_end);
      
      // Вычисляем оставшееся время
      const now = new Date();
      const end = new Date(project.countdown_end);
      const diff = end - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      console.log('\n⏰ Оставшееся время:');
      console.log(`   ${hours} часов ${minutes} минут ${seconds} секунд`);
      console.log('\n🌐 Откройте сайт и очистите кэш (Ctrl+Shift+Delete)');
      console.log('   http://213.171.31.215');
      console.log('\n✨ Будет показываться 3 карточки: Часов, Минут, Секунд (без дней)');
    } else {
      console.log('❌ Проект не найден');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

setCountdown();

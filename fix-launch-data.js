const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function fixLaunchData() {
  try {
    // Устанавливаем дату запуска на завтра в 12:00
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12, 0, 0, 0);
    
    // Конец таймера - за 1 час до запуска
    const countdownEnd = new Date(tomorrow);
    countdownEnd.setHours(11, 0, 0, 0);
    
    const result = await pool.query(`
      UPDATE project_launches 
      SET 
        name = 'InvestPro Platform',
        title = 'Запуск платформы InvestPro',
        description = 'Новая инвестиционная платформа с высокой доходностью и надежной защитой ваших средств',
        launch_date = $1,
        countdown_end = $2,
        is_launched = false,
        is_active = true,
        show_on_site = true,
        show_countdown = true
      WHERE id = 'cdcc8b6c-0853-415d-b385-0847f7e35e2e'
      RETURNING *
    `, [tomorrow, countdownEnd]);
    
    console.log('✅ Данные проекта обновлены!');
    console.log('\nНовые данные:');
    console.log('Название:', result.rows[0].title);
    console.log('Описание:', result.rows[0].description);
    console.log('Дата запуска:', result.rows[0].launch_date);
    console.log('Конец таймера:', result.rows[0].countdown_end);
    console.log('\nТеперь на сайте будет показываться обратный отсчет до запуска!');
    
  } catch (error) {
    console.error('Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

fixLaunchData();

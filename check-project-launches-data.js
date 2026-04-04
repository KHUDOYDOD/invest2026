const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function checkLaunches() {
  try {
    const result = await pool.query(`
      SELECT 
        id, name, title, description, 
        launch_date, countdown_end, 
        is_launched, is_active, show_on_site, show_countdown
      FROM project_launches 
      ORDER BY position
    `);
    
    console.log('=== ЗАПУСКИ ПРОЕКТОВ В БАЗЕ ДАННЫХ ===\n');
    
    result.rows.forEach((row, index) => {
      console.log(`Проект ${index + 1}:`);
      console.log(`  ID: ${row.id}`);
      console.log(`  Название: ${row.name}`);
      console.log(`  Заголовок: ${row.title}`);
      console.log(`  Описание: ${row.description}`);
      console.log(`  Дата запуска: ${row.launch_date}`);
      console.log(`  Конец таймера: ${row.countdown_end}`);
      console.log(`  Запущен: ${row.is_launched}`);
      console.log(`  Активен: ${row.is_active}`);
      console.log(`  Показывать на сайте: ${row.show_on_site}`);
      console.log(`  Показывать таймер: ${row.show_countdown}`);
      console.log('---\n');
    });
    
    const activeNotLaunched = result.rows.filter(r => r.is_active && r.show_on_site && !r.is_launched);
    console.log(`\n=== АКТИВНЫЕ ПРОЕКТЫ (ПОКАЗЫВАЮТСЯ НА ГЛАВНОЙ) ===`);
    console.log(`Количество: ${activeNotLaunched.length}\n`);
    
    activeNotLaunched.forEach((row, index) => {
      console.log(`${index + 1}. ${row.title}`);
      console.log(`   ${row.description}`);
    });
    
  } catch (error) {
    console.error('Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

checkLaunches();

const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function setupProjectLaunches() {
  try {
    console.log('🚀 Настройка таблицы project_launches...');
    
    // Читаем SQL файл
    const sql = fs.readFileSync('create-project-launches-table.sql', 'utf8');
    
    // Выполняем SQL
    await pool.query(sql);
    
    console.log('✅ Таблица project_launches создана успешно!');
    
    // Проверяем созданные данные
    const result = await pool.query(`
      SELECT 
        id, name, title, description, 
        launch_date, countdown_end, is_launched, 
        show_countdown, icon_type, color_scheme
      FROM project_launches 
      ORDER BY position, launch_date
    `);
    
    console.log('📊 Созданные запуски проектов:');
    result.rows.forEach((launch, index) => {
      console.log(`${index + 1}. ${launch.title}`);
      console.log(`   Описание: ${launch.description}`);
      console.log(`   Дата запуска: ${new Date(launch.launch_date).toLocaleString('ru-RU')}`);
      console.log(`   Обратный отсчет: ${launch.show_countdown ? 'Включен' : 'Отключен'}`);
      console.log(`   Цветовая схема: ${launch.color_scheme}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Ошибка при настройке project_launches:', error);
  } finally {
    await pool.end();
  }
}

setupProjectLaunches();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function testProjectLaunches() {
  try {
    console.log('🚀 Тестирование системы запусков проектов...\n');
    
    // 1. Проверяем таблицу project_launches
    console.log('1. Проверка таблицы project_launches:');
    const result = await pool.query(`
      SELECT 
        id, name, title, description, 
        launch_date, countdown_end, is_launched, 
        show_countdown, icon_type, color_scheme,
        is_active, show_on_site
      FROM project_launches 
      ORDER BY position, launch_date
    `);
    
    console.log(`   ✅ Найдено ${result.rows.length} запусков проектов:`);
    result.rows.forEach((launch, index) => {
      console.log(`   ${index + 1}. ${launch.title}`);
      console.log(`      Описание: ${launch.description}`);
      console.log(`      Дата запуска: ${new Date(launch.launch_date).toLocaleString('ru-RU')}`);
      console.log(`      Обратный отсчет: ${launch.show_countdown ? 'Включен' : 'Отключен'}`);
      console.log(`      Статус: ${launch.is_launched ? 'Запущен' : 'Ожидает'}`);
      console.log(`      Показывается на сайте: ${launch.show_on_site ? 'Да' : 'Нет'}`);
      console.log(`      Цветовая схема: ${launch.color_scheme}`);
      console.log(`      Иконка: ${launch.icon_type}`);
      console.log('');
    });
    
    // 2. Тестируем API
    console.log('2. Тестирование API /api/admin/project-launches:');
    const fetch = (await import('node-fetch')).default;
    
    try {
      const response = await fetch('http://213.171.31.215/api/admin/project-launches');
      if (response.ok) {
        const apiData = await response.json();
        console.log(`   ✅ API работает! Получено ${apiData.length} запусков`);
        
        apiData.forEach((launch, index) => {
          console.log(`   ${index + 1}. ${launch.title} (${launch.color_scheme})`);
        });
      } else {
        console.log(`   ❌ API ошибка: ${response.status} ${response.statusText}`);
      }
    } catch (apiError) {
      console.log(`   ❌ Ошибка подключения к API: ${apiError.message}`);
    }
    
    // 3. Проверяем расчет времени до запуска
    console.log('\n3. Проверка обратного отсчета:');
    const now = new Date();
    result.rows.forEach((launch) => {
      if (!launch.is_launched && launch.countdown_end) {
        const timeLeft = new Date(launch.countdown_end) - now;
        if (timeLeft > 0) {
          const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
          
          console.log(`   ⏰ ${launch.title}: ${days} дней, ${hours} часов, ${minutes} минут`);
        } else {
          console.log(`   ⏰ ${launch.title}: Время истекло!`);
        }
      }
    });
    
    console.log('\n✅ Тестирование завершено успешно!');
    console.log('\n📋 Инструкции:');
    console.log('   • Откройте http://213.171.31.215 - запуски отображаются на главной странице');
    console.log('   • Откройте http://213.171.31.215/admin/project-launches - управление запусками');
    console.log('   • Логин админа: admin@example.com');
    console.log('   • Пароль админа: X11021997x');
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error);
  } finally {
    await pool.end();
  }
}

testProjectLaunches();
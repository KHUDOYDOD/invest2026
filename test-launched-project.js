const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
});

async function testLaunchedProject() {
  try {
    console.log('🔍 Проверка запущенных проектов...\n');
    
    // Проверяем все проекты
    const allProjects = await pool.query(`
      SELECT id, name, title, is_launched, show_on_site, is_active, launch_date
      FROM project_launches
      ORDER BY position
    `);
    
    console.log('📊 Все проекты в базе:');
    console.log('='.repeat(80));
    allProjects.rows.forEach(project => {
      console.log(`
ID: ${project.id}
Название: ${project.name}
Заголовок: ${project.title}
Запущен: ${project.is_launched ? '✅ ДА' : '❌ НЕТ'}
Показывать на сайте: ${project.show_on_site ? '✅ ДА' : '❌ НЕТ'}
Активен: ${project.is_active ? '✅ ДА' : '❌ НЕТ'}
Дата запуска: ${project.launch_date}
${'='.repeat(80)}`);
    });
    
    // Проверяем запущенные проекты
    const launchedProjects = await pool.query(`
      SELECT id, name, title, launch_date
      FROM project_launches
      WHERE is_launched = true 
        AND show_on_site = true 
        AND is_active = true
      ORDER BY position
    `);
    
    console.log('\n🎉 Запущенные проекты (которые должны показываться):');
    console.log('='.repeat(80));
    if (launchedProjects.rows.length === 0) {
      console.log('❌ НЕТ ЗАПУЩЕННЫХ ПРОЕКТОВ');
      console.log('\n💡 Чтобы компонент показался, нужно:');
      console.log('1. Зайти в админ-панель: http://213.171.31.215/admin/project-launches');
      console.log('2. Создать проект или отметить существующий как "Запущен"');
      console.log('3. Убедиться что галочки "Показывать на сайте" и "Активен" включены');
    } else {
      launchedProjects.rows.forEach(project => {
        console.log(`
✅ ${project.title}
   ID: ${project.id}
   Название: ${project.name}
   Дата запуска: ${new Date(project.launch_date).toLocaleString('ru-RU')}
${'='.repeat(80)}`);
      });
      console.log(`\n✅ Найдено запущенных проектов: ${launchedProjects.rows.length}`);
      console.log('✅ Компонент ДОЛЖЕН показываться на главной странице');
    }
    
    // Тестируем API
    console.log('\n🔌 Тестирование API...');
    const apiTest = await pool.query(`
      SELECT COUNT(*) as count
      FROM project_launches
      WHERE is_launched = true 
        AND show_on_site = true 
        AND is_active = true
    `);
    console.log(`API вернет ${apiTest.rows[0].count} проектов`);
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

testLaunchedProject();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function testCompactNotification() {
  try {
    console.log('🔧 Тестируем компактное уведомление...\n');
    
    // Скрываем активный проект, чтобы остался только запущенный
    const result = await pool.query(`
      UPDATE project_launches 
      SET show_on_site = false 
      WHERE name = 'test-active-project-2026'
      RETURNING title, show_on_site
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Активный проект скрыт:', result.rows[0].title);
    }
    
    // Проверяем состояние
    const allProjects = await pool.query(`
      SELECT 
        title, 
        is_launched, 
        is_active, 
        show_on_site
      FROM project_launches 
      WHERE show_on_site = true AND is_active = true
      ORDER BY position
    `);
    
    console.log('📊 Видимые проекты:');
    allProjects.rows.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} - ${project.is_launched ? '🚀 Запущен' : '⏳ Активен'}`);
    });
    
    const activeLaunches = allProjects.rows.filter(p => !p.is_launched);
    const launchedProjects = allProjects.rows.filter(p => p.is_launched);
    
    console.log('');
    console.log('🎯 Результат:');
    console.log(`⏳ Активных проектов: ${activeLaunches.length}`);
    console.log(`🚀 Запущенных проектов: ${launchedProjects.length}`);
    
    if (activeLaunches.length === 0 && launchedProjects.length > 0) {
      console.log('✅ ОЖИДАЕТСЯ: Компактное уведомление');
      console.log('   "🚀 Проекты успешно запущены! Платформа InvestPro работает в полном режиме"');
    } else if (allProjects.rows.length === 0) {
      console.log('✅ ОЖИДАЕТСЯ: Сообщение готовности');
    } else {
      console.log('✅ ОЖИДАЕТСЯ: Полный компонент');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

testCompactNotification();
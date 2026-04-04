const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function createTestActiveProject() {
  try {
    console.log('🔧 Создаем тестовый активный проект...\n');
    
    // Создаем новый активный проект (не запущенный)
    const result = await pool.query(`
      INSERT INTO project_launches (
        name,
        title,
        description,
        launch_date,
        countdown_end,
        is_launched,
        is_active,
        show_on_site,
        show_countdown,
        position,
        icon_type,
        background_type,
        color_scheme
      ) VALUES (
        'test-active-project-2026',
        'Тестовый активный проект',
        'Этот проект должен показываться в полном компоненте',
        '2026-02-15T15:00:00Z',
        '2026-02-15T15:00:00Z',
        false,
        true,
        true,
        true,
        2,
        'zap',
        'gradient',
        'green'
      )
      RETURNING *
    `);
    
    console.log('✅ Тестовый проект создан:', result.rows[0].title);
    console.log('📅 Дата запуска:', new Date(result.rows[0].launch_date).toLocaleString('ru-RU'));
    console.log('🚀 Запущен:', result.rows[0].is_launched ? 'Да' : 'Нет');
    console.log('');
    
    // Проверяем все проекты
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
    
    console.log('📊 Все видимые проекты:');
    allProjects.rows.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} - ${project.is_launched ? '🚀 Запущен' : '⏳ Активен'}`);
    });
    
    const activeLaunches = allProjects.rows.filter(p => !p.is_launched);
    const launchedProjects = allProjects.rows.filter(p => p.is_launched);
    
    console.log('');
    console.log('🎯 Ожидаемый результат:');
    console.log(`⏳ Активных проектов: ${activeLaunches.length}`);
    console.log(`🚀 Запущенных проектов: ${launchedProjects.length}`);
    
    if (activeLaunches.length > 0) {
      console.log('✅ Должен показываться ПОЛНЫЙ компонент с активными проектами');
    } else if (launchedProjects.length > 0) {
      console.log('✅ Должно показываться компактное уведомление');
    } else {
      console.log('✅ Должно показываться сообщение готовности');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

createTestActiveProject();
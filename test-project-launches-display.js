const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function testProjectLaunchesDisplay() {
  try {
    console.log('🔍 Проверяем состояние проектов запуска...\n');
    
    // Получаем все проекты
    const result = await pool.query(`
      SELECT 
        name, 
        title, 
        is_launched, 
        is_active, 
        show_on_site,
        launch_date
      FROM project_launches 
      ORDER BY position
    `);
    
    if (result.rows.length === 0) {
      console.log('❌ Нет проектов в базе данных');
      return;
    }
    
    console.log('📊 Все проекты:');
    result.rows.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`);
      console.log(`   - Запущен: ${project.is_launched ? '✅ Да' : '❌ Нет'}`);
      console.log(`   - Активен: ${project.is_active ? '✅ Да' : '❌ Нет'}`);
      console.log(`   - Показывать на сайте: ${project.show_on_site ? '✅ Да' : '❌ Нет'}`);
      console.log(`   - Дата запуска: ${new Date(project.launch_date).toLocaleString('ru-RU')}`);
      console.log('');
    });
    
    // Фильтруем активные проекты (показываются на сайте и активны)
    const visibleProjects = result.rows.filter(p => p.show_on_site && p.is_active);
    const activeLaunches = visibleProjects.filter(p => !p.is_launched);
    const launchedProjects = visibleProjects.filter(p => p.is_launched);
    
    console.log('🎯 Анализ отображения:');
    console.log(`📋 Всего видимых проектов: ${visibleProjects.length}`);
    console.log(`⏳ Активных (не запущенных): ${activeLaunches.length}`);
    console.log(`🚀 Запущенных: ${launchedProjects.length}`);
    console.log('');
    
    if (activeLaunches.length === 0 && launchedProjects.length > 0) {
      console.log('✅ РЕЗУЛЬТАТ: Должно показываться КОМПАКТНОЕ УВЕДОМЛЕНИЕ');
      console.log('   "🚀 Проекты успешно запущены! Платформа InvestPro работает в полном режиме"');
    } else if (visibleProjects.length === 0) {
      console.log('✅ РЕЗУЛЬТАТ: Должно показываться сообщение "🚀 Платформа InvestPro готова!"');
    } else {
      console.log('✅ РЕЗУЛЬТАТ: Должен показываться ПОЛНЫЙ компонент с активными проектами');
      console.log('   Активные проекты:');
      activeLaunches.forEach(project => {
        console.log(`   - ${project.title}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

testProjectLaunchesDisplay();
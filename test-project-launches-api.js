const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function testProjectLaunchesAPI() {
  try {
    console.log('🔍 Тестируем API проектов запуска...\n');
    
    // Получаем проекты из базы данных
    const result = await pool.query(`
      SELECT 
        id,
        name, 
        title, 
        description,
        is_launched, 
        is_active, 
        show_on_site,
        launch_date,
        countdown_end,
        show_countdown
      FROM project_launches 
      WHERE show_on_site = true AND is_active = true
      ORDER BY position
    `);
    
    console.log('📊 Проекты из базы данных:');
    result.rows.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`);
      console.log(`   - ID: ${project.id}`);
      console.log(`   - Запущен: ${project.is_launched ? '✅ Да' : '❌ Нет'}`);
      console.log(`   - Активен: ${project.is_active ? '✅ Да' : '❌ Нет'}`);
      console.log(`   - Показывать на сайте: ${project.show_on_site ? '✅ Да' : '❌ Нет'}`);
      console.log(`   - Показывать отсчет: ${project.show_countdown ? '✅ Да' : '❌ Нет'}`);
      console.log('');
    });
    
    // Анализируем что должно показываться
    const activeLaunches = result.rows.filter(p => !p.is_launched);
    const launchedProjects = result.rows.filter(p => p.is_launched);
    
    console.log('🎯 Анализ компонента:');
    console.log(`📋 Всего видимых проектов: ${result.rows.length}`);
    console.log(`⏳ Активных (не запущенных): ${activeLaunches.length}`);
    console.log(`🚀 Запущенных: ${launchedProjects.length}`);
    console.log('');
    
    if (activeLaunches.length === 0 && launchedProjects.length > 0) {
      console.log('✅ ОЖИДАЕМЫЙ РЕЗУЛЬТАТ: Компактное уведомление');
      console.log('   "🚀 Проекты успешно запущены! Платформа InvestPro работает в полном режиме"');
      console.log('   Высота секции: py-4 (минимальная)');
    } else if (result.rows.length === 0) {
      console.log('✅ ОЖИДАЕМЫЙ РЕЗУЛЬТАТ: Сообщение готовности');
      console.log('   "🚀 Платформа InvestPro готова!"');
      console.log('   Высота секции: py-16 (полная)');
    } else {
      console.log('✅ ОЖИДАЕМЫЙ РЕЗУЛЬТАТ: Полный компонент');
      console.log('   Показываются активные проекты с отсчетом');
      console.log('   Высота секции: py-16 (полная)');
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

testProjectLaunchesAPI();
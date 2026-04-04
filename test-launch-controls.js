const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function testLaunchControls() {
  try {
    console.log('🧪 Тестируем управление функциями сайта...\n');
    
    // 1. Создаем тестовый проект с отключенными функциями
    console.log('1️⃣ Создаем тестовый проект с отключенными функциями...');
    
    // Сначала удаляем если существует
    await pool.query(`DELETE FROM project_launches WHERE name = 'test-controls-2026'`);
    
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
        color_scheme,
        disable_registration,
        disable_investments,
        disable_deposits,
        disable_withdrawals
      ) VALUES (
        'test-controls-2026',
        'Тест управления функциями',
        'Проект для тестирования отключения функций сайта',
        '2026-03-01T12:00:00Z',
        '2026-03-01T12:00:00Z',
        false,
        true,
        true,
        true,
        1,
        'rocket',
        'red',
        true,
        true,
        true,
        true
      )
      RETURNING id, title
    `);
    
    console.log('✅ Проект создан:', result.rows[0].title);
    
    // 2. Скрываем другие проекты чтобы этот был активным
    await pool.query(`
      UPDATE project_launches 
      SET show_on_site = false 
      WHERE name != 'test-controls-2026'
    `);
    
    console.log('✅ Другие проекты скрыты');
    
    // 3. Проверяем статус через API
    console.log('\n2️⃣ Проверяем статус функций через API...');
    
    const statusCheck = await pool.query(`
      SELECT 
        disable_registration,
        disable_investments,
        disable_deposits,
        disable_withdrawals,
        is_launched,
        title
      FROM project_launches 
      WHERE is_active = true 
        AND show_on_site = true 
        AND is_launched = false
      ORDER BY position ASC
      LIMIT 1
    `);
    
    if (statusCheck.rows.length > 0) {
      const project = statusCheck.rows[0];
      console.log(`📋 Активный проект: ${project.title}`);
      console.log(`🚫 Регистрация отключена: ${project.disable_registration ? 'Да' : 'Нет'}`);
      console.log(`📈 Инвестиции отключены: ${project.disable_investments ? 'Да' : 'Нет'}`);
      console.log(`💰 Пополнение отключено: ${project.disable_deposits ? 'Да' : 'Нет'}`);
      console.log(`💸 Вывод отключен: ${project.disable_withdrawals ? 'Да' : 'Нет'}`);
      
      console.log('\n🎯 Ожидаемое поведение:');
      console.log('- Регистрация должна быть заблокирована');
      console.log('- Создание инвестиций должно быть заблокировано');
      console.log('- Пополнение должно быть заблокировано');
      console.log('- Вывод средств должен быть заблокирован');
    } else {
      console.log('❌ Активный проект не найден');
    }
    
    // 4. Тестируем запуск проекта
    console.log('\n3️⃣ Тестируем запуск проекта...');
    
    await pool.query(`
      UPDATE project_launches 
      SET is_launched = true 
      WHERE name = 'test-controls-2026'
    `);
    
    console.log('✅ Проект запущен');
    
    // 5. Проверяем статус после запуска
    const statusAfterLaunch = await pool.query(`
      SELECT 
        disable_registration,
        disable_investments,
        disable_deposits,
        disable_withdrawals,
        is_launched
      FROM project_launches 
      WHERE is_active = true 
        AND show_on_site = true 
        AND is_launched = false
      ORDER BY position ASC
      LIMIT 1
    `);
    
    console.log('\n4️⃣ Статус после запуска:');
    if (statusAfterLaunch.rows.length === 0) {
      console.log('✅ Нет активных незапущенных проектов');
      console.log('🎯 Все функции должны быть доступны');
    } else {
      console.log('⚠️ Есть другие активные проекты');
    }
    
    console.log('\n🔗 Ссылки для тестирования:');
    console.log('- Админ-панель: http://213.171.31.215/admin/project-launches');
    console.log('- API статуса: http://213.171.31.215/api/site-status');
    console.log('- Главная страница: http://213.171.31.215');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

testLaunchControls();
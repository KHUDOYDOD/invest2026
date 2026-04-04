const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
});

async function createTestProject() {
  try {
    console.log('🚀 Создание тестового запущенного проекта...\n');
    
    // Создаем запущенный проект
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
        'platform-launch',
        'Платформа InvestPro',
        'Инвестиционная платформа запущена и работает в полном режиме',
        NOW(),
        NOW(),
        true,
        true,
        true,
        false,
        1,
        'rocket',
        'gradient',
        'green'
      )
      RETURNING *
    `);
    
    const project = result.rows[0];
    
    console.log('✅ Проект успешно создан!');
    console.log('='.repeat(80));
    console.log(`ID: ${project.id}`);
    console.log(`Название: ${project.name}`);
    console.log(`Заголовок: ${project.title}`);
    console.log(`Описание: ${project.description}`);
    console.log(`Запущен: ${project.is_launched ? '✅ ДА' : '❌ НЕТ'}`);
    console.log(`Показывать на сайте: ${project.show_on_site ? '✅ ДА' : '❌ НЕТ'}`);
    console.log(`Активен: ${project.is_active ? '✅ ДА' : '❌ НЕТ'}`);
    console.log(`Дата запуска: ${new Date(project.launch_date).toLocaleString('ru-RU')}`);
    console.log('='.repeat(80));
    
    console.log('\n✅ Теперь компонент должен показаться на главной странице!');
    console.log('🌐 Откройте: http://213.171.31.215');
    console.log('💡 Не забудьте очистить кэш: Ctrl+Shift+Delete');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

createTestProject();

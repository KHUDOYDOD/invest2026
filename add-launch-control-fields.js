const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function addLaunchControlFields() {
  try {
    console.log('🔧 Добавляем поля управления функциями сайта...\n');
    
    // Добавляем новые поля
    await pool.query(`
      ALTER TABLE project_launches 
      ADD COLUMN IF NOT EXISTS disable_registration BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS disable_investments BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS disable_deposits BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS disable_withdrawals BOOLEAN DEFAULT false
    `);
    
    console.log('✅ Поля успешно добавлены');
    
    // Проверяем структуру таблицы
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'project_launches' 
      AND column_name IN ('disable_registration', 'disable_investments', 'disable_deposits', 'disable_withdrawals')
      ORDER BY ordinal_position
    `);
    
    console.log('\n📊 Новые поля в таблице:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type} (default: ${row.column_default})`);
    });
    
    // Проверяем текущие проекты
    const projects = await pool.query(`
      SELECT 
        name, 
        title, 
        is_launched,
        disable_registration,
        disable_investments,
        disable_deposits,
        disable_withdrawals
      FROM project_launches 
      ORDER BY position
    `);
    
    console.log('\n📋 Текущие проекты:');
    projects.rows.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`);
      console.log(`   - Запущен: ${project.is_launched ? 'Да' : 'Нет'}`);
      console.log(`   - Регистрация отключена: ${project.disable_registration ? 'Да' : 'Нет'}`);
      console.log(`   - Инвестиции отключены: ${project.disable_investments ? 'Да' : 'Нет'}`);
      console.log(`   - Пополнение отключено: ${project.disable_deposits ? 'Да' : 'Нет'}`);
      console.log(`   - Вывод отключен: ${project.disable_withdrawals ? 'Да' : 'Нет'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

addLaunchControlFields();
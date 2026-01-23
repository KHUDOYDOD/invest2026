const { Pool } = require('pg');

// Правильная строка подключения к Neon
const connectionString = 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString: connectionString,
});

async function checkDatabase() {
  try {
    console.log('🔍 Проверяем подключение к базе данных...');
    
    // Проверяем подключение
    const client = await pool.connect();
    console.log('✅ Подключение к базе данных успешно!');
    
    // Проверяем таблицы
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('\n📋 Существующие таблицы:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Проверяем пользователей
    const usersResult = await client.query('SELECT COUNT(*) as count FROM users');
    console.log(`\n👥 Количество пользователей: ${usersResult.rows[0].count}`);
    
    // Проверяем админов
    const adminsResult = await client.query("SELECT id, email, full_name, role FROM users WHERE role = 'admin'");
    console.log('\n👑 Администраторы:');
    adminsResult.rows.forEach(admin => {
      console.log(`  - ID: ${admin.id}, Email: ${admin.email}, Имя: ${admin.full_name}`);
    });
    
    // Проверяем заявки на пополнение
    const depositResult = await client.query('SELECT COUNT(*) as count FROM deposit_requests');
    console.log(`\n💰 Заявки на пополнение: ${depositResult.rows[0].count}`);
    
    // Проверяем заявки на вывод
    const withdrawalResult = await client.query('SELECT COUNT(*) as count FROM withdrawal_requests');
    console.log(`\n💸 Заявки на вывод: ${withdrawalResult.rows[0].count}`);
    
    client.release();
    
  } catch (error) {
    console.error('❌ Ошибка при проверке базы данных:', error.message);
    
    if (error.message.includes('password authentication failed')) {
      console.log('\n🔑 Проблема с паролем базы данных. Попробуем другие варианты...');
    }
  } finally {
    await pool.end();
  }
}

checkDatabase();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function checkUsers() {
  try {
    console.log('👥 Проверяем пользователей в базе данных...');

    const result = await pool.query(
      'SELECT id, email, full_name, balance FROM users ORDER BY created_at DESC LIMIT 10'
    );

    if (result.rows.length === 0) {
      console.log('❌ Пользователи не найдены');
      return;
    }

    console.log(`✅ Найдено ${result.rows.length} пользователей:`);
    result.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.full_name || 'Без имени'} (${user.email}) - Баланс: $${user.balance}`);
    });

    // Используем первого пользователя для теста
    const testUser = result.rows[0];
    console.log(`\n🎯 Будем использовать для теста: ${testUser.email}`);

    return testUser;

  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await pool.end();
  }
}

checkUsers();
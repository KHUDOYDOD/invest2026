const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function addBalanceToTestUser() {
  try {
    await client.connect();
    console.log('🔗 Подключение к базе данных...');

    // Добавляем баланс пользователю test@example.com
    const result = await client.query(`
      UPDATE users 
      SET balance = 5000.00 
      WHERE email = 'test@example.com'
      RETURNING email, balance
    `);

    if (result.rows.length > 0) {
      console.log(`✅ Баланс обновлен для ${result.rows[0].email}: $${result.rows[0].balance}`);
    } else {
      console.log('❌ Пользователь test@example.com не найден');
    }

    // Проверяем всех пользователей
    const allUsers = await client.query('SELECT email, balance FROM users ORDER BY email');
    console.log('\n👥 Все пользователи:');
    allUsers.rows.forEach(user => {
      console.log(`  📧 ${user.email}: $${user.balance}`);
    });

  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await client.end();
  }
}

addBalanceToTestUser();
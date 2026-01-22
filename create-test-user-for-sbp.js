const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function createTestUser() {
  try {
    console.log('👤 Создание тестового пользователя для СБП...');

    // Проверяем, есть ли уже такой пользователь
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      ['test-sbp@example.com']
    );

    if (existingUser.rows.length > 0) {
      console.log('✅ Тестовый пользователь уже существует');
      return;
    }

    // Используем простой пароль (в реальном проекте так делать нельзя!)
    const simplePassword = '123456';

    // Создаем пользователя
    const result = await pool.query(
      `INSERT INTO users (
        email, password, full_name, balance, role, 
        is_verified, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
      RETURNING id, email, full_name`,
      [
        'test-sbp@example.com',
        simplePassword,
        'Тестовый Пользователь СБП',
        500, // баланс для тестов
        'user',
        true
      ]
    );

    const user = result.rows[0];
    console.log('✅ Тестовый пользователь создан:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Имя: ${user.full_name}`);
    console.log(`   Пароль: 123456`);
    console.log(`   Баланс: $500`);

  } catch (error) {
    console.error('❌ Ошибка создания пользователя:', error);
  } finally {
    await pool.end();
  }
}

createTestUser();
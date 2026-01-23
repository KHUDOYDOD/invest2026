require('dotenv').config({ path: '.env.production' });
const { Pool } = require('pg');

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkUsers() {
  try {
    console.log('🔍 Проверяем пользователей в базе данных...\n');
    
    const result = await pool.query(`
      SELECT id, full_name, email, status, created_at, balance
      FROM users 
      ORDER BY created_at DESC
      LIMIT 10
    `);

    console.log('👥 Найдено пользователей:', result.rows.length);
    console.log('');

    result.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.full_name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Status: ${user.status}`);
      console.log(`   Balance: $${user.balance}`);
      console.log(`   Created: ${new Date(user.created_at).toLocaleDateString()}`);
      console.log('');
    });

    // Проверим, есть ли пароли
    const passwordCheck = await pool.query(`
      SELECT email, 
             CASE 
               WHEN password_hash IS NOT NULL THEN 'HAS_PASSWORD' 
               ELSE 'NO_PASSWORD' 
             END as password_status
      FROM users 
      WHERE status = 'active'
      ORDER BY created_at DESC
    `);

    console.log('🔐 Статус паролей:');
    passwordCheck.rows.forEach(user => {
      console.log(`   ${user.email}: ${user.password_status}`);
    });

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

checkUsers();
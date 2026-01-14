const { Pool } = require('pg');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const env = fs.readFileSync('.env.local', 'utf8');
const dbUrl = env.match(/DATABASE_URL=(.+)/)[1].trim();
const pool = new Pool({ connectionString: dbUrl });

async function resetPassword() {
  try {
    const email = 'salamoni@salamoni.salamoni12';
    const newPassword = '123456';
    
    console.log(`\n🔄 Сброс пароля для: ${email}`);
    console.log(`🔑 Новый пароль: ${newPassword}\n`);
    
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    const result = await pool.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id, email, full_name',
      [passwordHash, email]
    );
    
    if (result.rows.length > 0) {
      console.log('✅ Пароль успешно изменен!');
      console.log(`👤 Пользователь: ${result.rows[0].full_name}`);
      console.log(`📧 Email: ${result.rows[0].email}`);
      console.log(`🔑 Новый пароль: ${newPassword}`);
      console.log('\n📝 Теперь можете войти с этими данными!');
    } else {
      console.log('❌ Пользователь не найден');
    }
    
  } catch (error) {
    console.error('Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

resetPassword();

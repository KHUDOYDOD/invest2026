const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function resetUserPassword() {
  try {
    console.log('=== СБРОС ПАРОЛЯ ПОЛЬЗОВАТЕЛЯ ===');
    
    const email = 'x11021997x@mail.ru';
    const newPassword = 'password123';
    
    // Хэшируем новый пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Обновляем пароль
    const result = await pool.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING email',
      [hashedPassword, email]
    );
    
    if (result.rows.length > 0) {
      console.log(`✅ Пароль обновлен для пользователя: ${result.rows[0].email}`);
      console.log(`🔐 Новый пароль: ${newPassword}`);
      console.log('🎯 Теперь можно войти с этими данными!');
    } else {
      console.log('❌ Пользователь не найден');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

resetUserPassword();
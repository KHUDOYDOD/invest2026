const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function checkUserPassword() {
  try {
    console.log('=== ПРОВЕРКА ПАРОЛЯ ПОЛЬЗОВАТЕЛЯ ===');
    
    const user = await pool.query('SELECT email, password_hash FROM users WHERE email = $1', ['x11021997x@mail.ru']);
    
    if (user.rows.length > 0) {
      console.log('👤 Пользователь найден:', user.rows[0].email);
      console.log('🔐 Хэш пароля:', user.rows[0].password_hash.substring(0, 20) + '...');
      
      // Проверяем разные возможные пароли
      const possiblePasswords = ['X12345x', 'x12345x', 'password', '123456', 'admin123'];
      
      for (const password of possiblePasswords) {
        const isValid = await bcrypt.compare(password, user.rows[0].password_hash);
        console.log(`🔍 Пароль "${password}": ${isValid ? '✅ ВЕРНЫЙ' : '❌ неверный'}`);
        
        if (isValid) {
          console.log(`\n🎉 НАЙДЕН ПРАВИЛЬНЫЙ ПАРОЛЬ: "${password}"`);
          break;
        }
      }
    } else {
      console.log('❌ Пользователь не найден');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

checkUserPassword();
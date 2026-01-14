const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function resetKhojaevPassword() {
  const client = await pool.connect();
  try {
    console.log('🔄 Сброс пароля для пользователя KHOJAEV...\n');
    
    const newPassword = '123456';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const result = await client.query(`
      UPDATE users 
      SET password_hash = $1
      WHERE email = 'x11021997x@mail.ru'
      RETURNING id, email, full_name
    `, [hashedPassword]);
    
    if (result.rows.length === 0) {
      console.log('❌ Пользователь не найден');
      return;
    }
    
    const user = result.rows[0];
    
    console.log('✅ Пароль успешно изменен!\n');
    console.log('=' .repeat(60));
    console.log('📋 ДАННЫЕ ДЛЯ ВХОДА');
    console.log('=' .repeat(60));
    console.log('');
    console.log('👤 Имя:', user.full_name);
    console.log('📧 Email (логин):', user.email);
    console.log('🔑 Пароль:', newPassword);
    console.log('');
    console.log('=' .repeat(60));
    console.log('🌐 Войти: http://localhost:3001/login');
    console.log('=' .repeat(60));
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

resetKhojaevPassword();

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function resetAdminPassword() {
  const client = await pool.connect();
  try {
    console.log('🔄 Сброс пароля администратора...\n');
    
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const result = await client.query(`
      UPDATE users 
      SET password_hash = $1
      WHERE email = 'admin@example.com'
      RETURNING id, email, full_name, role_id
    `, [hashedPassword]);
    
    if (result.rows.length === 0) {
      console.log('❌ Администратор не найден');
      return;
    }
    
    const user = result.rows[0];
    
    console.log('✅ Пароль успешно изменен!\n');
    console.log('=' .repeat(70));
    console.log('📋 ДАННЫЕ ДЛЯ ВХОДА АДМИНИСТРАТОРА');
    console.log('=' .repeat(70));
    console.log('');
    console.log('👤 Имя:', user.full_name);
    console.log('📧 Email (логин):', user.email);
    console.log('🔑 Пароль:', newPassword);
    console.log('👔 Роль:', user.role_id === 1 ? 'Супер Админ' : 'Админ');
    console.log('');
    console.log('=' .repeat(70));
    console.log('🌐 Войти: http://localhost:3001/login');
    console.log('🎛️  Админ панель: http://localhost:3001/admin/dashboard');
    console.log('=' .repeat(70));
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

resetAdminPassword();

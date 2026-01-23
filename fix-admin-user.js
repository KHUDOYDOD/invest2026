const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const connectionString = 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString: connectionString,
});

async function fixAdmin() {
  try {
    console.log('🔧 Исправляем админа...');
    
    const client = await pool.connect();
    
    // Хешируем пароль
    const hashedPassword = await bcrypt.hash('X11021997x', 10);
    
    // Обновляем пароль админа
    await client.query(
      'UPDATE users SET password_hash = $1, login = $2 WHERE email = $3',
      [hashedPassword, 'admin', 'admin@example.com']
    );
    console.log('✅ Пароль админа обновлен');
    
    // Добавляем роль админа (если её нет)
    const adminId = '00000000-0000-0000-0000-000000000001';
    
    // Удаляем старые роли
    await client.query('DELETE FROM user_roles WHERE user_id = $1', [adminId]);
    
    // Добавляем роль админа
    await client.query(
      'INSERT INTO user_roles (user_id, role, created_at) VALUES ($1, $2, NOW())',
      [adminId, 'admin']
    );
    console.log('✅ Роль админа назначена');
    
    // Проверяем результат
    const admin = await client.query(
      'SELECT u.*, ur.role FROM users u LEFT JOIN user_roles ur ON u.id = ur.user_id WHERE u.email = $1',
      ['admin@example.com']
    );
    
    console.log('\n👑 Данные админа:');
    if (admin.rows.length > 0) {
      const adminData = admin.rows[0];
      console.log(`  - ID: ${adminData.id}`);
      console.log(`  - Email: ${adminData.email}`);
      console.log(`  - Login: ${adminData.login}`);
      console.log(`  - Имя: ${adminData.full_name}`);
      console.log(`  - Роль: ${adminData.role}`);
      console.log(`  - Пароль установлен: ${adminData.password_hash ? 'Да' : 'Нет'}`);
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

fixAdmin();
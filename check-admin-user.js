const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function checkAdminUser() {
  try {
    console.log('🔍 Проверяем админа...');
    
    // Ищем админа
    const adminResult = await pool.query(`
      SELECT u.*, ur.name as role_name 
      FROM users u 
      LEFT JOIN user_roles ur ON u.role_id = ur.id 
      WHERE u.login = 'admin' OR u.email = 'admin@example.com'
    `);
    
    if (adminResult.rows.length === 0) {
      console.log('❌ Админ не найден');
      return;
    }
    
    const admin = adminResult.rows[0];
    console.log('👤 Найден админ:');
    console.log(`- ID: ${admin.id}`);
    console.log(`- Email: ${admin.email}`);
    console.log(`- Login: ${admin.login}`);
    console.log(`- Name: ${admin.full_name}`);
    console.log(`- Role ID: ${admin.role_id}`);
    console.log(`- Role Name: ${admin.role_name}`);
    console.log(`- Has Password: ${admin.password_hash ? 'Да' : 'Нет'}`);
    
    // Проверяем пароль
    if (admin.password_hash) {
      const testPassword = 'X11021997x';
      const isValidPassword = await bcrypt.compare(testPassword, admin.password_hash);
      console.log(`- Password Check (${testPassword}): ${isValidPassword ? '✅ Верный' : '❌ Неверный'}`);
    }
    
    // Если нет роли админа, назначаем
    if (!admin.role_id || admin.role_name !== 'admin') {
      console.log('🔧 Назначаем роль админа...');
      await pool.query('UPDATE users SET role_id = 2 WHERE id = $1', [admin.id]);
      console.log('✅ Роль админа назначена');
    }
    
    // Если нет пароля, устанавливаем
    if (!admin.password_hash) {
      console.log('🔧 Устанавливаем пароль...');
      const hashedPassword = await bcrypt.hash('X11021997x', 10);
      await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedPassword, admin.id]);
      console.log('✅ Пароль установлен');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

checkAdminUser();
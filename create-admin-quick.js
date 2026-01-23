const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const connectionString = 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString: connectionString,
});

async function createAdmin() {
  try {
    console.log('🔧 Создаем админа...');
    
    const client = await pool.connect();
    
    // Хешируем пароль
    const hashedPassword = await bcrypt.hash('X11021997x', 10);
    
    // Проверяем, есть ли уже админ
    const existingAdmin = await client.query("SELECT * FROM users WHERE email = 'admin@admin.com'");
    
    if (existingAdmin.rows.length > 0) {
      console.log('✅ Админ уже существует');
      
      // Обновляем пароль
      await client.query(
        'UPDATE users SET password = $1 WHERE email = $2',
        [hashedPassword, 'admin@admin.com']
      );
      console.log('✅ Пароль админа обновлен');
      
    } else {
      // Создаем нового админа
      const result = await client.query(
        `INSERT INTO users (email, password, full_name, balance, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id`,
        ['admin@admin.com', hashedPassword, 'Administrator', 0]
      );
      
      const adminId = result.rows[0].id;
      console.log('✅ Админ создан с ID:', adminId);
      
      // Добавляем роль админа
      await client.query(
        'INSERT INTO user_roles (user_id, role, created_at) VALUES ($1, $2, NOW())',
        [adminId, 'admin']
      );
      console.log('✅ Роль админа назначена');
    }
    
    // Проверяем всех админов
    const admins = await client.query(`
      SELECT u.id, u.email, u.full_name, ur.role 
      FROM users u 
      LEFT JOIN user_roles ur ON u.id = ur.user_id 
      WHERE ur.role = 'admin' OR u.email = 'admin@admin.com'
    `);
    
    console.log('\n👑 Администраторы:');
    admins.rows.forEach(admin => {
      console.log(`  - ID: ${admin.id}, Email: ${admin.email}, Имя: ${admin.full_name}, Роль: ${admin.role}`);
    });
    
    client.release();
    
  } catch (error) {
    console.error('❌ Ошибка при создании админа:', error.message);
  } finally {
    await pool.end();
  }
}

createAdmin();
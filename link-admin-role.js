const { Pool } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString: connectionString,
});

async function linkAdminRole() {
  try {
    console.log('🔗 Связываем админа с ролью...');
    
    const client = await pool.connect();
    
    // Проверяем существующие роли
    const roles = await client.query('SELECT * FROM user_roles');
    console.log('\n📋 Существующие роли:');
    roles.rows.forEach(role => {
      console.log(`  - ID: ${role.id}, Название: ${role.name}, Отображение: ${role.display_name}`);
    });
    
    // Ищем или создаем роль админа
    let adminRoleId;
    const existingAdminRole = roles.rows.find(role => role.name === 'admin');
    
    if (existingAdminRole) {
      adminRoleId = existingAdminRole.id;
      console.log(`✅ Найдена роль админа с ID: ${adminRoleId}`);
    } else {
      // Создаем роль админа
      const newRole = await client.query(
        `INSERT INTO user_roles (name, display_name, description, permissions, created_at) 
         VALUES ($1, $2, $3, $4, NOW()) RETURNING id`,
        ['admin', 'Администратор', 'Полный доступ к системе', '{"all": true}']
      );
      adminRoleId = newRole.rows[0].id;
      console.log(`✅ Создана роль админа с ID: ${adminRoleId}`);
    }
    
    // Привязываем админа к роли
    await client.query(
      'UPDATE users SET role_id = $1 WHERE email = $2',
      [adminRoleId, 'admin@example.com']
    );
    console.log('✅ Админ привязан к роли');
    
    // Проверяем результат
    const admin = await client.query(`
      SELECT u.id, u.email, u.login, u.full_name, u.role_id, ur.name as role_name, ur.display_name as role_display
      FROM users u 
      LEFT JOIN user_roles ur ON u.role_id = ur.id 
      WHERE u.email = 'admin@example.com'
    `);
    
    console.log('\n👑 Финальные данные админа:');
    if (admin.rows.length > 0) {
      const adminData = admin.rows[0];
      console.log(`  - ID: ${adminData.id}`);
      console.log(`  - Email: ${adminData.email}`);
      console.log(`  - Login: ${adminData.login}`);
      console.log(`  - Имя: ${adminData.full_name}`);
      console.log(`  - Role ID: ${adminData.role_id}`);
      console.log(`  - Роль: ${adminData.role_name} (${adminData.role_display})`);
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

linkAdminRole();
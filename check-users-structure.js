const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function checkUsersStructure() {
  try {
    console.log('🔍 Проверяем структуру таблицы users...');
    
    // Получаем структуру таблицы users
    const structureResult = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Текущие колонки в таблице users:');
    structureResult.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    // Проверяем наличие нужных колонок
    const columns = structureResult.rows.map(row => row.column_name);
    const missingColumns = [];
    
    if (!columns.includes('password_hash')) {
      missingColumns.push('password_hash');
    }
    if (!columns.includes('role_id')) {
      missingColumns.push('role_id');
    }
    
    if (missingColumns.length > 0) {
      console.log('❌ Отсутствующие колонки:', missingColumns);
    } else {
      console.log('✅ Все необходимые колонки присутствуют');
    }
    
    // Проверяем таблицу user_roles
    const rolesResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'user_roles'
      )
    `);
    
    if (rolesResult.rows[0].exists) {
      console.log('✅ Таблица user_roles существует');
      
      const rolesData = await pool.query('SELECT * FROM user_roles');
      console.log('📋 Роли в системе:');
      rolesData.rows.forEach(role => {
        console.log(`- ID: ${role.id}, Name: ${role.name}`);
      });
    } else {
      console.log('❌ Таблица user_roles не существует');
    }
    
    // Проверяем пользователей
    const usersResult = await pool.query('SELECT id, email, login, full_name FROM users LIMIT 5');
    console.log('👥 Пользователи в системе:');
    usersResult.rows.forEach(user => {
      console.log(`- ID: ${user.id}, Email: ${user.email}, Login: ${user.login}, Name: ${user.full_name}`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка при проверке структуры:', error.message);
  } finally {
    await pool.end();
  }
}

checkUsersStructure();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const connectionString = 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString: connectionString,
});

async function fixAdminFinal() {
  try {
    console.log('🔧 Финальное исправление админа...');
    
    const client = await pool.connect();
    
    // Проверяем структуру таблицы user_roles
    const rolesStructure = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'user_roles' 
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 Структура таблицы user_roles:');
    rolesStructure.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });
    
    // Хешируем пароль
    const hashedPassword = await bcrypt.hash('X11021997x', 10);
    
    // Обновляем пароль админа
    await client.query(
      'UPDATE users SET password_hash = $1, login = $2 WHERE email = $3',
      [hashedPassword, 'admin', 'admin@example.com']
    );
    console.log('✅ Пароль админа обновлен');
    
    // Проверяем, какие колонки есть в user_roles
    const roleColumns = rolesStructure.rows.map(row => row.column_name);
    
    if (roleColumns.includes('user_id')) {
      // Если есть user_id
      const adminId = '00000000-0000-0000-0000-000000000001';
      await client.query('DELETE FROM user_roles WHERE user_id = $1', [adminId]);
      await client.query(
        'INSERT INTO user_roles (user_id, role, created_at) VALUES ($1, $2, NOW())',
        [adminId, 'admin']
      );
    } else if (roleColumns.includes('id') && roleColumns.includes('role')) {
      // Если структура другая, попробуем другой подход
      await client.query('DELETE FROM user_roles WHERE role = $1', ['admin']);
      await client.query(
        'INSERT INTO user_roles (role, created_at) VALUES ($1, NOW())',
        ['admin']
      );
    }
    
    console.log('✅ Роль админа настроена');
    
    // Проверяем результат
    const admin = await client.query(
      'SELECT * FROM users WHERE email = $1',
      ['admin@example.com']
    );
    
    console.log('\n👑 Данные админа:');
    if (admin.rows.length > 0) {
      const adminData = admin.rows[0];
      console.log(`  - ID: ${adminData.id}`);
      console.log(`  - Email: ${adminData.email}`);
      console.log(`  - Login: ${adminData.login}`);
      console.log(`  - Имя: ${adminData.full_name}`);
      console.log(`  - Пароль установлен: ${adminData.password_hash ? 'Да' : 'Нет'}`);
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

fixAdminFinal();
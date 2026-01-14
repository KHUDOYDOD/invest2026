const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/investpro',
});

async function findUserExact() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Ищем пользователя с похожим email...');
    
    // Ищем всех пользователей с похожим email
    const result = await client.query(`
      SELECT id, email, full_name, role_id, status, created_at
      FROM users 
      WHERE email ILIKE '%11021997%'
      OR email ILIKE '%khojaev%'
      OR full_name ILIKE '%khojaev%'
      ORDER BY created_at DESC
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Найдены пользователи:');
      result.rows.forEach((user, index) => {
        console.log(`${index + 1}. Email: "${user.email}"`);
        console.log(`   Имя: ${user.full_name}`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Роль: ${user.role_id}`);
        console.log(`   Статус: ${user.status}`);
        console.log(`   Создан: ${user.created_at}`);
        console.log('');
      });
    } else {
      console.log('❌ Пользователи не найдены');
    }
    
    // Также покажем всех пользователей
    console.log('📋 Все пользователи в базе:');
    const allUsers = await client.query(`
      SELECT email, full_name, status 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    
    allUsers.rows.forEach((user, index) => {
      console.log(`${index + 1}. "${user.email}" - ${user.full_name} (${user.status})`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

findUserExact().catch(console.error);
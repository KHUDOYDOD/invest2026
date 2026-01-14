const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function findAdminUsers() {
  const client = await pool.connect();
  try {
    console.log('🔍 Поиск администраторов...\n');
    
    const result = await client.query(`
      SELECT 
        id,
        email,
        full_name,
        password_hash,
        role_id,
        balance,
        created_at
      FROM users
      WHERE role_id IN (1, 2)
      ORDER BY role_id ASC
    `);
    
    if (result.rows.length === 0) {
      console.log('❌ Администраторы не найдены');
      console.log('\n💡 Создайте администратора командой:');
      console.log('   node scripts/create-super-admin.js');
      return;
    }
    
    console.log(`✅ Найдено администраторов: ${result.rows.length}\n`);
    console.log('='.repeat(70));
    
    result.rows.forEach((user, index) => {
      const roleNames = {
        1: 'СУПЕР АДМИН',
        2: 'АДМИН'
      };
      
      console.log(`\n${index + 1}. ${roleNames[user.role_id] || 'АДМИН'}`);
      console.log('-'.repeat(70));
      console.log('📧 Email (логин):', user.email);
      console.log('👤 Имя:', user.full_name);
      console.log('🔑 Хеш пароля:', user.password_hash.substring(0, 30) + '...');
      console.log('💰 Баланс:', user.balance);
      console.log('📅 Создан:', new Date(user.created_at).toLocaleString('ru-RU'));
    });
    
    console.log('\n' + '='.repeat(70));
    console.log('⚠️  ВАЖНО: Пароли зашифрованы (bcrypt hash)');
    console.log('Если вы забыли пароль, используйте скрипт сброса.');
    console.log('='.repeat(70));
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

findAdminUsers();

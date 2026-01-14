const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function findKhojaevPassword() {
  const client = await pool.connect();
  try {
    console.log('🔍 Поиск данных пользователя KHOJAEV...\n');
    
    const result = await client.query(`
      SELECT 
        id,
        email,
        full_name,
        password_hash,
        balance,
        created_at
      FROM users
      WHERE full_name ILIKE '%khojaev%' OR email ILIKE '%khojaev%'
    `);
    
    if (result.rows.length === 0) {
      console.log('❌ Пользователь KHOJAEV не найден');
      return;
    }
    
    const user = result.rows[0];
    
    console.log('✅ Пользователь найден!\n');
    console.log('📧 Email (логин):', user.email);
    console.log('👤 Имя:', user.full_name);
    console.log('🔑 Хеш пароля:', user.password_hash);
    console.log('💰 Баланс:', user.balance);
    console.log('📅 Создан:', new Date(user.created_at).toLocaleString('ru-RU'));
    
    console.log('\n' + '='.repeat(60));
    console.log('⚠️  ВАЖНО: Пароль зашифрован (bcrypt hash)');
    console.log('Если вы забыли пароль, нужно сбросить его.');
    console.log('='.repeat(60));
    
    console.log('\n💡 Для сброса пароля используйте:');
    console.log('   node reset-password.js');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

findKhojaevPassword();

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'investpro',
  password: 'postgres123',
  port: 5432,
});

async function checkUserBalance() {
  try {
    console.log('🔍 Проверяем баланс админа...');
    
    const result = await pool.query(
      'SELECT id, full_name, balance FROM users WHERE email = $1',
      ['admin@example.com']
    );
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log('👤 Пользователь:', user.full_name);
      console.log('💰 Баланс:', `$${user.balance}`);
      console.log('🆔 ID:', user.id);
      
      if (parseFloat(user.balance) === 0) {
        console.log('\n💡 Баланс равен $0 - это объясняет ошибку при выводе средств');
        console.log('📝 Добавим тестовый баланс для проверки...');
        
        await pool.query(
          'UPDATE users SET balance = $1 WHERE id = $2',
          [100, user.id]
        );
        
        console.log('✅ Добавлен тестовый баланс $100');
      }
    } else {
      console.log('❌ Пользователь не найден');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

checkUserBalance();
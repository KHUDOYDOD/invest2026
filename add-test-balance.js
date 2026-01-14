const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function addTestBalance() {
  try {
    console.log('=== ДОБАВЛЕНИЕ ТЕСТОВОГО БАЛАНСА ===');
    
    // Добавляем $1000 пользователю x11021997x@mail.ru для тестирования
    const result = await pool.query(`
      UPDATE users 
      SET balance = 1000.00 
      WHERE email = 'x11021997x@mail.ru'
      RETURNING email, balance
    `);
    
    if (result.rows.length > 0) {
      console.log(`✅ Баланс обновлен для ${result.rows[0].email}: $${result.rows[0].balance}`);
      console.log('🎯 Теперь можно тестировать вывод средств!');
    } else {
      console.log('❌ Пользователь не найден');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

addTestBalance();
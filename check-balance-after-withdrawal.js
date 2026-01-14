const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function checkBalanceAfterWithdrawal() {
  try {
    console.log('=== ПРОВЕРКА БАЛАНСА ПОСЛЕ ВЫВОДА ===');
    
    // Проверяем баланс пользователя
    const userResult = await pool.query(`
      SELECT email, balance FROM users WHERE email = 'x11021997x@mail.ru'
    `);
    
    if (userResult.rows.length > 0) {
      console.log(`💰 Текущий баланс ${userResult.rows[0].email}: $${userResult.rows[0].balance}`);
    }
    
    // Проверяем заявки на вывод
    const withdrawalResult = await pool.query(`
      SELECT wr.*, u.email 
      FROM withdrawal_requests wr
      LEFT JOIN users u ON wr.user_id = u.id
      WHERE u.email = 'x11021997x@mail.ru'
      ORDER BY wr.created_at DESC
      LIMIT 3
    `);
    
    console.log(`\n📊 Заявки на вывод (${withdrawalResult.rows.length}):`);
    withdrawalResult.rows.forEach(req => {
      console.log(`   💸 $${req.amount} (комиссия: $${req.fee}, к выплате: $${req.final_amount})`);
      console.log(`      📅 ${req.created_at.toLocaleString()}`);
      console.log(`      📊 Статус: ${req.status}`);
      console.log('      ---');
    });
    
    // Проверяем транзакции
    const transactionResult = await pool.query(`
      SELECT t.*, u.email 
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE u.email = 'x11021997x@mail.ru'
      ORDER BY t.created_at DESC
      LIMIT 3
    `);
    
    console.log(`\n💳 Последние транзакции (${transactionResult.rows.length}):`);
    transactionResult.rows.forEach(tx => {
      console.log(`   🔄 ${tx.type}: $${tx.amount} (${tx.status})`);
      console.log(`      📝 ${tx.description}`);
      console.log(`      📅 ${tx.created_at.toLocaleString()}`);
      console.log('      ---');
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

checkBalanceAfterWithdrawal();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function checkApprovedWithdrawal() {
  try {
    console.log('=== ПРОВЕРКА ОДОБРЕННОЙ ЗАЯВКИ НА ВЫВОД ===');
    
    // Проверяем заявки на вывод
    const withdrawalResult = await pool.query(`
      SELECT wr.*, u.email 
      FROM withdrawal_requests wr
      LEFT JOIN users u ON wr.user_id = u.id
      ORDER BY wr.processed_at DESC NULLS LAST, wr.created_at DESC
      LIMIT 5
    `);
    
    console.log('📊 Последние заявки на вывод:');
    withdrawalResult.rows.forEach(req => {
      console.log(`   💸 ID: ${req.id.substring(0, 8)}...`);
      console.log(`      👤 Пользователь: ${req.email}`);
      console.log(`      💰 Сумма: $${req.amount} (к выплате: $${req.final_amount})`);
      console.log(`      📊 Статус: ${req.status}`);
      console.log(`      📝 Комментарий: ${req.admin_comment || 'нет'}`);
      console.log(`      📅 Создана: ${req.created_at.toLocaleString()}`);
      console.log(`      ✅ Обработана: ${req.processed_at ? req.processed_at.toLocaleString() : 'не обработана'}`);
      console.log('      ---');
    });
    
    // Проверяем последние транзакции
    console.log('\n💳 Последние транзакции:');
    const transactionResult = await pool.query(`
      SELECT t.*, u.email 
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
      LIMIT 5
    `);
    
    transactionResult.rows.forEach(tx => {
      console.log(`   🔄 ${tx.type}: $${tx.amount} (${tx.status})`);
      console.log(`      👤 ${tx.email}`);
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

checkApprovedWithdrawal();
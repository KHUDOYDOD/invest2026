const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function checkCreatedInvestment() {
  try {
    console.log('=== ПРОВЕРКА СОЗДАННОЙ ИНВЕСТИЦИИ ===');
    
    // Проверяем инвестиции
    const investments = await pool.query(`
      SELECT i.*, ip.name as plan_name, u.email
      FROM investments i
      LEFT JOIN investment_plans ip ON i.plan_id = ip.id
      LEFT JOIN users u ON i.user_id = u.id
      ORDER BY i.created_at DESC
      LIMIT 3
    `);
    
    console.log(`📊 Инвестиции (${investments.rows.length}):`);
    investments.rows.forEach(inv => {
      console.log(`   💼 ID: ${inv.id.substring(0, 8)}...`);
      console.log(`      👤 Пользователь: ${inv.email}`);
      console.log(`      📋 План: ${inv.plan_name}`);
      console.log(`      💰 Сумма: $${inv.amount}`);
      console.log(`      💎 Дневная прибыль: $${inv.daily_profit}`);
      console.log(`      📊 Статус: ${inv.status}`);
      console.log(`      📅 Создана: ${inv.created_at.toLocaleString()}`);
      console.log(`      🏁 Окончание: ${inv.end_date.toLocaleString()}`);
      console.log('      ---');
    });
    
    // Проверяем баланс пользователя
    const user = await pool.query(`
      SELECT email, balance, total_invested 
      FROM users 
      WHERE email = 'x11021997x@mail.ru'
    `);
    
    if (user.rows.length > 0) {
      console.log(`\n👤 Баланс пользователя ${user.rows[0].email}:`);
      console.log(`   💰 Текущий баланс: $${user.rows[0].balance}`);
      console.log(`   📈 Всего инвестировано: $${user.rows[0].total_invested}`);
    }
    
    // Проверяем транзакции
    const transactions = await pool.query(`
      SELECT t.*, u.email
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE u.email = 'x11021997x@mail.ru'
      ORDER BY t.created_at DESC
      LIMIT 3
    `);
    
    console.log(`\n💳 Последние транзакции (${transactions.rows.length}):`);
    transactions.rows.forEach(tx => {
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

checkCreatedInvestment();
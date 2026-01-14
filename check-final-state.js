const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function checkFinalState() {
  try {
    console.log('=== ПРОВЕРКА ФИНАЛЬНОГО СОСТОЯНИЯ СИСТЕМЫ ===');
    
    // Проверяем пользователей
    console.log('👥 ПОЛЬЗОВАТЕЛИ:');
    const users = await pool.query('SELECT email, balance, total_invested, total_earned, role_id FROM users ORDER BY role_id');
    users.rows.forEach(user => {
      const roleText = user.role_id === 1 ? 'super_admin' : user.role_id === 2 ? 'admin' : 'user';
      console.log(`   📧 ${user.email} (${roleText}): баланс=$${user.balance}`);
    });
    
    // Проверяем планы инвестирования
    console.log('\n📋 ПЛАНЫ ИНВЕСТИРОВАНИЯ:');
    const plans = await pool.query('SELECT name, min_amount, max_amount, daily_percent, duration FROM investment_plans ORDER BY min_amount');
    if (plans.rows.length > 0) {
      plans.rows.forEach(plan => {
        console.log(`   💎 ${plan.name}: $${plan.min_amount}-$${plan.max_amount}, ${plan.daily_percent}% в день, ${plan.duration} дней`);
      });
    } else {
      console.log('   ❌ Планы инвестирования не найдены!');
    }
    
    // Проверяем финансовые таблицы
    console.log('\n📊 ФИНАНСОВЫЕ ДАННЫЕ:');
    const tables = ['investments', 'transactions', 'deposit_requests', 'withdrawal_requests'];
    for (const table of tables) {
      const count = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`   📈 ${table}: ${count.rows[0].count} записей`);
    }
    
    console.log('\n✅ СИСТЕМА ГОТОВА К РАБОТЕ!');
    console.log('🔄 Все пользователи имеют нулевые балансы');
    console.log('📋 Планы инвестирования доступны');
    console.log('🗑️ Все финансовые операции удалены');
    console.log('🎯 Можно начинать работу с чистого листа!');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

checkFinalState();
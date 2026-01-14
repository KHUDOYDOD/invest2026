const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function checkPlanIds() {
  try {
    console.log('=== ПРОВЕРКА ID ПЛАНОВ ИНВЕСТИРОВАНИЯ ===');
    
    const plans = await pool.query(`
      SELECT id, name, min_amount, max_amount, daily_percent, duration
      FROM investment_plans 
      ORDER BY min_amount
    `);
    
    console.log(`📋 Планы инвестирования (${plans.rows.length}):`);
    plans.rows.forEach(plan => {
      console.log(`   💎 ${plan.name}:`);
      console.log(`      🆔 ID: ${plan.id}`);
      console.log(`      💰 Сумма: $${plan.min_amount}-$${plan.max_amount}`);
      console.log(`      📈 Доходность: ${plan.daily_percent}% в день`);
      console.log(`      ⏰ Длительность: ${plan.duration} дней`);
      console.log('      ---');
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

checkPlanIds();
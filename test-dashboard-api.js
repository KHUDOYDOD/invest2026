const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function testDashboardAPI() {
  try {
    console.log('=== ТЕСТИРОВАНИЕ DASHBOARD API ===');
    
    // Получаем пользователя x11021997x@mail.ru
    const userResult = await pool.query(`
      SELECT 
        id, 
        email, 
        full_name, 
        COALESCE(balance, 0) as balance,
        COALESCE(total_invested, 0) as total_invested,
        COALESCE(total_earned, 0) as total_earned,
        created_at,
        phone,
        country,
        city,
        referral_code
      FROM users 
      WHERE email = $1
    `, ['x11021997x@mail.ru']);
    
    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      console.log('👤 Пользователь найден:');
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   👤 Имя: ${user.full_name}`);
      console.log(`   💰 Баланс: $${user.balance}`);
      console.log(`   📈 Всего инвестировано: $${user.total_invested}`);
      console.log(`   💎 Всего заработано: $${user.total_earned}`);
      console.log(`   🆔 ID: ${user.id}`);
      
      // Проверяем инвестиции
      const investmentsResult = await pool.query(`
        SELECT 
          i.id,
          i.amount,
          i.created_at,
          i.status,
          ip.name as plan_name,
          ip.daily_profit as daily_return_rate,
          ip.duration_days
        FROM investments i
        LEFT JOIN investment_plans ip ON i.plan_id = ip.id
        WHERE i.user_id = $1
        ORDER BY i.created_at DESC
      `, [user.id]);
      
      console.log(`\n📊 Инвестиции (${investmentsResult.rows.length}):`);
      if (investmentsResult.rows.length > 0) {
        investmentsResult.rows.forEach(inv => {
          console.log(`   💼 ${inv.plan_name}: $${inv.amount} (${inv.status})`);
        });
      } else {
        console.log('   📭 Инвестиций не найдено');
      }
      
      // Проверяем транзакции
      const transactionsResult = await pool.query(`
        SELECT 
          id,
          type,
          amount,
          status,
          created_at,
          description
        FROM transactions
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 5
      `, [user.id]);
      
      console.log(`\n💳 Транзакции (${transactionsResult.rows.length}):`);
      if (transactionsResult.rows.length > 0) {
        transactionsResult.rows.forEach(tx => {
          console.log(`   🔄 ${tx.type}: $${tx.amount} (${tx.status}) - ${tx.description}`);
        });
      } else {
        console.log('   📭 Транзакций не найдено');
      }
      
    } else {
      console.log('❌ Пользователь не найден');
    }
    
    // Проверяем планы инвестирования
    console.log('\n📋 Проверяем планы инвестирования:');
    const plansResult = await pool.query(`
      SELECT 
        id,
        name,
        COALESCE(min_amount, 0) as min_amount,
        COALESCE(max_amount, 0) as max_amount,
        COALESCE(daily_profit, 0) as daily_return_rate,
        duration_days,
        is_active
      FROM investment_plans
      ORDER BY min_amount ASC
    `);
    
    if (plansResult.rows.length > 0) {
      console.log(`📊 Найдено ${plansResult.rows.length} планов:`);
      plansResult.rows.forEach(plan => {
        console.log(`   💎 ${plan.name}: $${plan.min_amount}-$${plan.max_amount}, ${plan.daily_return_rate}% в день, ${plan.duration_days} дней (активен: ${plan.is_active})`);
      });
    } else {
      console.log('❌ Планы инвестирования не найдены');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

testDashboardAPI();
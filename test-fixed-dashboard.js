const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function testFixedDashboard() {
  try {
    console.log('=== ТЕСТИРОВАНИЕ ИСПРАВЛЕННОГО DASHBOARD API ===');
    
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
      console.log(`   🆔 ID: ${user.id}`);
      
      // Тестируем исправленный запрос инвестиций
      const investmentsResult = await pool.query(`
        SELECT 
          i.id,
          i.amount,
          i.created_at,
          i.status,
          ip.name as plan_name,
          ip.daily_percent as daily_return_rate,
          ip.duration as duration_days,
          i.created_at as start_date
        FROM investments i
        LEFT JOIN investment_plans ip ON i.plan_id = ip.id
        WHERE i.user_id = $1
        ORDER BY i.created_at DESC
        LIMIT 10
      `, [user.id]);
      
      console.log(`\n📊 Инвестиции (${investmentsResult.rows.length}):`);
      if (investmentsResult.rows.length > 0) {
        investmentsResult.rows.forEach(inv => {
          console.log(`   💼 ${inv.plan_name}: $${inv.amount} (${inv.status})`);
        });
      } else {
        console.log('   📭 Инвестиций не найдено (это нормально для нового пользователя)');
      }
      
      // Тестируем исправленный запрос планов
      const plansResult = await pool.query(`
        SELECT 
          id,
          name,
          COALESCE(min_amount, 0) as min_amount,
          COALESCE(max_amount, 0) as max_amount,
          COALESCE(daily_percent, 0) as daily_return_rate,
          duration as duration_days
        FROM investment_plans
        WHERE is_active = true
        ORDER BY min_amount ASC
      `);
      
      console.log(`\n📋 Планы инвестирования (${plansResult.rows.length}):`);
      if (plansResult.rows.length > 0) {
        plansResult.rows.forEach(plan => {
          console.log(`   💎 ${plan.name}: $${plan.min_amount}-$${plan.max_amount}, ${plan.daily_return_rate}% в день, ${plan.duration_days} дней`);
        });
      } else {
        console.log('   📭 Планы не найдены');
      }
      
      console.log('\n✅ Все запросы выполнены успешно! API должен работать.');
      
    } else {
      console.log('❌ Пользователь не найден');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

testFixedDashboard();
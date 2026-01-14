const { Pool } = require('pg');
const fs = require('fs');

function getDatabaseUrl() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const match = envContent.match(/DATABASE_URL=(.+)/);
    return match ? match[1].trim() : null;
  } catch (error) {
    return null;
  }
}

async function updatePlans() {
  const databaseUrl = getDatabaseUrl();
  const pool = new Pool({ connectionString: databaseUrl });

  try {
    console.log('🔄 Обновление описаний тарифов...\n');
    
    // Обновляем описания и features для каждого плана
    const updates = [
      {
        id: 1,
        name: 'Starter',
        description: 'Идеальный план для начинающих инвесторов',
        features: ['Ежедневные выплаты', 'Реинвестирование', 'Страхование вклада', '24/7 поддержка']
      },
      {
        id: 2,
        name: 'Professional',
        description: 'Для опытных инвесторов с повышенной доходностью',
        features: ['Ежедневные выплаты', 'Реинвестирование', 'Страхование вклада', 'Приоритетная поддержка', 'Персональный менеджер']
      },
      {
        id: 3,
        name: 'Premium',
        description: 'Премиальный план с максимальной доходностью',
        features: ['Ежедневные выплаты', 'Реинвестирование', 'Полное страхование', 'VIP поддержка 24/7', 'Персональный менеджер', 'Эксклюзивные инвестиции']
      },
      {
        id: 4,
        name: 'VIP',
        description: 'Эксклюзивный план для VIP клиентов',
        features: ['Ежедневные выплаты', 'Реинвестирование', 'Полное страхование', 'VIP поддержка 24/7', 'Персональный менеджер', 'Эксклюзивные инвестиции', 'Приоритетный вывод']
      }
    ];
    
    for (const update of updates) {
      await pool.query(
        `UPDATE investment_plans 
         SET description = $1, features = $2, updated_at = NOW()
         WHERE id = $3`,
        [update.description, update.features, update.id]
      );
      console.log(`✅ Обновлен план: ${update.name}`);
    }
    
    console.log('\n📋 Текущие тарифы:');
    console.log('─'.repeat(80));
    
    const plans = await pool.query(`
      SELECT id, name, description, min_amount, max_amount, daily_profit, duration_days
      FROM investment_plans
      ORDER BY min_amount ASC
    `);
    
    plans.rows.forEach(plan => {
      console.log(`\n${plan.name}`);
      console.log(`  ${plan.description}`);
      console.log(`  Сумма: $${plan.min_amount} - $${plan.max_amount}`);
      console.log(`  Доходность: ${plan.daily_profit}% в день`);
      console.log(`  Срок: ${plan.duration_days} дней`);
      console.log(`  Общая прибыль: ${(parseFloat(plan.daily_profit) * plan.duration_days).toFixed(1)}%`);
    });
    
    console.log('\n✅ Все тарифы обновлены!');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

updatePlans();

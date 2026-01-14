const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function addInvestmentPlans() {
  try {
    console.log('=== ДОБАВЛЕНИЕ ПЛАНОВ ИНВЕСТИРОВАНИЯ ===');
    
    // Сначала очищаем существующие планы
    await pool.query('DELETE FROM investment_plans');
    console.log('🗑️ Старые планы удалены');
    
    // Добавляем новые планы
    const plans = [
      {
        name: 'Базовый',
        min_amount: 100,
        max_amount: 999,
        daily_percent: 1.2,
        duration: 30,
        total_return: 136, // 30 * 1.2 = 36% + 100% = 136%
        description: 'Идеальный план для начинающих инвесторов',
        features: ['Минимальный риск', 'Стабильная доходность', 'Ежедневные выплаты'],
        risk_level: 'low',
        recommended_for: 'Новички в инвестировании'
      },
      {
        name: 'Стандарт',
        min_amount: 1000,
        max_amount: 4999,
        daily_percent: 1.5,
        duration: 30,
        total_return: 145, // 30 * 1.5 = 45% + 100% = 145%
        description: 'Оптимальный баланс риска и доходности',
        features: ['Умеренный риск', 'Высокая доходность', 'Приоритетная поддержка'],
        risk_level: 'medium',
        recommended_for: 'Опытные инвесторы'
      },
      {
        name: 'Премиум',
        min_amount: 5000,
        max_amount: 19999,
        daily_percent: 2.0,
        duration: 60,
        total_return: 220, // 60 * 2.0 = 120% + 100% = 220%
        description: 'Максимальная доходность для крупных инвестиций',
        features: ['Высокая доходность', 'VIP поддержка', 'Персональный менеджер'],
        risk_level: 'medium',
        recommended_for: 'Профессиональные инвесторы'
      },
      {
        name: 'VIP',
        min_amount: 20000,
        max_amount: 100000,
        daily_percent: 2.5,
        duration: 90,
        total_return: 325, // 90 * 2.5 = 225% + 100% = 325%
        description: 'Эксклюзивный план для крупных инвесторов',
        features: ['Максимальная доходность', 'Индивидуальные условия', 'Приоритетные выплаты'],
        risk_level: 'high',
        recommended_for: 'Крупные инвесторы'
      }
    ];
    
    for (const plan of plans) {
      await pool.query(`
        INSERT INTO investment_plans (
          id, name, min_amount, max_amount, daily_percent, duration, 
          total_return, is_active, features, description, risk_level, 
          recommended_for, created_at, updated_at
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, true, $7, $8, $9, $10, NOW(), NOW()
        )
      `, [
        plan.name,
        plan.min_amount,
        plan.max_amount,
        plan.daily_percent,
        plan.duration,
        plan.total_return,
        plan.features,
        plan.description,
        plan.risk_level,
        plan.recommended_for
      ]);
      
      console.log(`✅ Добавлен план: ${plan.name} (${plan.daily_percent}% в день)`);
    }
    
    console.log('\n🎉 Все планы успешно добавлены!');
    
    // Проверяем результат
    const result = await pool.query('SELECT name, min_amount, max_amount, daily_percent, duration FROM investment_plans ORDER BY min_amount');
    console.log('\n📊 Добавленные планы:');
    result.rows.forEach(plan => {
      console.log(`  💎 ${plan.name}: $${plan.min_amount}-$${plan.max_amount}, ${plan.daily_percent}% в день, ${plan.duration} дней`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

addInvestmentPlans();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function fixInvestmentPlans() {
  try {
    await client.connect();
    console.log('🔗 Подключение к базе данных...');

    // Обновляем планы с правильными значениями
    const plans = [
      {
        name: 'Базовый',
        daily_percent: 1.2,
        duration: 30,
        description: 'Идеальный план для начинающих инвесторов'
      },
      {
        name: 'Стандарт', 
        daily_percent: 1.5,
        duration: 25,
        description: 'Сбалансированный план для стабильного дохода'
      },
      {
        name: 'Премиум',
        daily_percent: 2.0,
        duration: 20,
        description: 'Для опытных инвесторов с высокой доходностью'
      },
      {
        name: 'VIP',
        daily_percent: 2.5,
        duration: 15,
        description: 'Эксклюзивный план для VIP клиентов'
      }
    ];

    console.log('📝 Обновление планов...');

    for (const plan of plans) {
      const total_return = plan.daily_percent * plan.duration;
      
      await client.query(`
        UPDATE investment_plans 
        SET 
          daily_percent = $1,
          duration = $2,
          total_return = $3,
          description = $4,
          features = $5,
          updated_at = NOW()
        WHERE name = $6
      `, [
        plan.daily_percent,
        plan.duration,
        total_return,
        plan.description,
        ['Ежедневные выплаты', 'Реинвестирование', 'Страхование вклада', '24/7 поддержка'],
        plan.name
      ]);

      console.log(`✅ Обновлен план: ${plan.name} (${plan.daily_percent}% в день, ${plan.duration} дней)`);
    }

    // Проверяем результат
    const result = await client.query(`
      SELECT name, daily_percent, duration, total_return, min_amount, max_amount 
      FROM investment_plans 
      ORDER BY min_amount ASC
    `);

    console.log('\n📊 Обновленные планы:');
    result.rows.forEach(plan => {
      console.log(`  📦 ${plan.name}:`);
      console.log(`     💰 Сумма: $${plan.min_amount} - $${plan.max_amount}`);
      console.log(`     📈 Доходность: ${plan.daily_percent}% в день`);
      console.log(`     ⏰ Длительность: ${plan.duration} дней`);
      console.log(`     💎 Общий доход: ${plan.total_return}%`);
      console.log('     ---');
    });

    console.log('\n🎉 Все планы успешно обновлены!');

  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await client.end();
  }
}

fixInvestmentPlans();
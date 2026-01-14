const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function checkInvestmentPlansTable() {
  try {
    console.log('=== ПРОВЕРКА ТАБЛИЦЫ INVESTMENT_PLANS ===');
    
    // Проверяем структуру таблицы
    const structure = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'investment_plans' 
      ORDER BY ordinal_position
    `);
    
    if (structure.rows.length > 0) {
      console.log('📋 Структура таблицы investment_plans:');
      structure.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
    } else {
      console.log('❌ Таблица investment_plans не найдена');
    }
    
    // Проверяем данные в таблице
    console.log('\n📊 Данные в таблице:');
    const data = await pool.query('SELECT * FROM investment_plans ORDER BY id');
    
    if (data.rows.length > 0) {
      console.log(`Найдено ${data.rows.length} планов:`);
      data.rows.forEach(plan => {
        console.log(`  📦 ID: ${plan.id}`);
        console.log(`     📝 Название: ${plan.name}`);
        console.log(`     💰 Мин. сумма: $${plan.min_amount}`);
        console.log(`     💎 Макс. сумма: $${plan.max_amount}`);
        console.log(`     📈 Доходность: ${plan.daily_return || plan.profit_rate || plan.return_rate || 'НЕ НАЙДЕНО'}%`);
        console.log(`     ⏰ Длительность: ${plan.duration_days} дней`);
        console.log(`     ✅ Активен: ${plan.is_active}`);
        console.log('     ---');
      });
    } else {
      console.log('📭 Планы не найдены');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

checkInvestmentPlansTable();
require('dotenv').config({ path: '.env.production' });
const { Pool } = require('pg');

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testAutoStatisticsUpdate() {
  try {
    console.log('🧪 Тестируем автоматическое обновление статистики...\n');
    
    // Получаем текущую статистику
    console.log('📊 Текущая статистика:');
    const currentStats = await pool.query(`
      SELECT 
        users_count,
        investments_amount,
        payouts_amount,
        profitability_rate,
        updated_at
      FROM platform_statistics 
      ORDER BY updated_at DESC 
      LIMIT 1
    `);

    if (currentStats.rows.length > 0) {
      const stats = currentStats.rows[0];
      console.log(`   Пользователи: ${stats.users_count}`);
      console.log(`   Инвестиции: $${stats.investments_amount}`);
      console.log(`   Выплаты: $${stats.payouts_amount}`);
      console.log(`   Доходность: ${stats.profitability_rate}%`);
      console.log(`   Обновлено: ${new Date(stats.updated_at).toLocaleString()}`);
    } else {
      console.log('   Статистика не найдена');
    }

    // Проверяем реальные данные из базы
    console.log('\n🔍 Реальные данные из базы:');
    
    const [usersResult, investmentsResult, payoutsResult] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM users'),
      pool.query(`
        SELECT 
          COALESCE(SUM(amount), 0) as total_amount,
          COUNT(*) as count
        FROM transactions 
        WHERE type = 'investment' AND status = 'completed'
      `),
      pool.query(`
        SELECT 
          COALESCE(SUM(amount), 0) as total_amount,
          COUNT(*) as count
        FROM transactions 
        WHERE type = 'withdrawal' AND status = 'completed'
      `)
    ]);

    const usersCount = parseInt(usersResult.rows[0].count);
    const investmentsAmount = parseFloat(investmentsResult.rows[0].total_amount);
    const payoutsAmount = parseFloat(payoutsResult.rows[0].total_amount);
    const profitabilityRate = investmentsAmount > 0 ? 
      ((payoutsAmount / investmentsAmount) * 100) : 0;

    console.log(`   Пользователи: ${usersCount}`);
    console.log(`   Инвестиции: $${investmentsAmount}`);
    console.log(`   Выплаты: $${payoutsAmount}`);
    console.log(`   Доходность: ${profitabilityRate.toFixed(2)}%`);

    // Тестируем функцию обновления статистики
    console.log('\n🔄 Тестируем функцию updateStatistics...');
    
    // Импортируем и вызываем функцию обновления
    const { updateStatistics } = require('./lib/update-statistics.ts');
    const result = await updateStatistics();
    
    if (result.success) {
      console.log('✅ Статистика успешно обновлена:');
      console.log(`   Пользователи: ${result.data.users_count} (изменение: ${result.data.users_change}%)`);
      console.log(`   Инвестиции: $${result.data.investments_amount} (изменение: ${result.data.investments_change}%)`);
      console.log(`   Выплаты: $${result.data.payouts_amount} (изменение: ${result.data.payouts_change}%)`);
      console.log(`   Доходность: ${result.data.profitability_rate}% (изменение: ${result.data.profitability_change}%)`);
    } else {
      console.log('❌ Ошибка обновления статистики:', result.error);
    }

    // Проверяем обновленную статистику
    console.log('\n📊 Статистика после обновления:');
    const updatedStats = await pool.query(`
      SELECT 
        users_count,
        investments_amount,
        payouts_amount,
        profitability_rate,
        updated_at
      FROM platform_statistics 
      ORDER BY updated_at DESC 
      LIMIT 1
    `);

    if (updatedStats.rows.length > 0) {
      const stats = updatedStats.rows[0];
      console.log(`   Пользователи: ${stats.users_count}`);
      console.log(`   Инвестиции: $${stats.investments_amount}`);
      console.log(`   Выплаты: $${stats.payouts_amount}`);
      console.log(`   Доходность: ${stats.profitability_rate}%`);
      console.log(`   Обновлено: ${new Date(stats.updated_at).toLocaleString()}`);
    }

    console.log('\n✅ Тест завершен успешно!');

  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
  } finally {
    await pool.end();
  }
}

testAutoStatisticsUpdate();
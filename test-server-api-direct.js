require('dotenv').config({ path: '.env.production' });

// Импортируем те же модули, что использует API
const { Pool } = require('pg');

// Создаем подключение точно так же, как в server/db.ts
const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL || process.env.POSTGRES_URL;
const pool = new Pool({ 
  connectionString,
  ssl: connectionString?.includes('sslmode=require') ? { rejectUnauthorized: false } : false
});

async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

async function testServerAPIDirect() {
  try {
    console.log('🧪 Тестируем API статистики напрямую с теми же настройками...\n');
    
    console.log('🔗 Используем connection string:', connectionString?.substring(0, 50) + '...');
    
    // Выполняем тот же запрос, что и в API статистики
    console.log('\n📊 Выполняем запрос из API статистики:');
    const result = await query(`
      SELECT 
        users_count,
        users_change,
        investments_amount,
        investments_change,
        payouts_amount,
        payouts_change,
        profitability_rate,
        profitability_change,
        updated_at
      FROM platform_statistics 
      ORDER BY id DESC 
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      console.log('❌ Нет данных в таблице platform_statistics');
    } else {
      const stats = result.rows[0];
      console.log('📊 Данные из базы данных:');
      console.log(`   Пользователи: ${stats.users_count}`);
      console.log(`   Инвестиции: ${stats.investments_amount}`);
      console.log(`   Выплаты: ${stats.payouts_amount}`);
      console.log(`   Доходность: ${stats.profitability_rate}%`);
      console.log(`   Обновлено: ${new Date(stats.updated_at).toLocaleString()}`);

      // Форматируем данные так же, как в API
      const formattedStats = {
        users_count: parseInt(stats.users_count),
        users_change: parseFloat(stats.users_change),
        investments_amount: parseInt(stats.investments_amount),
        investments_change: parseFloat(stats.investments_change),
        payouts_amount: parseInt(stats.payouts_amount),
        payouts_change: parseFloat(stats.payouts_change),
        profitability_rate: parseFloat(stats.profitability_rate),
        profitability_change: parseFloat(stats.profitability_change),
        updated_at: stats.updated_at
      };

      console.log('\n📊 Форматированные данные (как в API):');
      console.log(JSON.stringify(formattedStats, null, 2));
    }

    // Теперь обновим статистику и сразу проверим
    console.log('\n🔄 Обновляем статистику...');
    const { updateStatistics } = require('./lib/update-statistics.js');
    await updateStatistics();

    console.log('\n📊 Проверяем данные после обновления:');
    const resultAfter = await query(`
      SELECT 
        users_count,
        users_change,
        investments_amount,
        investments_change,
        payouts_amount,
        payouts_change,
        profitability_rate,
        profitability_change,
        updated_at
      FROM platform_statistics 
      ORDER BY id DESC 
      LIMIT 1
    `);

    if (resultAfter.rows.length > 0) {
      const statsAfter = resultAfter.rows[0];
      console.log(`   Пользователи: ${statsAfter.users_count}`);
      console.log(`   Инвестиции: ${statsAfter.investments_amount}`);
      console.log(`   Выплаты: ${statsAfter.payouts_amount}`);
      console.log(`   Доходность: ${statsAfter.profitability_rate}%`);
      console.log(`   Обновлено: ${new Date(statsAfter.updated_at).toLocaleString()}`);

      // Сравниваем время обновления
      if (result.rows.length > 0) {
        const timeBefore = new Date(result.rows[0].updated_at);
        const timeAfter = new Date(statsAfter.updated_at);
        
        if (timeAfter > timeBefore) {
          console.log('\n✅ Данные в базе обновились!');
        } else {
          console.log('\n❌ Данные в базе НЕ обновились');
        }
      }
    }

  } catch (error) {
    console.error('❌ Ошибка тестирования:', error);
  } finally {
    await pool.end();
  }
}

testServerAPIDirect();
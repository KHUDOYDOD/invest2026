require('dotenv').config({ path: '.env.production' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
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

async function debugStatisticsTable() {
  try {
    console.log('🔍 Диагностика таблицы platform_statistics...\n');
    
    // 1. Проверяем все записи в таблице
    console.log('1️⃣ Все записи в таблице platform_statistics:');
    const allRecords = await query(`
      SELECT 
        id,
        users_count,
        investments_amount,
        payouts_amount,
        profitability_rate,
        updated_at
      FROM platform_statistics 
      ORDER BY id ASC
    `);
    
    if (allRecords.rows.length === 0) {
      console.log('❌ Таблица пустая!');
    } else {
      console.log(`📊 Найдено ${allRecords.rows.length} записей:`);
      allRecords.rows.forEach((record, index) => {
        console.log(`   ${index + 1}. ID: ${record.id}, Инвестиции: ${record.investments_amount}, Обновлено: ${new Date(record.updated_at).toLocaleString()}`);
      });
    }

    // 2. Проверяем запрос, который использует API (ORDER BY id DESC)
    console.log('\n2️⃣ Запрос API (ORDER BY id DESC LIMIT 1):');
    const apiQuery = await query(`
      SELECT 
        id,
        users_count,
        investments_amount,
        payouts_amount,
        profitability_rate,
        updated_at
      FROM platform_statistics 
      ORDER BY id DESC 
      LIMIT 1
    `);
    
    if (apiQuery.rows.length > 0) {
      const record = apiQuery.rows[0];
      console.log(`   ID: ${record.id}, Инвестиции: ${record.investments_amount}, Обновлено: ${new Date(record.updated_at).toLocaleString()}`);
    } else {
      console.log('❌ Запрос API не вернул данных!');
    }

    // 3. Проверяем запрос по времени обновления (ORDER BY updated_at DESC)
    console.log('\n3️⃣ Запрос по времени (ORDER BY updated_at DESC LIMIT 1):');
    const timeQuery = await query(`
      SELECT 
        id,
        users_count,
        investments_amount,
        payouts_amount,
        profitability_rate,
        updated_at
      FROM platform_statistics 
      ORDER BY updated_at DESC 
      LIMIT 1
    `);
    
    if (timeQuery.rows.length > 0) {
      const record = timeQuery.rows[0];
      console.log(`   ID: ${record.id}, Инвестиции: ${record.investments_amount}, Обновлено: ${new Date(record.updated_at).toLocaleString()}`);
    }

    // 4. Если есть несколько записей, удаляем старые и оставляем только последнюю
    if (allRecords.rows.length > 1) {
      console.log('\n4️⃣ Найдено несколько записей, очищаем таблицу...');
      
      // Сохраняем последнюю запись
      const latestRecord = timeQuery.rows[0];
      
      // Удаляем все записи
      await query('DELETE FROM platform_statistics');
      
      // Вставляем только последнюю запись с ID = 1
      await query(`
        INSERT INTO platform_statistics (
          id,
          users_count,
          users_change,
          investments_amount,
          investments_change,
          payouts_amount,
          payouts_change,
          profitability_rate,
          profitability_change,
          updated_at
        ) VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        latestRecord.users_count,
        0,
        latestRecord.investments_amount,
        0,
        latestRecord.payouts_amount,
        0,
        latestRecord.profitability_rate,
        0,
        latestRecord.updated_at
      ]);
      
      // Сбрасываем последовательность ID
      await query('ALTER SEQUENCE platform_statistics_id_seq RESTART WITH 2');
      
      console.log('✅ Таблица очищена, оставлена только последняя запись с ID = 1');
    }

    // 5. Финальная проверка
    console.log('\n5️⃣ Финальная проверка:');
    const finalCheck = await query(`
      SELECT 
        id,
        users_count,
        investments_amount,
        payouts_amount,
        profitability_rate,
        updated_at
      FROM platform_statistics 
      ORDER BY id DESC 
      LIMIT 1
    `);
    
    if (finalCheck.rows.length > 0) {
      const record = finalCheck.rows[0];
      console.log(`   ID: ${record.id}, Инвестиции: ${record.investments_amount}, Обновлено: ${new Date(record.updated_at).toLocaleString()}`);
    }

  } catch (error) {
    console.error('❌ Ошибка диагностики:', error);
  } finally {
    await pool.end();
  }
}

debugStatisticsTable();
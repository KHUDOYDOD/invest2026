require('dotenv').config({ path: '.env.production' });
const { Pool } = require('pg');

// Создаем подключение к базе данных
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

async function debugStatisticsIssue() {
  try {
    console.log('🔍 Диагностика проблемы со статистикой...\n');
    
    // 1. Проверяем подключение к базе данных
    console.log('1️⃣ Проверяем подключение к базе данных...');
    const connectionTest = await query('SELECT NOW() as current_time');
    console.log('✅ Подключение к БД работает:', connectionTest.rows[0].current_time);

    // 2. Проверяем существование таблицы platform_statistics
    console.log('\n2️⃣ Проверяем таблицу platform_statistics...');
    const tableCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'platform_statistics'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ Таблица platform_statistics существует');
      
      // Проверяем структуру таблицы
      const structure = await query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'platform_statistics'
        ORDER BY ordinal_position;
      `);
      console.log('📋 Структура таблицы:');
      structure.rows.forEach(col => {
        console.log(`   ${col.column_name}: ${col.data_type}`);
      });
      
      // Проверяем данные в таблице
      const dataCheck = await query('SELECT * FROM platform_statistics ORDER BY updated_at DESC LIMIT 1');
      if (dataCheck.rows.length > 0) {
        console.log('📊 Текущие данные в таблице:');
        console.log(dataCheck.rows[0]);
      } else {
        console.log('⚠️ Таблица platform_statistics пустая');
      }
    } else {
      console.log('❌ Таблица platform_statistics НЕ существует!');
      
      // Создаем таблицу
      console.log('🔧 Создаем таблицу platform_statistics...');
      await query(`
        CREATE TABLE IF NOT EXISTS platform_statistics (
          id SERIAL PRIMARY KEY,
          users_count INTEGER DEFAULT 0,
          users_change DECIMAL(10,2) DEFAULT 0,
          investments_amount BIGINT DEFAULT 0,
          investments_change DECIMAL(10,2) DEFAULT 0,
          payouts_amount BIGINT DEFAULT 0,
          payouts_change DECIMAL(10,2) DEFAULT 0,
          profitability_rate DECIMAL(10,2) DEFAULT 0,
          profitability_change DECIMAL(10,2) DEFAULT 0,
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);
      console.log('✅ Таблица platform_statistics создана');
    }

    // 3. Проверяем данные для расчета статистики
    console.log('\n3️⃣ Проверяем данные для расчета статистики...');
    
    // Количество пользователей
    const usersResult = await query('SELECT COUNT(*) as count FROM users');
    console.log(`👥 Пользователей: ${usersResult.rows[0].count}`);
    
    // Инвестиции
    const investmentsResult = await query(`
      SELECT 
        COALESCE(SUM(amount), 0) as total_amount,
        COUNT(*) as count
      FROM transactions 
      WHERE type = 'investment' AND status = 'completed'
    `);
    console.log(`💰 Инвестиций: ${investmentsResult.rows[0].total_amount} (${investmentsResult.rows[0].count} транзакций)`);
    
    // Выплаты
    const payoutsResult = await query(`
      SELECT 
        COALESCE(SUM(amount), 0) as total_amount,
        COUNT(*) as count
      FROM transactions 
      WHERE type = 'withdrawal' AND status = 'completed'
    `);
    console.log(`💸 Выплат: ${payoutsResult.rows[0].total_amount} (${payoutsResult.rows[0].count} транзакций)`);

    // 4. Пробуем обновить статистику вручную
    console.log('\n4️⃣ Обновляем статистику вручную...');
    
    const usersCount = parseInt(usersResult.rows[0].count);
    const investmentsAmount = parseFloat(investmentsResult.rows[0].total_amount);
    const payoutsAmount = parseFloat(payoutsResult.rows[0].total_amount);
    const profitabilityRate = investmentsAmount > 0 ? 
      ((payoutsAmount / investmentsAmount) * 100) : 0;

    // Проверяем, есть ли уже запись
    const checkResult = await query('SELECT id FROM platform_statistics ORDER BY updated_at DESC LIMIT 1');
    
    if (checkResult.rows.length > 0) {
      // Обновляем существующую запись
      await query(`
        UPDATE platform_statistics SET
          users_count = $1,
          users_change = 0,
          investments_amount = $2,
          investments_change = 0,
          payouts_amount = $3,
          payouts_change = 0,
          profitability_rate = $4,
          profitability_change = 0,
          updated_at = NOW()
        WHERE id = $5
      `, [
        usersCount,
        Math.round(investmentsAmount),
        Math.round(payoutsAmount),
        Math.round(profitabilityRate * 100) / 100,
        checkResult.rows[0].id
      ]);
      console.log('✅ Статистика обновлена (UPDATE)');
    } else {
      // Создаем новую запись
      await query(`
        INSERT INTO platform_statistics (
          users_count,
          users_change,
          investments_amount,
          investments_change,
          payouts_amount,
          payouts_change,
          profitability_rate,
          profitability_change,
          updated_at
        ) VALUES ($1, 0, $2, 0, $3, 0, $4, 0, NOW())
      `, [
        usersCount,
        Math.round(investmentsAmount),
        Math.round(payoutsAmount),
        Math.round(profitabilityRate * 100) / 100
      ]);
      console.log('✅ Статистика создана (INSERT)');
    }

    // 5. Проверяем результат
    console.log('\n5️⃣ Проверяем результат...');
    const finalCheck = await query('SELECT * FROM platform_statistics ORDER BY updated_at DESC LIMIT 1');
    console.log('📊 Обновленная статистика:');
    console.log(finalCheck.rows[0]);

    console.log('\n🎉 Диагностика завершена!');

  } catch (error) {
    console.error('❌ Ошибка диагностики:', error);
  } finally {
    await pool.end();
  }
}

debugStatisticsIssue();
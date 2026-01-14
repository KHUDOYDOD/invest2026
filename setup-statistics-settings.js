const { Pool } = require('pg')

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/invest_platform'
})

async function setupStatisticsSettings() {
  try {
    console.log('🔧 Создание таблицы statistics_settings...\n')
    
    // Создаем таблицу
    await pool.query(`
      CREATE TABLE IF NOT EXISTS statistics_settings (
        id SERIAL PRIMARY KEY,
        total_users INTEGER DEFAULT 15000,
        total_invested NUMERIC(15, 2) DEFAULT 2800000.00,
        total_paid NUMERIC(15, 2) DEFAULT 1500000.00,
        average_return NUMERIC(5, 2) DEFAULT 24.80,
        users_change NUMERIC(5, 2) DEFAULT 12.50,
        investments_change NUMERIC(5, 2) DEFAULT 8.30,
        payouts_change NUMERIC(5, 2) DEFAULT 15.70,
        profitability_change NUMERIC(5, 2) DEFAULT 2.10,
        use_real_data BOOLEAN DEFAULT FALSE,
        updated_at TIMESTAMP DEFAULT NOW(),
        updated_by INTEGER
      )
    `)
    
    console.log('✅ Таблица создана')
    
    // Проверяем, есть ли уже данные
    const check = await pool.query('SELECT COUNT(*) FROM statistics_settings')
    
    if (parseInt(check.rows[0].count) === 0) {
      // Вставляем начальные данные
      await pool.query(`
        INSERT INTO statistics_settings (
          total_users,
          total_invested,
          total_paid,
          average_return,
          use_real_data
        ) VALUES ($1, $2, $3, $4, $5)
      `, [15000, 2800000.00, 1500000.00, 24.80, false])
      
      console.log('✅ Начальные данные добавлены')
    } else {
      console.log('ℹ️  Данные уже существуют')
    }
    
    // Показываем текущие настройки
    const result = await pool.query('SELECT * FROM statistics_settings LIMIT 1')
    console.log('\n📊 Текущие настройки статистики:')
    console.log('─'.repeat(60))
    console.log(`Активных инвесторов: ${result.rows[0].total_users.toLocaleString()}`)
    console.log(`Общие инвестиции: $${parseFloat(result.rows[0].total_invested).toLocaleString()}`)
    console.log(`Выплачено прибыли: $${parseFloat(result.rows[0].total_paid).toLocaleString()}`)
    console.log(`Средняя доходность: ${result.rows[0].average_return}%`)
    console.log(`Использовать реальные данные: ${result.rows[0].use_real_data ? 'ДА' : 'НЕТ'}`)
    console.log('─'.repeat(60))
    
    console.log('\n✅ Настройка завершена!')
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message)
  } finally {
    await pool.end()
  }
}

setupStatisticsSettings()

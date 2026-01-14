const { Pool } = require('pg')
const fs = require('fs')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
})

async function setupStatisticsTable() {
  try {
    console.log('Создаем таблицу статистики...')

    // Читаем SQL файл
    const sql = fs.readFileSync('create-statistics-table.sql', 'utf8')
    
    // Выполняем SQL
    await pool.query(sql)

    console.log('✅ Таблица platform_statistics создана успешно!')

    // Проверяем данные
    const result = await pool.query('SELECT * FROM platform_statistics ORDER BY id DESC LIMIT 1')
    
    if (result.rows.length > 0) {
      console.log('\n📊 Текущая статистика:')
      console.log(`  Активные инвесторы: ${result.rows[0].users_count} (${result.rows[0].users_change}%)`)
      console.log(`  Месячные инвестиции: $${(result.rows[0].investments_amount / 1000000).toFixed(1)}M (${result.rows[0].investments_change}%)`)
      console.log(`  Выплачено прибыли: $${(result.rows[0].payouts_amount / 1000000).toFixed(1)}M (${result.rows[0].payouts_change}%)`)
      console.log(`  Средняя доходность: ${result.rows[0].profitability_rate}% (${result.rows[0].profitability_change}%)`)
    }

  } catch (error) {
    console.error('❌ Ошибка создания таблицы:', error)
  } finally {
    await pool.end()
  }
}

setupStatisticsTable()
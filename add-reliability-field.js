const { Pool } = require('pg')
const fs = require('fs')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
})

async function addReliabilityField() {
  try {
    console.log('Добавляем поле "Надежность" в таблицу статистики...')

    // Читаем SQL файл
    const sql = fs.readFileSync('add-reliability-field.sql', 'utf8')
    
    // Выполняем SQL
    await pool.query(sql)

    console.log('✅ Поле "reliability" добавлено успешно!')

    // Проверяем данные
    const result = await pool.query('SELECT * FROM platform_statistics ORDER BY id DESC LIMIT 1')
    
    if (result.rows.length > 0) {
      console.log('\n📊 Обновленная статистика:')
      console.log(`  Активные инвесторы: ${result.rows[0].users_count}`)
      console.log(`  Общие инвестиции: $${(result.rows[0].investments_amount / 1000000).toFixed(1)}M`)
      console.log(`  Средняя доходность: ${result.rows[0].profitability_rate}%`)
      console.log(`  Надежность: ${result.rows[0].reliability}%`)
    }

  } catch (error) {
    console.error('❌ Ошибка добавления поля:', error)
  } finally {
    await pool.end()
  }
}

addReliabilityField()

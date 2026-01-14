const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
})

async function checkTablesStructure() {
  try {
    console.log('Проверяем структуру таблиц заявок...')

    // Проверяем структуру deposit_requests
    const depositColumns = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'deposit_requests' 
      ORDER BY ordinal_position
    `)

    console.log('\n📋 Структура таблицы deposit_requests:')
    depositColumns.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`)
    })

    // Проверяем структуру withdrawal_requests
    const withdrawalColumns = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'withdrawal_requests' 
      ORDER BY ordinal_position
    `)

    console.log('\n📋 Структура таблицы withdrawal_requests:')
    withdrawalColumns.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`)
    })

    // Проверяем данные в таблицах
    const depositCount = await pool.query('SELECT COUNT(*) FROM deposit_requests')
    const withdrawalCount = await pool.query('SELECT COUNT(*) FROM withdrawal_requests')

    console.log(`\n📊 Количество заявок на пополнение: ${depositCount.rows[0].count}`)
    console.log(`📊 Количество заявок на вывод: ${withdrawalCount.rows[0].count}`)

    // Показываем примеры данных
    if (parseInt(depositCount.rows[0].count) > 0) {
      const sampleDeposits = await pool.query('SELECT * FROM deposit_requests LIMIT 3')
      console.log('\n📝 Примеры заявок на пополнение:')
      sampleDeposits.rows.forEach((row, i) => {
        console.log(`  ${i+1}. ID: ${row.id}, User: ${row.user_id}, Amount: ${row.amount}, Method: ${row.method}, Status: ${row.status}`)
      })
    }

    if (parseInt(withdrawalCount.rows[0].count) > 0) {
      const sampleWithdrawals = await pool.query('SELECT * FROM withdrawal_requests LIMIT 3')
      console.log('\n📝 Примеры заявок на вывод:')
      sampleWithdrawals.rows.forEach((row, i) => {
        console.log(`  ${i+1}. ID: ${row.id}, User: ${row.user_id}, Amount: ${row.amount}, Method: ${row.method}, Status: ${row.status}`)
      })
    }

  } catch (error) {
    console.error('❌ Ошибка проверки структуры таблиц:', error)
  } finally {
    await pool.end()
  }
}

checkTablesStructure()
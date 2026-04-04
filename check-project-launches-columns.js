const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

async function checkColumns() {
  try {
    console.log('🔍 Проверяем структуру таблицы project_launches...')
    
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'project_launches' 
      ORDER BY ordinal_position
    `)
    
    console.log('\n📋 Колонки в таблице project_launches:')
    result.rows.forEach(row => {
      console.log(`- ${row.column_name} (${row.data_type}) ${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`)
    })
    
    // Проверим есть ли поля для управления функциями
    const controlFields = ['disable_registration', 'disable_investments', 'disable_deposits', 'disable_withdrawals']
    const existingFields = result.rows.map(row => row.column_name)
    
    console.log('\n🔧 Проверка полей управления функциями:')
    controlFields.forEach(field => {
      const exists = existingFields.includes(field)
      console.log(`- ${field}: ${exists ? '✅ Существует' : '❌ Отсутствует'}`)
    })
    
    // Проверим данные в таблице
    const dataResult = await pool.query('SELECT * FROM project_launches LIMIT 1')
    console.log('\n📊 Пример записи:')
    if (dataResult.rows.length > 0) {
      console.log(JSON.stringify(dataResult.rows[0], null, 2))
    } else {
      console.log('Таблица пуста')
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message)
  } finally {
    await pool.end()
  }
}

checkColumns()
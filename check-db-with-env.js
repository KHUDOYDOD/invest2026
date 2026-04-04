const { Pool } = require('pg')

// Используем Neon DATABASE_URL напрямую
const DATABASE_URL = 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'

const pool = new Pool({
  connectionString: DATABASE_URL
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
    
    // Если поля отсутствуют, добавим их
    const missingFields = controlFields.filter(field => !existingFields.includes(field))
    if (missingFields.length > 0) {
      console.log('\n🔧 Добавляем отсутствующие поля...')
      for (const field of missingFields) {
        try {
          await pool.query(`ALTER TABLE project_launches ADD COLUMN ${field} BOOLEAN DEFAULT false`)
          console.log(`✅ Добавлено поле: ${field}`)
        } catch (error) {
          console.log(`❌ Ошибка добавления ${field}: ${error.message}`)
        }
      }
    }
    
    // Проверим данные в таблице
    const dataResult = await pool.query('SELECT * FROM project_launches LIMIT 1')
    console.log('\n📊 Пример записи:')
    if (dataResult.rows.length > 0) {
      const record = dataResult.rows[0]
      console.log('ID:', record.id)
      console.log('Title:', record.title)
      console.log('disable_registration:', record.disable_registration)
      console.log('disable_investments:', record.disable_investments)
      console.log('disable_deposits:', record.disable_deposits)
      console.log('disable_withdrawals:', record.disable_withdrawals)
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
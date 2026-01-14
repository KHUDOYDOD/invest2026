const { Pool } = require('pg')

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/invest_platform'
})

async function checkUserStructure() {
  try {
    console.log('🔍 Проверка структуры таблицы users...\n')
    
    // Проверяем структуру
    const structure = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `)
    
    console.log('📋 Колонки таблицы users:')
    structure.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`)
    })
    
    // Проверяем пользователя
    console.log('\n👤 Пользователь ID 4:')
    const user = await pool.query('SELECT * FROM users WHERE id = 4')
    if (user.rows.length > 0) {
      console.log(JSON.stringify(user.rows[0], null, 2))
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message)
  } finally {
    await pool.end()
  }
}

checkUserStructure()

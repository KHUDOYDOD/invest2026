const { Pool } = require('pg')

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/invest_platform'
})

async function makeUserAdmin() {
  try {
    // Делаем пользователя с ID 4 администратором
    await pool.query('UPDATE users SET role = $1 WHERE id = $2', ['admin', 4])
    console.log('✅ User ID 4 (123456@123456.123456) is now admin')
    
    // Проверяем
    const result = await pool.query('SELECT id, email, role FROM users WHERE id = 4')
    console.log('Updated user:', result.rows[0])
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await pool.end()
  }
}

makeUserAdmin()

const { Pool } = require('pg')

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/invest_platform'
})

async function checkUserRole() {
  try {
    const result = await pool.query(
      'SELECT id, email, role FROM users WHERE email = $1',
      ['salamoni@salamoni.salamoni']
    )
    
    if (result.rows.length > 0) {
      console.log('User found:', result.rows[0])
      
      if (result.rows[0].role !== 'admin') {
        console.log('\n⚠️  User is not admin! Updating role...')
        await pool.query('UPDATE users SET role = $1 WHERE id = $2', ['admin', result.rows[0].id])
        console.log('✅ User role updated to admin')
      } else {
        console.log('✅ User is already admin')
      }
    } else {
      console.log('❌ User not found')
    }
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await pool.end()
  }
}

checkUserRole()

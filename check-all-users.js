const { Pool } = require('pg')

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/invest_platform'
})

async function checkAllUsers() {
  try {
    console.log('👥 Проверка всех пользователей...\n')
    
    const result = await pool.query(`
      SELECT id, email, role, status, created_at
      FROM users
      ORDER BY id
    `)
    
    console.log(`Найдено пользователей: ${result.rows.length}\n`)
    console.log('═'.repeat(80))
    
    result.rows.forEach(user => {
      console.log(`ID: ${user.id}`)
      console.log(`Email: ${user.email}`)
      console.log(`Role: ${user.role}`)
      console.log(`Status: ${user.status}`)
      console.log(`Created: ${new Date(user.created_at).toLocaleString('ru-RU')}`)
      console.log('─'.repeat(80))
    })
    
    console.log('\n💡 Для входа используйте любой из этих email')
    console.log('💡 Если забыли пароль, могу создать нового пользователя или сбросить пароль')
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message)
  } finally {
    await pool.end()
  }
}

checkAllUsers()

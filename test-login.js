const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/invest_platform'
})

async function testLogin() {
  try {
    const args = process.argv.slice(2)
    
    if (args.length < 2) {
      console.log('❌ Использование: node test-login.js <email> <пароль>')
      console.log('\nПример:')
      console.log('  node test-login.js admin@admin.admin admin123')
      process.exit(1)
    }
    
    const email = args[0]
    const password = args[1]
    
    console.log(`🔐 Тест входа для: ${email}\n`)
    
    // Получаем пользователя
    const result = await pool.query(
      'SELECT id, email, password_hash, role, status FROM users WHERE email = $1',
      [email]
    )
    
    if (result.rows.length === 0) {
      console.log('❌ Пользователь не найден!')
      process.exit(1)
    }
    
    const user = result.rows[0]
    
    console.log('✅ Пользователь найден:')
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   Status: ${user.status}`)
    console.log(`   Password hash: ${user.password_hash.substring(0, 20)}...`)
    
    // Проверяем пароль
    console.log('\n🔍 Проверка пароля...')
    const isValid = await bcrypt.compare(password, user.password_hash)
    
    if (isValid) {
      console.log('✅ Пароль ПРАВИЛЬНЫЙ!')
      console.log('\n═'.repeat(50))
      console.log('✅ Вход должен работать!')
      console.log('═'.repeat(50))
    } else {
      console.log('❌ Пароль НЕПРАВИЛЬНЫЙ!')
      console.log('\n💡 Попробуйте сбросить пароль:')
      console.log(`   node reset-password.js ${email} новый_пароль`)
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message)
  } finally {
    await pool.end()
  }
}

testLogin()

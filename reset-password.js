const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/invest_platform'
})

async function resetPassword() {
  try {
    const args = process.argv.slice(2)
    
    if (args.length < 2) {
      console.log('❌ Использование: node reset-password.js <email> <новый_пароль>')
      console.log('\nПример:')
      console.log('  node reset-password.js admin@admin.admin newpassword123')
      process.exit(1)
    }
    
    const email = args[0]
    const newPassword = args[1]
    
    console.log(`🔑 Сброс пароля для: ${email}\n`)
    
    // Проверяем, существует ли пользователь
    const user = await pool.query('SELECT id, email, role FROM users WHERE email = $1', [email])
    
    if (user.rows.length === 0) {
      console.log('❌ Пользователь не найден!')
      process.exit(1)
    }
    
    console.log('✅ Пользователь найден:')
    console.log(`   ID: ${user.rows[0].id}`)
    console.log(`   Email: ${user.rows[0].email}`)
    console.log(`   Role: ${user.rows[0].role}`)
    
    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    // Обновляем пароль
    await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [hashedPassword, email])
    
    console.log('\n✅ Пароль успешно обновлен!')
    console.log('═'.repeat(50))
    console.log(`📧 Email: ${email}`)
    console.log(`🔑 Новый пароль: ${newPassword}`)
    console.log('═'.repeat(50))
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message)
  } finally {
    await pool.end()
  }
}

resetPassword()

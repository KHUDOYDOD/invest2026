const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/invest_platform'
})

async function createTestAdmin() {
  try {
    const email = 'admin@admin.admin'
    const password = 'admin123'
    
    console.log('👤 Создание тестового администратора...\n')
    
    // Проверяем, существует ли уже
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    
    if (existing.rows.length > 0) {
      console.log('⚠️  Пользователь уже существует, обновляю пароль...')
      
      const hashedPassword = await bcrypt.hash(password, 10)
      await pool.query(
        'UPDATE users SET password_hash = $1, role = $2 WHERE email = $3',
        [hashedPassword, 'admin', email]
      )
      
      console.log('✅ Пароль обновлен!')
    } else {
      console.log('Создаю нового пользователя...')
      
      const hashedPassword = await bcrypt.hash(password, 10)
      await pool.query(
        `INSERT INTO users (
          email, 
          password_hash, 
          full_name, 
          role, 
          status,
          balance,
          referral_code,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [email, hashedPassword, 'Admin User', 'admin', 'active', 0, 'ADMIN123']
      )
      
      console.log('✅ Пользователь создан!')
    }
    
    console.log('\n═'.repeat(60))
    console.log('📧 Email: admin@admin.admin')
    console.log('🔑 Пароль: admin123')
    console.log('👑 Роль: admin')
    console.log('═'.repeat(60))
    console.log('\n✅ Используйте эти данные для входа!')
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message)
  } finally {
    await pool.end()
  }
}

createTestAdmin()

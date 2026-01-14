const { Pool } = require('pg')

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/invest_platform'
})

async function testDepositFlow() {
  try {
    console.log('🧪 Тестирование потока заявок на пополнение...\n')
    
    // 1. Проверяем существующие заявки
    console.log('1️⃣ Проверка существующих заявок:')
    const existingRequests = await pool.query(`
      SELECT 
        dr.id,
        dr.user_id,
        u.email,
        dr.amount,
        dr.method,
        dr.status,
        dr.created_at
      FROM deposit_requests dr
      LEFT JOIN users u ON dr.user_id = u.id
      ORDER BY dr.created_at DESC
      LIMIT 5
    `)
    
    console.log(`   Найдено заявок: ${existingRequests.rows.length}`)
    existingRequests.rows.forEach(req => {
      console.log(`   - ID: ${req.id}, User: ${req.email}, Amount: $${req.amount}, Status: ${req.status}`)
    })
    console.log()
    
    // 2. Проверяем структуру таблицы
    console.log('2️⃣ Проверка структуры таблицы deposit_requests:')
    const structure = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'deposit_requests'
      ORDER BY ordinal_position
    `)
    
    structure.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`)
    })
    console.log()
    
    // 3. Проверяем пользователей
    console.log('3️⃣ Проверка пользователей:')
    const users = await pool.query(`
      SELECT id, email, role, balance
      FROM users
      ORDER BY id
      LIMIT 5
    `)
    
    users.rows.forEach(user => {
      console.log(`   - ID: ${user.id}, Email: ${user.email}, Role: ${user.role}, Balance: $${user.balance}`)
    })
    console.log()
    
    // 4. Статистика по статусам
    console.log('4️⃣ Статистика по статусам заявок:')
    const stats = await pool.query(`
      SELECT status, COUNT(*) as count, SUM(amount) as total_amount
      FROM deposit_requests
      GROUP BY status
    `)
    
    stats.rows.forEach(stat => {
      console.log(`   - ${stat.status}: ${stat.count} заявок на сумму $${stat.total_amount}`)
    })
    console.log()
    
    console.log('✅ Тест завершен успешно!')
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message)
  } finally {
    await pool.end()
  }
}

testDepositFlow()

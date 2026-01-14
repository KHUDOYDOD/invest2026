const { Pool } = require('pg')

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/invest_platform'
})

async function checkDepositRequests() {
  try {
    console.log('🔍 Проверка заявок на пополнение...\n')
    
    const result = await pool.query(`
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
      LIMIT 10
    `)
    
    console.log(`📋 Найдено заявок: ${result.rows.length}\n`)
    
    result.rows.forEach(req => {
      console.log(`ID: ${req.id}`)
      console.log(`User ID: ${req.user_id} (${req.email || 'unknown'})`)
      console.log(`Amount: $${req.amount}`)
      console.log(`Method: ${req.method}`)
      console.log(`Status: ${req.status}`)
      console.log(`Created: ${req.created_at}`)
      console.log('─'.repeat(50))
    })
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message)
  } finally {
    await pool.end()
  }
}

checkDepositRequests()

const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
})

async function createTestRequests() {
  try {
    console.log('Создаем тестовые заявки...')

    // Получаем ID тестового пользователя
    const userResult = await pool.query(
      "SELECT id FROM users WHERE email = 'test@example.com' LIMIT 1"
    )

    if (userResult.rows.length === 0) {
      console.log('Тестовый пользователь не найден. Создаем...')
      
      const newUser = await pool.query(`
        INSERT INTO users (full_name, email, password, balance, role_id, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING id
      `, ['Тест Пользователь', 'test@example.com', 'hashed_password', 1000.00, 2])
      
      var userId = newUser.rows[0].id
    } else {
      var userId = userResult.rows[0].id
    }

    console.log('ID пользователя:', userId)

    // Проверяем, существуют ли таблицы
    const tablesCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('deposit_requests', 'withdrawal_requests')
    `)

    console.log('Найденные таблицы:', tablesCheck.rows.map(r => r.table_name))

    // Создаем таблицы если их нет
    if (!tablesCheck.rows.find(r => r.table_name === 'deposit_requests')) {
      console.log('Создаем таблицу deposit_requests...')
      await pool.query(`
        CREATE TABLE deposit_requests (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          amount DECIMAL(10,2) NOT NULL,
          method VARCHAR(100) NOT NULL,
          payment_details JSONB,
          wallet_address VARCHAR(255),
          status VARCHAR(20) DEFAULT 'pending',
          admin_comment TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          processed_at TIMESTAMP,
          processed_by INTEGER REFERENCES users(id)
        )
      `)
    }

    if (!tablesCheck.rows.find(r => r.table_name === 'withdrawal_requests')) {
      console.log('Создаем таблицу withdrawal_requests...')
      await pool.query(`
        CREATE TABLE withdrawal_requests (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          amount DECIMAL(10,2) NOT NULL,
          method VARCHAR(100) NOT NULL,
          payment_details JSONB,
          wallet_address VARCHAR(255),
          status VARCHAR(20) DEFAULT 'pending',
          admin_comment TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          processed_at TIMESTAMP,
          processed_by INTEGER REFERENCES users(id)
        )
      `)
    }

    // Удаляем старые тестовые заявки
    await pool.query('DELETE FROM deposit_requests WHERE user_id = $1', [userId])
    await pool.query('DELETE FROM withdrawal_requests WHERE user_id = $1', [userId])

    // Создаем тестовые заявки на пополнение
    const depositRequests = [
      {
        amount: 500.00,
        method: 'Банковская карта',
        payment_details: { card_number: '4111 1111 1111 1111' }
      },
      {
        amount: 1000.00,
        method: 'СБП',
        payment_details: { phone_number: '+7 900 123 45 67' }
      },
      {
        amount: 250.00,
        method: 'Криптовалюта USDT TRC-20',
        wallet_address: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE'
      }
    ]

    for (const req of depositRequests) {
      await pool.query(`
        INSERT INTO deposit_requests (user_id, amount, method, payment_details, wallet_address, status, created_at)
        VALUES ($1, $2, $3, $4, $5, 'pending', NOW())
      `, [userId, req.amount, req.method, req.payment_details || null, req.wallet_address || null])
    }

    // Создаем тестовые заявки на вывод
    const withdrawalRequests = [
      {
        amount: 200.00,
        method: 'Банковская карта',
        payment_details: { card_number: '5555 5555 5555 4444' }
      },
      {
        amount: 300.00,
        method: 'СБП',
        payment_details: { phone_number: '+7 900 987 65 43' }
      }
    ]

    for (const req of withdrawalRequests) {
      await pool.query(`
        INSERT INTO withdrawal_requests (user_id, amount, method, payment_details, wallet_address, status, created_at)
        VALUES ($1, $2, $3, $4, $5, 'pending', NOW())
      `, [userId, req.amount, req.method, req.payment_details || null, req.wallet_address || null])
    }

    console.log('✅ Тестовые заявки созданы успешно!')

    // Проверяем созданные заявки
    const depositCount = await pool.query('SELECT COUNT(*) FROM deposit_requests WHERE user_id = $1', [userId])
    const withdrawalCount = await pool.query('SELECT COUNT(*) FROM withdrawal_requests WHERE user_id = $1', [userId])

    console.log(`📊 Создано заявок на пополнение: ${depositCount.rows[0].count}`)
    console.log(`📊 Создано заявок на вывод: ${withdrawalCount.rows[0].count}`)

  } catch (error) {
    console.error('❌ Ошибка создания тестовых заявок:', error)
  } finally {
    await pool.end()
  }
}

createTestRequests()
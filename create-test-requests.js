const { Pool } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString: connectionString,
});

async function createTestRequests() {
  try {
    console.log('🔧 Создаем тестовые заявки...');
    
    const client = await pool.connect();
    
    // Получаем ID пользователей
    const users = await client.query('SELECT id, full_name FROM users LIMIT 3');
    console.log(`\n👥 Найдено пользователей: ${users.rows.length}`);
    
    if (users.rows.length === 0) {
      console.log('❌ Нет пользователей для создания заявок');
      return;
    }
    
    // Создаем тестовые заявки на пополнение
    for (let i = 0; i < 2; i++) {
      const user = users.rows[i % users.rows.length];
      await client.query(`
        INSERT INTO deposit_requests (
          id, user_id, amount, method, payment_details, status, created_at, updated_at
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, 'pending', NOW(), NOW()
        )
      `, [
        user.id,
        100 + (i * 50),
        'card',
        JSON.stringify({
          card_number: `4111111111111${111 + i}`,
          card_holder_name: user.full_name,
          transaction_hash: `tx_${Date.now()}_${i}`
        })
      ]);
    }
    
    // Создаем тестовые заявки на вывод
    for (let i = 0; i < 2; i++) {
      const user = users.rows[i % users.rows.length];
      await client.query(`
        INSERT INTO withdrawal_requests (
          id, user_id, amount, method, card_number, card_holder_name, bank_name, status, created_at, updated_at
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'pending', NOW(), NOW()
        )
      `, [
        user.id,
        200 + (i * 75),
        'card',
        `5555555555554${444 + i}`,
        user.full_name,
        'Сбербанк'
      ]);
    }
    
    console.log('✅ Тестовые заявки созданы');
    
    // Проверяем созданные заявки
    const deposits = await client.query(`
      SELECT dr.*, u.full_name as user_name 
      FROM deposit_requests dr 
      LEFT JOIN users u ON dr.user_id = u.id 
      ORDER BY dr.created_at DESC LIMIT 5
    `);
    
    const withdrawals = await client.query(`
      SELECT wr.*, u.full_name as user_name 
      FROM withdrawal_requests wr 
      LEFT JOIN users u ON wr.user_id = u.id 
      ORDER BY wr.created_at DESC LIMIT 5
    `);
    
    console.log('\n💰 Заявки на пополнение:');
    deposits.rows.forEach(req => {
      console.log(`  - ${req.user_name}: $${req.amount} (${req.status})`);
    });
    
    console.log('\n💸 Заявки на вывод:');
    withdrawals.rows.forEach(req => {
      console.log(`  - ${req.user_name}: $${req.amount} (${req.status})`);
    });
    
    client.release();
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

createTestRequests();
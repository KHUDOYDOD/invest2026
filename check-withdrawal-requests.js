const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function checkWithdrawalRequests() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('✅ Подключено к базе данных\n');

    // Проверяем структуру таблицы
    console.log('📋 Структура таблицы withdrawal_requests:');
    const structure = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'withdrawal_requests'
      ORDER BY ordinal_position
    `);
    console.table(structure.rows);

    // Проверяем количество записей
    console.log('\n📊 Статистика заявок на вывод:');
    const stats = await client.query(`
      SELECT 
        status,
        COUNT(*) as count,
        SUM(amount) as total_amount
      FROM withdrawal_requests
      GROUP BY status
    `);
    console.table(stats.rows);

    // Показываем последние 10 заявок
    console.log('\n📝 Последние 10 заявок на вывод:');
    const requests = await client.query(`
      SELECT 
        wr.id,
        wr.user_id,
        u.full_name,
        u.email,
        wr.amount,
        wr.method,
        wr.status,
        wr.created_at,
        wr.card_number,
        wr.card_holder_name,
        wr.phone_number,
        wr.account_holder_name,
        wr.wallet_address,
        wr.crypto_network
      FROM withdrawal_requests wr
      LEFT JOIN users u ON wr.user_id = u.id
      ORDER BY wr.created_at DESC
      LIMIT 10
    `);
    
    if (requests.rows.length === 0) {
      console.log('❌ Нет заявок на вывод в базе данных');
    } else {
      console.table(requests.rows);
    }

    // Проверяем, есть ли новые поля
    console.log('\n🔍 Проверка новых полей:');
    const hasNewFields = await client.query(`
      SELECT 
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'withdrawal_requests' AND column_name = 'card_number') as has_card_number,
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'withdrawal_requests' AND column_name = 'card_holder_name') as has_card_holder_name,
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'withdrawal_requests' AND column_name = 'phone_number') as has_phone_number,
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'withdrawal_requests' AND column_name = 'account_holder_name') as has_account_holder_name,
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'withdrawal_requests' AND column_name = 'crypto_network') as has_crypto_network
    `);
    console.table(hasNewFields.rows);

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await client.end();
  }
}

checkWithdrawalRequests();

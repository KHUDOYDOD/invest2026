const { Client } = require('pg');

async function addTestRequestsWithDetails() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres.hndoefvarvhfickrvlbf:_$X11021997x$_@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x'
  });

  try {
    await client.connect();
    console.log('✅ Подключение к базе данных');

    // 1. Создаем заявку на вывод через СБП с банком
    console.log('\n📱 Создание СБП заявки...');
    const sbpResult = await client.query(`
      INSERT INTO withdrawal_requests (
        user_id, amount, method, phone_number, account_holder_name, bank_name,
        fee, final_amount, status, created_at
      ) VALUES (
        1, 200.00, 'sbp', '+79123456789', 'Иван Петров', 'Сбербанк',
        4.00, 196.00, 'pending', NOW()
      ) RETURNING id
    `);
    console.log(`✅ СБП заявка создана с ID: ${sbpResult.rows[0].id}`);

    // 2. Создаем заявку на вывод через карту с банком
    console.log('\n💳 Создание заявки на карту...');
    const cardResult = await client.query(`
      INSERT INTO withdrawal_requests (
        user_id, amount, method, card_number, card_holder_name, bank_name,
        fee, final_amount, status, created_at
      ) VALUES (
        1, 150.00, 'card', '1234567890123456', 'Петр Иванов', 'ВТБ',
        3.00, 147.00, 'pending', NOW()
      ) RETURNING id
    `);
    console.log(`✅ Карта заявка создана с ID: ${cardResult.rows[0].id}`);

    // 3. Создаем заявку на вывод через крипто
    console.log('\n🔐 Создание крипто заявки...');
    const cryptoResult = await client.query(`
      INSERT INTO withdrawal_requests (
        user_id, amount, method, wallet_address, crypto_network,
        fee, final_amount, status, created_at
      ) VALUES (
        1, 300.00, 'crypto', '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 'bitcoin',
        6.00, 294.00, 'pending', NOW()
      ) RETURNING id
    `);
    console.log(`✅ Крипто заявка создана с ID: ${cryptoResult.rows[0].id}`);

    // 4. Создаем заявку на пополнение с реквизитами
    console.log('\n💰 Создание заявки на пополнение...');
    const paymentDetails = {
      card_number: '9876543210987654',
      phone_number: '+79987654321',
      transaction_hash: 'abc123def456ghi789',
      bank_name: 'Альфа-Банк'
    };

    const depositResult = await client.query(`
      INSERT INTO deposit_requests (
        user_id, amount, method, payment_details, status, created_at
      ) VALUES (
        1, 100.00, 'card', $1, 'pending', NOW()
      ) RETURNING id
    `, [JSON.stringify(paymentDetails)]);
    console.log(`✅ Пополнение заявка создана с ID: ${depositResult.rows[0].id}`);

    // 5. Создаем еще одну СБП заявку с другим банком
    console.log('\n📱 Создание второй СБП заявки...');
    const sbp2Result = await client.query(`
      INSERT INTO withdrawal_requests (
        user_id, amount, method, phone_number, account_holder_name, bank_name,
        fee, final_amount, status, created_at
      ) VALUES (
        1, 250.00, 'sbp', '+79876543210', 'Анна Сидорова', 'Тинькофф',
        5.00, 245.00, 'pending', NOW()
      ) RETURNING id
    `);
    console.log(`✅ Вторая СБП заявка создана с ID: ${sbp2Result.rows[0].id}`);

    // 6. Проверяем созданные заявки
    console.log('\n📋 Проверка созданных заявок:');
    
    const withdrawalCheck = await client.query(`
      SELECT id, method, amount, card_number, phone_number, bank_name, wallet_address, status
      FROM withdrawal_requests 
      WHERE user_id = 1 
      ORDER BY created_at DESC 
      LIMIT 10
    `);

    console.log('Заявки на вывод:');
    withdrawalCheck.rows.forEach((row, index) => {
      console.log(`${index + 1}. ID: ${row.id}, Метод: ${row.method}, Сумма: $${row.amount}`);
      if (row.card_number) console.log(`   💳 Карта: ${row.card_number}, Банк: ${row.bank_name}`);
      if (row.phone_number) console.log(`   📱 СБП: ${row.phone_number}, Банк: ${row.bank_name}`);
      if (row.wallet_address) console.log(`   🔐 Кошелек: ${row.wallet_address}`);
    });

    const depositCheck = await client.query(`
      SELECT id, method, amount, payment_details, status
      FROM deposit_requests 
      WHERE user_id = 1 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    console.log('\nЗаявки на пополнение:');
    depositCheck.rows.forEach((row, index) => {
      console.log(`${index + 1}. ID: ${row.id}, Метод: ${row.method}, Сумма: $${row.amount}`);
      if (row.payment_details) {
        const details = JSON.parse(row.payment_details);
        console.log(`   📋 Реквизиты: ${JSON.stringify(details)}`);
      }
    });

    console.log('\n🎯 Тестовые заявки с реквизитами созданы!');
    console.log('Теперь в админ панели должны отображаться все реквизиты пользователей.');

  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await client.end();
  }
}

addTestRequestsWithDetails();
const { Client } = require('pg');

async function checkUserPaymentDetails() {
  const client = new Client({
    connectionString: 'postgres://postgres.hndoefvarvhfickrvlbf:_$X11021997x$_@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x',
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Подключение к базе данных успешно');

    // 1. Проверяем заявки на вывод с реквизитами
    console.log('\n📤 ЗАЯВКИ НА ВЫВОД:');
    const withdrawalResult = await client.query(`
      SELECT 
        id, user_id, amount, method, status,
        card_number, card_holder_name, bank_name,
        phone_number, account_holder_name,
        wallet_address, crypto_network,
        created_at
      FROM withdrawal_requests 
      ORDER BY created_at DESC 
      LIMIT 10
    `);

    console.log(`Найдено ${withdrawalResult.rows.length} заявок на вывод:`);
    
    withdrawalResult.rows.forEach((row, index) => {
      console.log(`\n${index + 1}. Заявка ID: ${row.id}`);
      console.log(`   Пользователь: ${row.user_id}`);
      console.log(`   Метод: ${row.method}`);
      console.log(`   Сумма: $${row.amount}`);
      console.log(`   Статус: ${row.status}`);
      
      // Реквизиты карты
      if (row.card_number) {
        console.log(`   💳 КАРТА:`);
        console.log(`     Номер: ${row.card_number}`);
        console.log(`     Владелец: ${row.card_holder_name || 'Не указан'}`);
        console.log(`     Банк: ${row.bank_name || 'Не указан'}`);
      }
      
      // Реквизиты СБП
      if (row.phone_number) {
        console.log(`   📱 СБП:`);
        console.log(`     Телефон: ${row.phone_number}`);
        console.log(`     Владелец: ${row.account_holder_name || 'Не указан'}`);
        console.log(`     Банк: ${row.bank_name || 'Не указан'}`);
      }
      
      // Реквизиты крипто
      if (row.wallet_address) {
        console.log(`   🔐 КРИПТО:`);
        console.log(`     Адрес: ${row.wallet_address}`);
        console.log(`     Сеть: ${row.crypto_network || 'Не указана'}`);
      }
      
      if (!row.card_number && !row.phone_number && !row.wallet_address) {
        console.log(`   ❌ Реквизиты отсутствуют`);
      }
    });

    // 2. Проверяем заявки на пополнение с реквизитами
    console.log('\n📥 ЗАЯВКИ НА ПОПОЛНЕНИЕ:');
    const depositResult = await client.query(`
      SELECT 
        id, user_id, amount, method, status,
        payment_details,
        created_at
      FROM deposit_requests 
      ORDER BY created_at DESC 
      LIMIT 10
    `);

    console.log(`Найдено ${depositResult.rows.length} заявок на пополнение:`);
    
    depositResult.rows.forEach((row, index) => {
      console.log(`\n${index + 1}. Заявка ID: ${row.id}`);
      console.log(`   Пользователь: ${row.user_id}`);
      console.log(`   Метод: ${row.method}`);
      console.log(`   Сумма: $${row.amount}`);
      console.log(`   Статус: ${row.status}`);
      
      if (row.payment_details) {
        try {
          const details = typeof row.payment_details === 'string' 
            ? JSON.parse(row.payment_details) 
            : row.payment_details;
          
          console.log(`   📋 РЕКВИЗИТЫ ПОЛЬЗОВАТЕЛЯ:`);
          
          if (details.card_number) {
            console.log(`     💳 Номер карты: ${details.card_number}`);
          }
          
          if (details.phone_number) {
            console.log(`     📱 Телефон: ${details.phone_number}`);
          }
          
          if (details.wallet_address) {
            console.log(`     🔐 Кошелек: ${details.wallet_address}`);
          }
          
          if (details.transaction_hash) {
            console.log(`     🔗 Хэш транзакции: ${details.transaction_hash}`);
          }
          
          if (details.bank_name) {
            console.log(`     🏦 Банк: ${details.bank_name}`);
          }
          
        } catch (error) {
          console.log(`   ❌ Ошибка парсинга payment_details: ${error.message}`);
        }
      } else {
        console.log(`   ❌ payment_details отсутствуют`);
      }
    });

    // 3. Статистика по реквизитам
    console.log('\n📊 СТАТИСТИКА ПО РЕКВИЗИТАМ:');
    
    const withdrawalStats = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(card_number) as with_card,
        COUNT(phone_number) as with_phone,
        COUNT(wallet_address) as with_wallet
      FROM withdrawal_requests
    `);
    
    const depositStats = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(payment_details) as with_details
      FROM deposit_requests
    `);
    
    console.log('Заявки на вывод:');
    console.log(`  Всего: ${withdrawalStats.rows[0].total}`);
    console.log(`  С картой: ${withdrawalStats.rows[0].with_card}`);
    console.log(`  С телефоном (СБП): ${withdrawalStats.rows[0].with_phone}`);
    console.log(`  С кошельком: ${withdrawalStats.rows[0].with_wallet}`);
    
    console.log('Заявки на пополнение:');
    console.log(`  Всего: ${depositStats.rows[0].total}`);
    console.log(`  С реквизитами: ${depositStats.rows[0].with_details}`);

    // 4. Проверяем структуру таблиц
    console.log('\n🏗️ СТРУКТУРА ТАБЛИЦ:');
    
    const withdrawalColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'withdrawal_requests' 
      AND column_name IN ('card_number', 'card_holder_name', 'bank_name', 'phone_number', 'account_holder_name', 'wallet_address', 'crypto_network')
      ORDER BY column_name
    `);
    
    console.log('Колонки withdrawal_requests:');
    withdrawalColumns.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type}`);
    });
    
    const depositColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'deposit_requests' 
      AND column_name = 'payment_details'
    `);
    
    console.log('Колонки deposit_requests:');
    depositColumns.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type}`);
    });

  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await client.end();
  }
}

checkUserPaymentDetails();
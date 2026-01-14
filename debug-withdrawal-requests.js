const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function debugWithdrawalRequests() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('✅ Подключено к базе данных\n');

    // 1. Проверяем, существует ли таблица
    console.log('1️⃣ Проверка существования таблицы withdrawal_requests:');
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'withdrawal_requests'
      )
    `);
    console.log('Таблица существует:', tableExists.rows[0].exists);

    if (!tableExists.rows[0].exists) {
      console.log('❌ Таблица withdrawal_requests не существует!');
      return;
    }

    // 2. Считаем общее количество записей
    console.log('\n2️⃣ Общее количество заявок:');
    const count = await client.query('SELECT COUNT(*) FROM withdrawal_requests');
    console.log('Всего заявок:', count.rows[0].count);

    // 3. Проверяем по статусам
    console.log('\n3️⃣ Заявки по статусам:');
    const byStatus = await client.query(`
      SELECT status, COUNT(*) as count
      FROM withdrawal_requests
      GROUP BY status
    `);
    console.table(byStatus.rows);

    // 4. Показываем все заявки с деталями
    console.log('\n4️⃣ Все заявки на вывод:');
    const allRequests = await client.query(`
      SELECT 
        wr.id,
        wr.user_id,
        wr.amount,
        wr.method,
        wr.status,
        wr.created_at,
        u.full_name,
        u.email
      FROM withdrawal_requests wr
      LEFT JOIN users u ON wr.user_id = u.id
      ORDER BY wr.created_at DESC
    `);
    
    if (allRequests.rows.length === 0) {
      console.log('❌ В таблице нет ни одной заявки на вывод');
      console.log('\n💡 Создайте тестовую заявку:');
      console.log('   1. Зайдите на сайт как пользователь');
      console.log('   2. Перейдите в раздел "Вывод средств"');
      console.log('   3. Создайте заявку на вывод');
    } else {
      console.log(`✅ Найдено заявок: ${allRequests.rows.length}\n`);
      allRequests.rows.forEach((req, index) => {
        console.log(`\n📋 Заявка ${index + 1}:`);
        console.log(`   ID: ${req.id}`);
        console.log(`   Пользователь: ${req.full_name || 'Неизвестно'} (${req.email || 'нет email'})`);
        console.log(`   Сумма: $${req.amount}`);
        console.log(`   Способ: ${req.method}`);
        console.log(`   Статус: ${req.status}`);
        console.log(`   Дата: ${req.created_at}`);
      });
    }

    // 5. Проверяем наличие новых полей
    console.log('\n5️⃣ Проверка новых полей для реквизитов:');
    const columns = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'withdrawal_requests'
      AND column_name IN ('card_number', 'card_holder_name', 'phone_number', 'account_holder_name', 'crypto_network')
    `);
    
    const expectedFields = ['card_number', 'card_holder_name', 'phone_number', 'account_holder_name', 'crypto_network'];
    const existingFields = columns.rows.map(r => r.column_name);
    
    expectedFields.forEach(field => {
      const exists = existingFields.includes(field);
      console.log(`   ${exists ? '✅' : '❌'} ${field}: ${exists ? 'существует' : 'НЕ СУЩЕСТВУЕТ'}`);
    });

    const missingFields = expectedFields.filter(f => !existingFields.includes(f));
    if (missingFields.length > 0) {
      console.log('\n⚠️  ВНИМАНИЕ: Не хватает полей:', missingFields.join(', '));
      console.log('   Запустите: add-withdrawal-details.bat');
    }

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    console.error('Детали:', error);
  } finally {
    await client.end();
  }
}

debugWithdrawalRequests();

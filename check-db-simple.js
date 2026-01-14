const { Client } = require('pg');
const fs = require('fs');

// Читаем .env.local файл вручную
function loadEnv() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const lines = envContent.split('\n');
    const env = {};
    
    lines.forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        env[key] = value;
      }
    });
    
    return env;
  } catch (error) {
    console.error('❌ Не удалось прочитать .env.local:', error.message);
    return null;
  }
}

async function checkDatabase() {
  const env = loadEnv();
  if (!env || !env.DATABASE_URL) {
    console.error('❌ DATABASE_URL не найден в .env.local');
    return;
  }

  const client = new Client({
    connectionString: env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('✅ Подключено к базе данных\n');

    // Проверяем таблицу
    console.log('1️⃣ Проверка таблицы withdrawal_requests:');
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'withdrawal_requests'
      )
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('❌ Таблица withdrawal_requests не существует!');
      return;
    }
    console.log('✅ Таблица существует\n');

    // Считаем заявки
    console.log('2️⃣ Количество заявок:');
    const count = await client.query('SELECT COUNT(*) FROM withdrawal_requests');
    console.log(`   Всего заявок: ${count.rows[0].count}\n`);

    if (count.rows[0].count === '0') {
      console.log('⚠️  В базе данных НЕТ заявок на вывод!');
      console.log('\n💡 Решение:');
      console.log('   1. Зайдите на сайт как обычный пользователь');
      console.log('   2. Перейдите в раздел "Вывод средств"');
      console.log('   3. Создайте тестовую заявку на вывод\n');
      return;
    }

    // Показываем заявки по статусам
    console.log('3️⃣ Заявки по статусам:');
    const byStatus = await client.query(`
      SELECT status, COUNT(*) as count
      FROM withdrawal_requests
      GROUP BY status
    `);
    byStatus.rows.forEach(row => {
      console.log(`   ${row.status}: ${row.count}`);
    });

    // Показываем последние заявки
    console.log('\n4️⃣ Последние заявки:');
    const requests = await client.query(`
      SELECT 
        wr.id,
        wr.amount,
        wr.method,
        wr.status,
        wr.created_at,
        u.full_name,
        u.email
      FROM withdrawal_requests wr
      LEFT JOIN users u ON wr.user_id = u.id
      ORDER BY wr.created_at DESC
      LIMIT 5
    `);

    requests.rows.forEach((req, i) => {
      console.log(`\n   Заявка ${i + 1}:`);
      console.log(`   ID: ${req.id}`);
      console.log(`   Пользователь: ${req.full_name || 'Неизвестно'}`);
      console.log(`   Email: ${req.email || 'нет'}`);
      console.log(`   Сумма: $${req.amount}`);
      console.log(`   Способ: ${req.method}`);
      console.log(`   Статус: ${req.status}`);
      console.log(`   Дата: ${new Date(req.created_at).toLocaleString('ru-RU')}`);
    });

    // Проверяем новые поля
    console.log('\n5️⃣ Проверка полей для реквизитов:');
    const columns = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'withdrawal_requests'
      AND column_name IN ('card_number', 'card_holder_name', 'phone_number', 'account_holder_name', 'crypto_network')
    `);
    
    const fields = ['card_number', 'card_holder_name', 'phone_number', 'account_holder_name', 'crypto_network'];
    const existing = columns.rows.map(r => r.column_name);
    
    let missingFields = [];
    fields.forEach(field => {
      const exists = existing.includes(field);
      console.log(`   ${exists ? '✅' : '❌'} ${field}`);
      if (!exists) missingFields.push(field);
    });

    if (missingFields.length > 0) {
      console.log('\n⚠️  ВНИМАНИЕ: Не хватает полей!');
      console.log('   Запустите: add-withdrawal-details.bat\n');
    } else {
      console.log('\n✅ Все поля на месте!\n');
    }

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await client.end();
  }
}

checkDatabase();

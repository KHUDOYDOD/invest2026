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

// Функция для перевода названий методов оплаты (из API)
function getMethodName(method) {
  const methodNames = {
    'bank_card': 'Банковская карта',
    'card': 'Банковская карта',
    'crypto': 'Криптовалюта',
    'sbp': 'СБП',
    'bank_transfer': 'Банковский перевод',
    'e_wallet': 'Электронный кошелек',
    'usdt': 'USDT',
    'bitcoin': 'Bitcoin',
    'ethereum': 'Ethereum'
  };
  
  return methodNames[method] || method;
}

async function testAPI() {
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
    console.log('🔄 Симуляция API запроса...\n');

    // Выполняем тот же SQL запрос, что и в API
    const result = await client.query(`
      SELECT 
        wr.id,
        wr.user_id,
        wr.amount,
        wr.method,
        wr.wallet_address,
        wr.card_number,
        wr.card_holder_name,
        wr.phone_number,
        wr.account_holder_name,
        wr.crypto_network,
        wr.fee,
        wr.final_amount,
        wr.status,
        wr.admin_comment,
        wr.created_at,
        wr.processed_at,
        wr.processed_by,
        u.full_name as user_name,
        u.email as user_email
      FROM withdrawal_requests wr
      LEFT JOIN users u ON wr.user_id = u.id
      ORDER BY wr.created_at DESC
      LIMIT 100
    `);

    console.log(`✅ Найдено заявок: ${result.rows.length}\n`);

    // Форматируем данные так же, как в API
    const requests = result.rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      users: {
        id: row.user_id,
        full_name: row.user_name || 'Неизвестный пользователь',
        email: row.user_email || ''
      },
      amount: parseFloat(row.amount),
      method: getMethodName(row.method),
      wallet_address: row.wallet_address,
      card_number: row.card_number,
      card_holder_name: row.card_holder_name,
      phone_number: row.phone_number,
      account_holder_name: row.account_holder_name,
      crypto_network: row.crypto_network,
      fee: parseFloat(row.fee || 0),
      final_amount: parseFloat(row.final_amount || row.amount),
      status: row.status,
      admin_comment: row.admin_comment,
      created_at: row.created_at,
      processed_at: row.processed_at,
      processed_by: row.processed_by
    }));

    // Ищем заявку на $244
    const request244 = requests.find(r => r.amount === 244);
    
    if (request244) {
      console.log('📋 Заявка на $244 (как её увидит фронтенд):\n');
      console.log('ID:', request244.id);
      console.log('Пользователь:', request244.users.full_name);
      console.log('Сумма:', request244.amount);
      console.log('Способ:', request244.method);
      console.log('Статус:', request244.status);
      console.log('\n💳 Реквизиты:');
      console.log('card_number:', request244.card_number || 'NULL');
      console.log('card_holder_name:', request244.card_holder_name || 'NULL');
      console.log('phone_number:', request244.phone_number || 'NULL');
      console.log('account_holder_name:', request244.account_holder_name || 'NULL');
      console.log('wallet_address:', request244.wallet_address || 'NULL');
      console.log('crypto_network:', request244.crypto_network || 'NULL');

      console.log('\n🔍 Проверка условий отображения:');
      console.log('request.card_number:', !!request244.card_number, '→', request244.card_number ? 'ПОКАЖЕТ' : 'НЕ ПОКАЖЕТ');
      console.log('request.phone_number:', !!request244.phone_number, '→', request244.phone_number ? 'ПОКАЖЕТ' : 'НЕ ПОКАЖЕТ');
      console.log('request.wallet_address:', !!request244.wallet_address, '→', request244.wallet_address ? 'ПОКАЖЕТ' : 'НЕ ПОКАЖЕТ');

      if (request244.card_number) {
        console.log('\n✅ РЕКВИЗИТЫ КАРТЫ ДОЛЖНЫ ОТОБРАЖАТЬСЯ!');
        console.log('   Номер карты:', request244.card_number);
        console.log('   Владелец:', request244.card_holder_name);
      } else {
        console.log('\n❌ Реквизиты карты НЕ будут отображаться (card_number пустой)');
      }

      // Показываем JSON, который придет на фронтенд
      console.log('\n📤 JSON для фронтенда:');
      console.log(JSON.stringify({
        success: true,
        requests: [request244]
      }, null, 2));

    } else {
      console.log('❌ Заявка на $244 не найдена');
    }

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await client.end();
  }
}

testAPI();

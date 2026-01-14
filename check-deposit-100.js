const { Client } = require('pg');
const fs = require('fs');

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

async function checkDeposit() {
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

    // Ищем заявку на $100 СБП от KHOJAEV
    console.log('🔍 Поиск заявки на $100 СБП от KHOJAEV...\n');
    
    const result = await client.query(`
      SELECT 
        dr.*,
        u.full_name,
        u.email
      FROM deposit_requests dr
      LEFT JOIN users u ON dr.user_id = u.id
      WHERE dr.amount = 100
      AND u.full_name = 'KHOJAEV'
      ORDER BY dr.created_at DESC
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      console.log('❌ Заявка не найдена');
      return;
    }

    const req = result.rows[0];
    
    console.log('📋 Детали заявки:\n');
    console.log('ID:', req.id);
    console.log('Пользователь:', req.full_name);
    console.log('Email:', req.email);
    console.log('Сумма:', req.amount);
    console.log('Способ:', req.method);
    console.log('Статус:', req.status);
    console.log('Дата создания:', new Date(req.created_at).toLocaleString('ru-RU'));
    
    console.log('\n📝 payment_details:');
    if (req.payment_details) {
      console.log(JSON.stringify(req.payment_details, null, 2));
      
      console.log('\n🔍 Проверка полей в payment_details:');
      console.log('method:', req.payment_details.method || 'НЕТ');
      console.log('card_number:', req.payment_details.card_number || 'НЕТ');
      console.log('phone_number:', req.payment_details.phone_number || 'НЕТ');
      console.log('wallet_address:', req.payment_details.wallet_address || 'НЕТ');
      console.log('transaction_hash:', req.payment_details.transaction_hash || 'НЕТ');
    } else {
      console.log('NULL - реквизиты не сохранены!');
    }

    console.log('\n💡 Анализ:');
    if (!req.payment_details || 
        (!req.payment_details.card_number && 
         !req.payment_details.phone_number && 
         !req.payment_details.wallet_address)) {
      console.log('❌ Эта заявка НЕ содержит реквизитов');
      console.log('   Возможные причины:');
      console.log('   1. Заявка создана через старую версию API');
      console.log('   2. Пользователь не указал реквизиты при создании');
      console.log('   3. Ошибка при сохранении данных');
      console.log('\n✅ Решение: Создайте НОВУЮ заявку на пополнение');
      console.log('   Новые заявки будут сохранять реквизиты');
    } else {
      console.log('✅ Реквизиты есть в payment_details');
      console.log('   Проблема может быть в отображении на фронтенде');
    }

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await client.end();
  }
}

checkDeposit();

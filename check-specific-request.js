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

async function checkRequest() {
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

    // Ищем последнюю заявку пользователя KHOJAEV на $244
    console.log('🔍 Поиск заявки на $244 от пользователя KHOJAEV...\n');
    
    const result = await client.query(`
      SELECT 
        wr.*,
        u.full_name,
        u.email
      FROM withdrawal_requests wr
      LEFT JOIN users u ON wr.user_id = u.id
      WHERE wr.amount = 244
      AND u.full_name = 'KHOJAEV'
      ORDER BY wr.created_at DESC
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
    console.log('\n📝 Реквизиты:');
    console.log('wallet_address:', req.wallet_address || 'NULL');
    console.log('card_number:', req.card_number || 'NULL');
    console.log('card_holder_name:', req.card_holder_name || 'NULL');
    console.log('phone_number:', req.phone_number || 'NULL');
    console.log('account_holder_name:', req.account_holder_name || 'NULL');
    console.log('crypto_network:', req.crypto_network || 'NULL');

    console.log('\n💡 Анализ:');
    if (!req.card_number && !req.phone_number && !req.wallet_address) {
      console.log('❌ Эта заявка была создана ДО добавления полей для реквизитов');
      console.log('   Поэтому реквизиты не сохранились');
      console.log('\n✅ Решение: Создайте НОВУЮ заявку на вывод');
      console.log('   Новые заявки будут сохранять все реквизиты');
    } else {
      console.log('✅ Реквизиты есть в базе данных');
      console.log('   Проблема может быть в отображении на фронтенде');
    }

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await client.end();
  }
}

checkRequest();

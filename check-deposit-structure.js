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

async function checkDepositStructure() {
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

    // Проверяем структуру таблицы deposit_requests
    console.log('📋 Структура таблицы deposit_requests:\n');
    const structure = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'deposit_requests'
      ORDER BY ordinal_position
    `);
    
    console.table(structure.rows);

    // Проверяем последние заявки на пополнение
    console.log('\n📝 Последние 3 заявки на пополнение:\n');
    const requests = await client.query(`
      SELECT 
        dr.*,
        u.full_name,
        u.email
      FROM deposit_requests dr
      LEFT JOIN users u ON dr.user_id = u.id
      ORDER BY dr.created_at DESC
      LIMIT 3
    `);

    if (requests.rows.length === 0) {
      console.log('❌ Нет заявок на пополнение');
    } else {
      requests.rows.forEach((req, i) => {
        console.log(`\nЗаявка ${i + 1}:`);
        console.log('ID:', req.id);
        console.log('Пользователь:', req.full_name);
        console.log('Сумма:', req.amount);
        console.log('Способ:', req.method);
        console.log('Статус:', req.status);
        console.log('payment_details:', req.payment_details);
        console.log('Дата:', new Date(req.created_at).toLocaleString('ru-RU'));
      });
    }

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await client.end();
  }
}

checkDepositStructure();

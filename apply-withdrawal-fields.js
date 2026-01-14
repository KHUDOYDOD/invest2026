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

async function applyFields() {
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

    console.log('📝 Добавление полей для реквизитов...\n');

    // Читаем SQL скрипт
    const sql = fs.readFileSync('scripts/add-withdrawal-details-fields.sql', 'utf8');
    
    // Выполняем SQL
    await client.query(sql);
    
    console.log('✅ Поля успешно добавлены!\n');

    // Проверяем результат
    console.log('🔍 Проверка добавленных полей:');
    const columns = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'withdrawal_requests'
      AND column_name IN ('card_number', 'card_holder_name', 'phone_number', 'account_holder_name', 'crypto_network')
      ORDER BY column_name
    `);
    
    if (columns.rows.length === 5) {
      console.log('✅ Все 5 полей добавлены успешно:\n');
      columns.rows.forEach(col => {
        console.log(`   ✅ ${col.column_name} (${col.data_type})`);
      });
    } else {
      console.log(`⚠️  Добавлено только ${columns.rows.length} из 5 полей`);
    }

    console.log('\n✅ Готово! Теперь перезапустите сервер: npm run dev\n');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    console.error(error);
  } finally {
    await client.end();
  }
}

applyFields();

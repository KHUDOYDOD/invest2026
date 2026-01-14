const { Pool } = require('pg');
const fs = require('fs');

function getDatabaseUrl() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const match = envContent.match(/DATABASE_URL=(.+)/);
    return match ? match[1].trim() : null;
  } catch (error) {
    return null;
  }
}

async function setupTables() {
  const databaseUrl = getDatabaseUrl();
  const pool = new Pool({ connectionString: databaseUrl });

  try {
    console.log('🔧 Создание таблиц для заявок...\n');
    
    // Читаем SQL файл
    const sql = fs.readFileSync('create-requests-tables.sql', 'utf8');
    
    // Выполняем SQL
    await pool.query(sql);
    
    console.log('✅ Таблицы созданы успешно!\n');
    
    // Проверяем созданные таблицы
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('deposit_requests', 'withdrawal_requests')
      ORDER BY table_name;
    `);
    
    console.log('📋 Созданные таблицы:');
    console.log('─'.repeat(80));
    tables.rows.forEach(row => {
      console.log(`✅ ${row.table_name}`);
    });
    console.log('─'.repeat(80));
    console.log('');
    
    // Добавляем тестовые данные
    console.log('📝 Добавление тестовых данных...\n');
    
    // Получаем ID первого пользователя
    const userResult = await pool.query('SELECT id FROM users LIMIT 1');
    if (userResult.rows.length > 0) {
      const userId = userResult.rows[0].id;
      
      // Добавляем тестовую заявку на пополнение
      await pool.query(`
        INSERT INTO deposit_requests (user_id, amount, method, payment_details, status)
        VALUES ($1, 500, 'Bitcoin', '{"wallet": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"}', 'pending')
      `, [userId]);
      
      console.log('✅ Добавлена тестовая заявка на пополнение');
      
      // Добавляем тестовую заявку на вывод
      await pool.query(`
        INSERT INTO withdrawal_requests (user_id, amount, method, wallet_address, fee, final_amount, status)
        VALUES ($1, 200, 'Bitcoin', '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 5, 195, 'pending')
      `, [userId]);
      
      console.log('✅ Добавлена тестовая заявка на вывод');
    }
    
    console.log('');
    console.log('─'.repeat(80));
    console.log('🎉 Готово! Теперь можно открыть админ-панель:');
    console.log('   http://localhost:3000/admin/requests');
    console.log('─'.repeat(80));
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

setupTables();

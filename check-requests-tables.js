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

async function checkTables() {
  const databaseUrl = getDatabaseUrl();
  const pool = new Pool({ connectionString: databaseUrl });

  try {
    console.log('🔍 Проверка таблиц для заявок...\n');
    
    // Проверяем существование таблиц
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('deposit_requests', 'withdrawal_requests', 'transactions')
      ORDER BY table_name;
    `);
    
    console.log('📋 Найденные таблицы:');
    console.log('─'.repeat(80));
    tables.rows.forEach(row => {
      console.log(`✅ ${row.table_name}`);
    });
    console.log('─'.repeat(80));
    console.log('');
    
    // Проверяем транзакции
    if (tables.rows.some(r => r.table_name === 'transactions')) {
      const transactions = await pool.query(`
        SELECT 
          id, user_id, type, amount, status, created_at
        FROM transactions
        WHERE type IN ('deposit', 'withdrawal')
        ORDER BY created_at DESC
        LIMIT 10
      `);
      
      console.log('📊 Последние транзакции (депозиты и выводы):');
      console.log('─'.repeat(80));
      if (transactions.rows.length > 0) {
        transactions.rows.forEach(t => {
          console.log(`${t.type.toUpperCase()} | $${t.amount} | ${t.status} | ${new Date(t.created_at).toLocaleString()}`);
        });
      } else {
        console.log('Нет транзакций');
      }
      console.log('─'.repeat(80));
      console.log('');
    }
    
    // Проверяем deposit_requests
    if (tables.rows.some(r => r.table_name === 'deposit_requests')) {
      const deposits = await pool.query(`
        SELECT COUNT(*) as count, status
        FROM deposit_requests
        GROUP BY status
      `);
      
      console.log('💰 Заявки на пополнение:');
      console.log('─'.repeat(80));
      if (deposits.rows.length > 0) {
        deposits.rows.forEach(d => {
          console.log(`${d.status}: ${d.count}`);
        });
      } else {
        console.log('Нет заявок');
      }
      console.log('─'.repeat(80));
      console.log('');
    }
    
    // Проверяем withdrawal_requests
    if (tables.rows.some(r => r.table_name === 'withdrawal_requests')) {
      const withdrawals = await pool.query(`
        SELECT COUNT(*) as count, status
        FROM withdrawal_requests
        GROUP BY status
      `);
      
      console.log('💸 Заявки на вывод:');
      console.log('─'.repeat(80));
      if (withdrawals.rows.length > 0) {
        withdrawals.rows.forEach(w => {
          console.log(`${w.status}: ${w.count}`);
        });
      } else {
        console.log('Нет заявок');
      }
      console.log('─'.repeat(80));
      console.log('');
    }
    
    // Рекомендации
    console.log('💡 Рекомендации:');
    console.log('─'.repeat(80));
    if (!tables.rows.some(r => r.table_name === 'deposit_requests')) {
      console.log('⚠️  Таблица deposit_requests не найдена - нужно создать');
    }
    if (!tables.rows.some(r => r.table_name === 'withdrawal_requests')) {
      console.log('⚠️  Таблица withdrawal_requests не найдена - нужно создать');
    }
    if (tables.rows.length === 3) {
      console.log('✅ Все таблицы на месте!');
    }
    console.log('─'.repeat(80));
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

checkTables();

require('dotenv').config({ path: '.env.production' });
const { Pool } = require('pg');

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkLatestActivity() {
  try {
    console.log('🔍 Проверяем последнюю активность...\n');
    
    // Проверяем последние транзакции
    console.log('📊 Последние транзакции:');
    const transactionsResult = await pool.query(`
      SELECT 
        t.id,
        t.type,
        t.amount,
        t.status,
        t.created_at,
        u.full_name as user_name
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
      LIMIT 5
    `);

    transactionsResult.rows.forEach((tx, index) => {
      console.log(`${index + 1}. ${tx.user_name} - ${tx.type} $${tx.amount} (${tx.status})`);
      console.log(`   Время: ${new Date(tx.created_at).toLocaleString()}`);
      console.log('');
    });

    // Проверяем последние инвестиции
    console.log('💼 Последние инвестиции:');
    const investmentsResult = await pool.query(`
      SELECT 
        i.id,
        i.amount,
        i.status,
        i.created_at,
        u.full_name as user_name,
        p.name as plan_name
      FROM investments i
      LEFT JOIN users u ON i.user_id = u.id
      LEFT JOIN investment_plans p ON i.plan_id = p.id
      ORDER BY i.created_at DESC
      LIMIT 5
    `);

    if (investmentsResult.rows.length === 0) {
      console.log('   Нет инвестиций в таблице investments');
    } else {
      investmentsResult.rows.forEach((inv, index) => {
        console.log(`${index + 1}. ${inv.user_name} - инвестиция в "${inv.plan_name}" $${inv.amount} (${inv.status})`);
        console.log(`   Время: ${new Date(inv.created_at).toLocaleString()}`);
        console.log('');
      });
    }

    // Проверяем структуру таблиц
    console.log('🗂️ Структура таблицы transactions:');
    const transactionsStructure = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'transactions'
      ORDER BY ordinal_position
    `);
    
    transactionsStructure.rows.forEach(col => {
      console.log(`   ${col.column_name}: ${col.data_type}`);
    });

    console.log('\n🗂️ Структура таблицы investments:');
    const investmentsStructure = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'investments'
      ORDER BY ordinal_position
    `);
    
    if (investmentsStructure.rows.length === 0) {
      console.log('   Таблица investments не существует');
    } else {
      investmentsStructure.rows.forEach(col => {
        console.log(`   ${col.column_name}: ${col.data_type}`);
      });
    }

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

checkLatestActivity();
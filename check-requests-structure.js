const { Pool } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString: connectionString,
});

async function checkRequestsStructure() {
  try {
    console.log('🔍 Проверяем структуру таблиц заявок...');
    
    const client = await pool.connect();
    
    // Структура deposit_requests
    const depositStructure = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'deposit_requests' 
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 Структура deposit_requests:');
    depositStructure.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    // Структура withdrawal_requests
    const withdrawalStructure = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'withdrawal_requests' 
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 Структура withdrawal_requests:');
    withdrawalStructure.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    // Проверяем существующие заявки
    const existingDeposits = await client.query('SELECT COUNT(*) as count FROM deposit_requests');
    const existingWithdrawals = await client.query('SELECT COUNT(*) as count FROM withdrawal_requests');
    
    console.log(`\n💰 Существующие заявки на пополнение: ${existingDeposits.rows[0].count}`);
    console.log(`💸 Существующие заявки на вывод: ${existingWithdrawals.rows[0].count}`);
    
    // Показываем несколько существующих заявок
    if (existingDeposits.rows[0].count > 0) {
      const deposits = await client.query(`
        SELECT dr.*, u.full_name 
        FROM deposit_requests dr 
        LEFT JOIN users u ON dr.user_id = u.id 
        LIMIT 3
      `);
      console.log('\n💰 Примеры заявок на пополнение:');
      deposits.rows.forEach(req => {
        console.log(`  - ${req.full_name}: $${req.amount} (${req.status})`);
      });
    }
    
    if (existingWithdrawals.rows[0].count > 0) {
      const withdrawals = await client.query(`
        SELECT wr.*, u.full_name 
        FROM withdrawal_requests wr 
        LEFT JOIN users u ON wr.user_id = u.id 
        LIMIT 3
      `);
      console.log('\n💸 Примеры заявок на вывод:');
      withdrawals.rows.forEach(req => {
        console.log(`  - ${req.full_name}: $${req.amount} (${req.status})`);
      });
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

checkRequestsStructure();
require('dotenv').config({ path: '.env.production' });
const { Pool } = require('pg');

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testUserActivityAPI() {
  try {
    console.log('🔍 Тестируем API user-activity...\n');
    
    const result = await pool.query(`
      SELECT 
        t.id,
        t.user_id,
        t.type,
        CAST(t.amount AS DECIMAL(10,2)) as amount,
        t.status,
        t.created_at as time,
        u.full_name as user_name,
        CASE 
          WHEN t.type = 'investment' AND t.investment_id IS NOT NULL THEN 
            (SELECT p.name FROM investment_plans p 
             JOIN investments i ON i.plan_id = p.id 
             WHERE i.id = t.investment_id
             LIMIT 1)
          ELSE NULL
        END as plan_name
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.status IN ('completed', 'pending')
      ORDER BY t.created_at DESC
      LIMIT 20
    `);

    console.log(`📊 Найдено ${result.rows.length} транзакций:`);
    
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.user_name} - ${row.type} $${row.amount}`);
      if (row.plan_name) {
        console.log(`   План: ${row.plan_name}`);
      }
      console.log(`   Статус: ${row.status}`);
      console.log(`   Время: ${new Date(row.time).toLocaleString()}`);
      console.log('');
    });

    // Проверим связь investment_id
    console.log('🔗 Проверяем связь investment_id в транзакциях:');
    const investmentCheck = await pool.query(`
      SELECT 
        t.id,
        t.type,
        t.investment_id,
        t.amount,
        u.full_name
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.type = 'investment'
      ORDER BY t.created_at DESC
      LIMIT 5
    `);

    investmentCheck.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.full_name} - investment_id: ${row.investment_id || 'NULL'}`);
    });

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

testUserActivityAPI();
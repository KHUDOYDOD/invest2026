const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function checkDepositRequestsDetails() {
  try {
    console.log('🔍 Проверяем детали заявок на пополнение...');
    
    const result = await pool.query(`
      SELECT 
        dr.id,
        dr.user_id,
        dr.amount,
        dr.method,
        dr.payment_details,
        dr.status,
        dr.created_at,
        u.full_name as user_name,
        u.email as user_email
      FROM deposit_requests dr
      LEFT JOIN users u ON dr.user_id = u.id
      ORDER BY dr.created_at DESC
      LIMIT 5
    `);
    
    console.log(`📋 Найдено заявок на пополнение: ${result.rows.length}`);
    
    result.rows.forEach((request, index) => {
      console.log(`\n--- Заявка ${index + 1} ---`);
      console.log(`ID: ${request.id}`);
      console.log(`Пользователь: ${request.user_name} (${request.user_email})`);
      console.log(`Сумма: $${request.amount}`);
      console.log(`Способ: ${request.method}`);
      console.log(`Статус: ${request.status}`);
      console.log(`Дата: ${request.created_at}`);
      
      if (request.payment_details) {
        console.log(`Реквизиты:`, JSON.stringify(request.payment_details, null, 2));
      } else {
        console.log(`Реквизиты: Нет данных`);
      }
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

checkDepositRequestsDetails();
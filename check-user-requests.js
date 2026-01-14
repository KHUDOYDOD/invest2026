const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/investpro',
});

async function checkUserRequests() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Проверяем заявки пользователя...');
    
    const userId = 'b7d93f43-4b77-4369-95af-f0e74d34fc96'; // ID пользователя KHOJAEV
    
    // Проверяем заявки на пополнение
    console.log('\n💰 Заявки на пополнение:');
    const depositRequests = await client.query(`
      SELECT 
        id, 
        user_id, 
        amount, 
        method, 
        payment_details, 
        status, 
        created_at,
        admin_comment
      FROM deposit_requests 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `, [userId]);
    
    if (depositRequests.rows.length > 0) {
      depositRequests.rows.forEach((req, index) => {
        console.log(`${index + 1}. Сумма: ${req.amount}$ | Метод: ${req.method} | Статус: ${req.status}`);
        console.log(`   ID: ${req.id}`);
        console.log(`   Создана: ${req.created_at}`);
        if (req.admin_comment) console.log(`   Комментарий: ${req.admin_comment}`);
        console.log('');
      });
    } else {
      console.log('❌ Нет заявок на пополнение для этого пользователя');
    }
    
    // Проверяем заявки на вывод
    console.log('💸 Заявки на вывод:');
    const withdrawalRequests = await client.query(`
      SELECT 
        id, 
        user_id, 
        amount, 
        method, 
        payment_details, 
        status, 
        created_at,
        admin_comment
      FROM withdrawal_requests 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `, [userId]);
    
    if (withdrawalRequests.rows.length > 0) {
      withdrawalRequests.rows.forEach((req, index) => {
        console.log(`${index + 1}. Сумма: ${req.amount}$ | Метод: ${req.method} | Статус: ${req.status}`);
        console.log(`   ID: ${req.id}`);
        console.log(`   Создана: ${req.created_at}`);
        if (req.admin_comment) console.log(`   Комментарий: ${req.admin_comment}`);
        console.log('');
      });
    } else {
      console.log('❌ Нет заявок на вывод для этого пользователя');
    }
    
    // Проверяем все заявки на пополнение в системе
    console.log('📋 Все заявки на пополнение в системе:');
    const allDeposits = await client.query(`
      SELECT 
        dr.id, 
        dr.amount, 
        dr.method, 
        dr.status, 
        dr.created_at,
        u.full_name,
        u.email
      FROM deposit_requests dr
      LEFT JOIN users u ON dr.user_id = u.id
      ORDER BY dr.created_at DESC
      LIMIT 10
    `);
    
    if (allDeposits.rows.length > 0) {
      allDeposits.rows.forEach((req, index) => {
        console.log(`${index + 1}. ${req.full_name} (${req.email}) - ${req.amount}$ | ${req.status}`);
        console.log(`   Метод: ${req.method} | Создана: ${req.created_at}`);
        console.log('');
      });
    } else {
      console.log('❌ Нет заявок на пополнение в системе');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    console.error('Детали:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkUserRequests().catch(console.error);
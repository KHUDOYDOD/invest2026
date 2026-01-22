const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function testBankField() {
  try {
    console.log('🔄 Создаем тестовую заявку на вывод с банком...');
    
    // Получаем ID пользователя
    const userResult = await pool.query(`
      SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1
    `);
    
    if (userResult.rows.length === 0) {
      console.log('❌ Пользователь не найден');
      return;
    }
    
    const userId = userResult.rows[0].id;
    console.log('👤 Пользователь найден:', userId);
    
    // Создаем заявку на вывод с банком
    const withdrawalResult = await pool.query(`
      INSERT INTO withdrawal_requests (
        user_id, amount, method, card_number, card_holder_name, bank_name,
        fee, final_amount, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) 
      RETURNING id, created_at
    `, [
      userId,
      1000,
      'card',
      '1234567890123456',
      'Иван Иванов',
      'Сбербанк',
      20,
      980,
      'pending'
    ]);
    
    console.log('✅ Заявка на вывод создана:', withdrawalResult.rows[0]);
    
    // Проверяем созданную заявку
    const checkResult = await pool.query(`
      SELECT 
        wr.id,
        wr.amount,
        wr.method,
        wr.card_number,
        wr.card_holder_name,
        wr.bank_name,
        wr.status,
        u.full_name as user_name
      FROM withdrawal_requests wr
      LEFT JOIN users u ON wr.user_id = u.id
      WHERE wr.id = $1
    `, [withdrawalResult.rows[0].id]);
    
    console.log('📋 Данные заявки:');
    console.log('  ID:', checkResult.rows[0].id);
    console.log('  Пользователь:', checkResult.rows[0].user_name);
    console.log('  Сумма:', checkResult.rows[0].amount);
    console.log('  Метод:', checkResult.rows[0].method);
    console.log('  Номер карты:', checkResult.rows[0].card_number);
    console.log('  Владелец карты:', checkResult.rows[0].card_holder_name);
    console.log('  Банк:', checkResult.rows[0].bank_name);
    console.log('  Статус:', checkResult.rows[0].status);
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await pool.end();
  }
}

testBankField();
const { Pool } = require('pg');

// Подключение к базе данных
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function testSbpBankWithdrawal() {
  try {
    console.log('🧪 Тестирование заявки на вывод через СБП с банком...');

    // Находим тестового пользователя
    const userResult = await pool.query(
      'SELECT id, full_name, balance FROM users WHERE email = $1',
      ['zabon11@mail.ru']
    );

    if (userResult.rows.length === 0) {
      console.log('❌ Тестовый пользователь не найден');
      return;
    }

    const user = userResult.rows[0];
    console.log(`👤 Пользователь: ${user.full_name}, Баланс: $${user.balance}`);

    // Создаем тестовую заявку на вывод через СБП с банком
    const withdrawalResult = await pool.query(
      `INSERT INTO withdrawal_requests (
        user_id, amount, method, phone_number, account_holder_name, bank_name,
        fee, final_amount, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', NOW()) 
      RETURNING id, created_at`,
      [
        user.id,
        500, // сумма
        'sbp', // метод
        '79991234567', // номер телефона
        'Иванов Иван Иванович', // ФИО
        'Сбербанк', // банк для СБП
        7.5, // комиссия 1.5%
        492.5 // итоговая сумма
      ]
    );

    const withdrawal = withdrawalResult.rows[0];
    console.log(`✅ Создана заявка на вывод через СБП:`);
    console.log(`   ID: ${withdrawal.id}`);
    console.log(`   Сумма: $500`);
    console.log(`   Метод: СБП`);
    console.log(`   Телефон: +7 (999) 123-45-67`);
    console.log(`   ФИО: Иванов Иван Иванович`);
    console.log(`   Банк: Сбербанк`);
    console.log(`   Комиссия: $7.50`);
    console.log(`   К получению: $492.50`);

    // Проверяем, что заявка создалась с банком
    const checkResult = await pool.query(
      'SELECT * FROM withdrawal_requests WHERE id = $1',
      [withdrawal.id]
    );

    const request = checkResult.rows[0];
    console.log('\n📋 Проверка созданной заявки:');
    console.log(`   Метод: ${request.method}`);
    console.log(`   Телефон: ${request.phone_number}`);
    console.log(`   ФИО: ${request.account_holder_name}`);
    console.log(`   Банк: ${request.bank_name}`);
    console.log(`   Статус: ${request.status}`);

    // Создаем еще одну заявку с другим банком
    const withdrawal2Result = await pool.query(
      `INSERT INTO withdrawal_requests (
        user_id, amount, method, phone_number, account_holder_name, bank_name,
        fee, final_amount, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', NOW()) 
      RETURNING id`,
      [
        user.id,
        300,
        'sbp',
        '79997654321',
        'Петров Петр Петрович',
        'Тинькофф Банк',
        4.5,
        295.5
      ]
    );

    console.log(`✅ Создана вторая заявка на вывод через СБП с банком Тинькофф`);

    console.log('\n🎯 Тест завершен успешно!');

  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error);
  } finally {
    await pool.end();
  }
}

testSbpBankWithdrawal();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function debugAdminBankDisplay() {
  try {
    console.log('🔍 Отладка отображения банка в админ панели...');

    // Проверяем последние заявки СБП с банком
    const result = await pool.query(
      `SELECT 
        id, user_id, amount, method, phone_number, 
        account_holder_name, bank_name, status, created_at
      FROM withdrawal_requests 
      WHERE method = 'sbp' 
      ORDER BY created_at DESC 
      LIMIT 3`
    );

    if (result.rows.length === 0) {
      console.log('❌ Заявки СБП не найдены');
      return;
    }

    console.log('📋 Последние заявки СБП в базе данных:');
    result.rows.forEach((request, index) => {
      console.log(`\n${index + 1}. ID: ${request.id}`);
      console.log(`   Метод: ${request.method}`);
      console.log(`   Телефон: ${request.phone_number}`);
      console.log(`   ФИО: ${request.account_holder_name}`);
      console.log(`   Банк в БД: "${request.bank_name}" (тип: ${typeof request.bank_name})`);
      console.log(`   Банк пустой?: ${!request.bank_name ? 'ДА' : 'НЕТ'}`);
      console.log(`   Статус: ${request.status}`);
    });

    // Теперь проверим, что возвращает API админ панели
    console.log('\n🔍 Проверяем API админ панели...');
    
    // Имитируем запрос к API админ панели
    const adminApiQuery = `
      SELECT 
        wr.id,
        wr.user_id,
        wr.amount,
        wr.method,
        wr.wallet_address,
        wr.card_number,
        wr.card_holder_name,
        wr.bank_name,
        wr.phone_number,
        wr.account_holder_name,
        wr.crypto_network,
        wr.fee,
        wr.final_amount,
        wr.status,
        wr.admin_comment,
        wr.created_at,
        wr.processed_at,
        wr.processed_by,
        u.full_name as user_name,
        u.email as user_email
      FROM withdrawal_requests wr
      LEFT JOIN users u ON wr.user_id = u.id
      WHERE wr.method = 'sbp'
      ORDER BY wr.created_at DESC
      LIMIT 3
    `;

    const adminResult = await pool.query(adminApiQuery);
    
    console.log('\n📊 Данные из API админ панели:');
    adminResult.rows.forEach((request, index) => {
      console.log(`\n${index + 1}. ID: ${request.id}`);
      console.log(`   Метод: ${request.method}`);
      console.log(`   Телефон: ${request.phone_number}`);
      console.log(`   ФИО: ${request.account_holder_name}`);
      console.log(`   Банк из API: "${request.bank_name}" (тип: ${typeof request.bank_name})`);
      console.log(`   Банк null?: ${request.bank_name === null ? 'ДА' : 'НЕТ'}`);
      console.log(`   Банк undefined?: ${request.bank_name === undefined ? 'ДА' : 'НЕТ'}`);
      console.log(`   Банк пустая строка?: ${request.bank_name === '' ? 'ДА' : 'НЕТ'}`);
    });

    // Проверим конкретную заявку с банком
    const specificResult = await pool.query(
      `SELECT * FROM withdrawal_requests 
       WHERE method = 'sbp' AND bank_name IS NOT NULL AND bank_name != ''
       ORDER BY created_at DESC LIMIT 1`
    );

    if (specificResult.rows.length > 0) {
      const request = specificResult.rows[0];
      console.log('\n✅ Найдена заявка СБП с банком:');
      console.log(`   ID: ${request.id}`);
      console.log(`   Банк: "${request.bank_name}"`);
      console.log(`   Длина строки банка: ${request.bank_name?.length || 0}`);
      console.log(`   Банк в JSON: ${JSON.stringify(request.bank_name)}`);
    } else {
      console.log('\n❌ Не найдено заявок СБП с заполненным банком');
    }

  } catch (error) {
    console.error('❌ Ошибка отладки:', error);
  } finally {
    await pool.end();
  }
}

debugAdminBankDisplay();
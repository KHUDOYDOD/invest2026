const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function checkSbpBankInAdmin() {
  try {
    console.log('🔍 Проверяем заявки на вывод через СБП с банком...');

    // Получаем все заявки на вывод через СБП
    const result = await pool.query(
      `SELECT 
        id, user_id, amount, method, phone_number, 
        account_holder_name, bank_name, status, created_at
      FROM withdrawal_requests 
      WHERE method = 'sbp' 
      ORDER BY created_at DESC 
      LIMIT 10`
    );

    if (result.rows.length === 0) {
      console.log('❌ Заявки на вывод через СБП не найдены');
      return;
    }

    console.log(`✅ Найдено ${result.rows.length} заявок на вывод через СБП:`);
    console.log('');

    result.rows.forEach((request, index) => {
      console.log(`${index + 1}. Заявка ID: ${request.id}`);
      console.log(`   Пользователь: ${request.user_id}`);
      console.log(`   Сумма: $${request.amount}`);
      console.log(`   Метод: ${request.method}`);
      console.log(`   Телефон: ${request.phone_number}`);
      console.log(`   ФИО: ${request.account_holder_name}`);
      console.log(`   🏦 Банк: ${request.bank_name || 'НЕ УКАЗАН'}`);
      console.log(`   Статус: ${request.status}`);
      console.log(`   Создана: ${request.created_at}`);
      console.log('   ---');
    });

    // Проверяем, есть ли заявки с банком
    const withBank = result.rows.filter(r => r.bank_name);
    const withoutBank = result.rows.filter(r => !r.bank_name);

    console.log(`\n📊 Статистика:`);
    console.log(`   С банком: ${withBank.length}`);
    console.log(`   Без банка: ${withoutBank.length}`);

    if (withBank.length > 0) {
      console.log('\n✅ ТЕСТ ПРОЙДЕН: Заявки СБП с банком найдены!');
      console.log('🎯 Проверьте админ панель: http://213.171.31.215/admin/requests');
    } else {
      console.log('\n⚠️  Заявки СБП без банка. Нужно создать новую заявку с банком.');
    }

  } catch (error) {
    console.error('❌ Ошибка при проверке:', error);
  } finally {
    await pool.end();
  }
}

checkSbpBankInAdmin();
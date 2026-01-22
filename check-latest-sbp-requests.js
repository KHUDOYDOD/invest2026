const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function checkLatestSbpRequests() {
  try {
    console.log('🔍 Проверяем последние заявки на вывод через СБП...');

    // Получаем последние заявки на вывод через СБП
    const result = await pool.query(
      `SELECT 
        wr.id, wr.user_id, wr.amount, wr.method, 
        wr.phone_number, wr.account_holder_name, wr.bank_name, 
        wr.status, wr.created_at,
        u.full_name as user_name, u.email as user_email
      FROM withdrawal_requests wr
      LEFT JOIN users u ON wr.user_id = u.id
      WHERE wr.method = 'sbp' 
      ORDER BY wr.created_at DESC 
      LIMIT 5`
    );

    if (result.rows.length === 0) {
      console.log('❌ Заявки на вывод через СБП не найдены');
      return;
    }

    console.log(`✅ Найдено ${result.rows.length} последних заявок СБП:`);
    console.log('');

    result.rows.forEach((request, index) => {
      const createdAt = new Date(request.created_at);
      const timeAgo = Math.round((Date.now() - createdAt.getTime()) / (1000 * 60)); // минуты назад
      
      console.log(`${index + 1}. 📋 Заявка ID: ${request.id.substring(0, 8)}...`);
      console.log(`   👤 Пользователь: ${request.user_name} (${request.user_email})`);
      console.log(`   💰 Сумма: $${request.amount}`);
      console.log(`   📱 Телефон: ${request.phone_number}`);
      console.log(`   👨‍💼 ФИО: ${request.account_holder_name}`);
      console.log(`   🏦 Банк: ${request.bank_name || '❌ НЕ УКАЗАН'}`);
      console.log(`   📊 Статус: ${request.status}`);
      console.log(`   ⏰ Создана: ${timeAgo} мин. назад (${createdAt.toLocaleString('ru-RU')})`);
      console.log('   ---');
    });

    // Статистика по банкам
    const withBank = result.rows.filter(r => r.bank_name);
    const withoutBank = result.rows.filter(r => !r.bank_name);

    console.log(`\n📊 Статистика последних заявок СБП:`);
    console.log(`   ✅ С банком: ${withBank.length}`);
    console.log(`   ❌ Без банка: ${withoutBank.length}`);

    if (withBank.length > 0) {
      console.log('\n🏦 Банки в заявках:');
      const banks = [...new Set(withBank.map(r => r.bank_name))];
      banks.forEach(bank => {
        const count = withBank.filter(r => r.bank_name === bank).length;
        console.log(`   • ${bank}: ${count} заявок`);
      });
    }

    if (withBank.length > 0) {
      console.log('\n✅ ТЕСТ ПРОЙДЕН: Заявки СБП с банком найдены!');
      console.log('🎯 Проверьте админ панель: http://213.171.31.215/admin/requests');
    } else {
      console.log('\n⚠️  Все заявки СБП без банка. Нужно создать новую заявку с банком.');
    }

  } catch (error) {
    console.error('❌ Ошибка при проверке:', error);
  } finally {
    await pool.end();
  }
}

checkLatestSbpRequests();
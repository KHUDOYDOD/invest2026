const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function cleanDemoData() {
  try {
    console.log('🔌 Подключение к базе данных...');
    await client.connect();
    console.log('✅ Подключено к базе данных');

    console.log('\n🗑️  Начинаем очистку демо-данных...\n');

    // Удаляем транзакции
    console.log('📊 Очистка транзакций...');
    const transactionsResult = await client.query('DELETE FROM transactions RETURNING id');
    console.log(`   ✅ Удалено транзакций: ${transactionsResult.rowCount}`);

    // Удаляем инвестиции
    console.log('💰 Очистка инвестиций...');
    const investmentsResult = await client.query('DELETE FROM investments RETURNING id');
    console.log(`   ✅ Удалено инвестиций: ${investmentsResult.rowCount}`);

    // Удаляем запросы на депозит
    console.log('💳 Очистка запросов на депозит...');
    const depositsResult = await client.query('DELETE FROM deposit_requests RETURNING id');
    console.log(`   ✅ Удалено запросов на депозит: ${depositsResult.rowCount}`);

    // Удаляем запросы на вывод
    console.log('💸 Очистка запросов на вывод...');
    const withdrawalsResult = await client.query('DELETE FROM withdrawal_requests RETURNING id');
    console.log(`   ✅ Удалено запросов на вывод: ${withdrawalsResult.rowCount}`);

    // Удаляем рефералов
    console.log('👥 Очистка рефералов...');
    const referralsResult = await client.query('DELETE FROM referrals RETURNING id');
    console.log(`   ✅ Удалено рефералов: ${referralsResult.rowCount}`);

    // Удаляем уведомления
    console.log('🔔 Очистка уведомлений...');
    const notificationsResult = await client.query('DELETE FROM notifications RETURNING id');
    console.log(`   ✅ Удалено уведомлений: ${notificationsResult.rowCount}`);

    // Удаляем сообщения поддержки
    console.log('💬 Очистка сообщений поддержки...');
    const messagesResult = await client.query('DELETE FROM support_messages RETURNING id');
    console.log(`   ✅ Удалено сообщений: ${messagesResult.rowCount}`);

    // Удаляем активность пользователей
    console.log('📈 Очистка активности пользователей...');
    const activityResult = await client.query('DELETE FROM user_activity RETURNING id');
    console.log(`   ✅ Удалено записей активности: ${activityResult.rowCount}`);

    // Удаляем отзывы
    console.log('⭐ Очистка отзывов...');
    const testimonialsResult = await client.query('DELETE FROM testimonials RETURNING id');
    console.log(`   ✅ Удалено отзывов: ${testimonialsResult.rowCount}`);

    // Удаляем новости
    console.log('📰 Очистка новостей...');
    const newsResult = await client.query('DELETE FROM news RETURNING id');
    console.log(`   ✅ Удалено новостей: ${newsResult.rowCount}`);

    // Удаляем демо-пользователей (оставляем супер-админа и админов)
    console.log('👤 Очистка демо-пользователей...');
    const usersResult = await client.query(
      "DELETE FROM users WHERE id != 1 AND (role NOT IN ('admin', 'super_admin') OR email LIKE '%demo%' OR email LIKE '%test%') RETURNING id"
    );
    console.log(`   ✅ Удалено демо-пользователей: ${usersResult.rowCount}`);

    // Сбрасываем счетчики
    console.log('\n🔄 Сброс счетчиков автоинкремента...');
    await client.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE transactions_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE investments_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE deposit_requests_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE withdrawal_requests_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE referrals_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE notifications_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE support_messages_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE testimonials_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE news_id_seq RESTART WITH 1');
    console.log('   ✅ Счетчики сброшены');

    // Обновляем статистику
    console.log('\n📊 Обновление статистики базы данных...');
    await client.query('VACUUM ANALYZE');
    console.log('   ✅ Статистика обновлена');

    // Показываем финальную статистику
    console.log('\n📈 Финальная статистика:');
    const usersCount = await client.query('SELECT COUNT(*) FROM users');
    const transactionsCount = await client.query('SELECT COUNT(*) FROM transactions');
    const investmentsCount = await client.query('SELECT COUNT(*) FROM investments');
    
    console.log(`   👥 Пользователей: ${usersCount.rows[0].count}`);
    console.log(`   💰 Транзакций: ${transactionsCount.rows[0].count}`);
    console.log(`   📊 Инвестиций: ${investmentsCount.rows[0].count}`);

    console.log('\n✅ База данных успешно очищена от демо-данных!');
    console.log('🚀 Система готова к продакшену!\n');

  } catch (error) {
    console.error('❌ Ошибка при очистке базы данных:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Запускаем очистку
cleanDemoData();

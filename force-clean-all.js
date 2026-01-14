const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function forceCleanAll() {
  try {
    console.log('=== ПРИНУДИТЕЛЬНАЯ ОЧИСТКА ВСЕХ ДАННЫХ ===');
    console.log('⚠️  Это удалит АБСОЛЮТНО ВСЕ финансовые данные принудительно!');
    
    // Отключаем проверки внешних ключей временно
    await pool.query('SET session_replication_role = replica');
    
    // 1. Принудительно удаляем ВСЕ данные
    console.log('🗑️ Принудительное удаление всех данных...');
    
    await pool.query('DELETE FROM investments');
    console.log('   ✅ Все инвестиции удалены');
    
    await pool.query('DELETE FROM transactions');
    console.log('   ✅ Все транзакции удалены');
    
    await pool.query('DELETE FROM deposit_requests');
    console.log('   ✅ Все заявки на пополнение удалены');
    
    await pool.query('DELETE FROM withdrawal_requests');
    console.log('   ✅ Все заявки на вывод удалены');
    
    // 2. Принудительно обнуляем ВСЕ балансы
    await pool.query(`
      UPDATE users 
      SET 
        balance = 0,
        total_invested = 0,
        total_earned = 0
    `);
    console.log('   ✅ ВСЕ балансы принудительно обнулены');
    
    // 3. Сбрасываем счетчики автоинкремента
    await pool.query('ALTER SEQUENCE IF EXISTS investments_id_seq RESTART WITH 1');
    await pool.query('ALTER SEQUENCE IF EXISTS transactions_id_seq RESTART WITH 1');
    await pool.query('ALTER SEQUENCE IF EXISTS deposit_requests_id_seq RESTART WITH 1');
    await pool.query('ALTER SEQUENCE IF EXISTS withdrawal_requests_id_seq RESTART WITH 1');
    
    // Включаем обратно проверки внешних ключей
    await pool.query('SET session_replication_role = DEFAULT');
    
    console.log('\n🎉 ПРИНУДИТЕЛЬНАЯ ОЧИСТКА ЗАВЕРШЕНА!');
    
    // Финальная проверка
    console.log('\n=== ФИНАЛЬНАЯ ПРОВЕРКА ===');
    
    const usersCheck = await pool.query('SELECT email, balance, total_invested, total_earned, role_id FROM users ORDER BY role_id');
    console.log('👥 Все пользователи после принудительной очистки:');
    usersCheck.rows.forEach(user => {
      const roleText = user.role_id === 1 ? 'super_admin' : user.role_id === 2 ? 'admin' : 'user';
      console.log(`   📧 ${user.email} (${roleText}): баланс=$${user.balance}, инвестировано=$${user.total_invested}, заработано=$${user.total_earned}`);
    });
    
    // Проверяем все таблицы
    const tables = ['investments', 'transactions', 'deposit_requests', 'withdrawal_requests'];
    for (const table of tables) {
      const count = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`📊 ${table}: ${count.rows[0].count} записей`);
    }
    
    console.log('\n✨ ГОТОВО! Система полностью очищена от всех финансовых данных.');
    console.log('🔄 Все пользователи теперь имеют нулевые балансы.');
    console.log('📋 Планы инвестирования сохранены и готовы к использованию.');
    
  } catch (error) {
    console.error('❌ Ошибка при принудительной очистке:', error.message);
  } finally {
    await pool.end();
  }
}

forceCleanAll();
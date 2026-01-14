const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function completeFinancialReset() {
  try {
    console.log('=== ПОЛНАЯ ОЧИСТКА ВСЕХ ФИНАНСОВЫХ ДАННЫХ ===');
    console.log('⚠️  ВНИМАНИЕ: Это удалит АБСОЛЮТНО ВСЕ финансовые данные!');
    
    // Начинаем транзакцию
    await pool.query('BEGIN');
    
    // 1. Полностью очищаем все финансовые таблицы
    console.log('🗑️ Удаляем все данные...');
    
    await pool.query('TRUNCATE TABLE investments RESTART IDENTITY CASCADE');
    console.log('   ✅ Таблица investments очищена');
    
    await pool.query('TRUNCATE TABLE transactions RESTART IDENTITY CASCADE');
    console.log('   ✅ Таблица transactions очищена');
    
    await pool.query('TRUNCATE TABLE deposit_requests RESTART IDENTITY CASCADE');
    console.log('   ✅ Таблица deposit_requests очищена');
    
    await pool.query('TRUNCATE TABLE withdrawal_requests RESTART IDENTITY CASCADE');
    console.log('   ✅ Таблица withdrawal_requests очищена');
    
    // 2. Обнуляем ВСЕ балансы (включая админа)
    await pool.query(`
      UPDATE users 
      SET 
        balance = 0,
        total_invested = 0,
        total_earned = 0
    `);
    console.log('   ✅ Все балансы обнулены');
    
    // 3. Очищаем дополнительные таблицы если они есть
    const tablesToClear = ['profits', 'referrals', 'bonuses', 'commissions'];
    
    for (const table of tablesToClear) {
      try {
        await pool.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
        console.log(`   ✅ Таблица ${table} очищена`);
      } catch (error) {
        console.log(`   📝 Таблица ${table} не найдена (это нормально)`);
      }
    }
    
    // Подтверждаем транзакцию
    await pool.query('COMMIT');
    
    console.log('\n🎉 ПОЛНАЯ ОЧИСТКА ЗАВЕРШЕНА!');
    console.log('🔄 Система полностью сброшена к начальному состоянию');
    
    // Финальная проверка
    console.log('\n=== ФИНАЛЬНАЯ ПРОВЕРКА ===');
    
    const usersCheck = await pool.query('SELECT email, balance, total_invested, total_earned, role_id FROM users ORDER BY role_id');
    console.log('👥 Все пользователи после полной очистки:');
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
    
    console.log('\n✨ ВСЕ ГОТОВО! Теперь все пользователи имеют нулевые балансы и никаких финансовых операций в истории.');
    
  } catch (error) {
    // Откатываем транзакцию в случае ошибки
    await pool.query('ROLLBACK');
    console.error('❌ Ошибка при полной очистке:', error.message);
  } finally {
    await pool.end();
  }
}

completeFinancialReset();
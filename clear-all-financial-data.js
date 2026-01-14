const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function clearAllFinancialData() {
  try {
    console.log('=== ОЧИСТКА ВСЕХ ФИНАНСОВЫХ ДАННЫХ ===');
    console.log('⚠️  ВНИМАНИЕ: Это удалит ВСЕ финансовые данные!');
    
    // Начинаем транзакцию
    await pool.query('BEGIN');
    
    // 1. Удаляем все инвестиции
    const investmentsResult = await pool.query('DELETE FROM investments');
    console.log(`🗑️ Удалено инвестиций: ${investmentsResult.rowCount}`);
    
    // 2. Удаляем все транзакции
    const transactionsResult = await pool.query('DELETE FROM transactions');
    console.log(`🗑️ Удалено транзакций: ${transactionsResult.rowCount}`);
    
    // 3. Удаляем все заявки на пополнение
    const depositRequestsResult = await pool.query('DELETE FROM deposit_requests');
    console.log(`🗑️ Удалено заявок на пополнение: ${depositRequestsResult.rowCount}`);
    
    // 4. Удаляем все заявки на вывод
    const withdrawalRequestsResult = await pool.query('DELETE FROM withdrawal_requests');
    console.log(`🗑️ Удалено заявок на вывод: ${withdrawalRequestsResult.rowCount}`);
    
    // 5. Обнуляем балансы всех пользователей (кроме админа)
    const balanceResetResult = await pool.query(`
      UPDATE users 
      SET 
        balance = 0,
        total_invested = 0,
        total_earned = 0
      WHERE role_id != 1
    `);
    console.log(`💰 Обнулены балансы пользователей: ${balanceResetResult.rowCount}`);
    
    // 6. Устанавливаем админу баланс 0 (если хотите)
    await pool.query(`
      UPDATE users 
      SET 
        balance = 0,
        total_invested = 0,
        total_earned = 0
      WHERE role_id = 1
    `);
    console.log(`👑 Обнулен баланс администратора`);
    
    // 7. Удаляем все прибыли (если есть таблица profits)
    try {
      const profitsResult = await pool.query('DELETE FROM profits');
      console.log(`💎 Удалено записей прибыли: ${profitsResult.rowCount}`);
    } catch (error) {
      console.log('📝 Таблица profits не найдена (это нормально)');
    }
    
    // 8. Удаляем все рефералы (если есть таблица referrals)
    try {
      const referralsResult = await pool.query('DELETE FROM referrals');
      console.log(`🤝 Удалено рефералов: ${referralsResult.rowCount}`);
    } catch (error) {
      console.log('📝 Таблица referrals не найдена (это нормально)');
    }
    
    // Подтверждаем транзакцию
    await pool.query('COMMIT');
    
    console.log('\n✅ ВСЕ ФИНАНСОВЫЕ ДАННЫЕ УСПЕШНО УДАЛЕНЫ!');
    console.log('🔄 Система готова к работе с чистыми данными');
    
    // Проверяем результат
    console.log('\n=== ПРОВЕРКА РЕЗУЛЬТАТА ===');
    
    const usersCheck = await pool.query('SELECT email, balance, total_invested, total_earned FROM users ORDER BY role_id');
    console.log('👥 Балансы пользователей после очистки:');
    usersCheck.rows.forEach(user => {
      console.log(`   📧 ${user.email}: баланс=$${user.balance}, инвестировано=$${user.total_invested}, заработано=$${user.total_earned}`);
    });
    
    const investmentsCheck = await pool.query('SELECT COUNT(*) as count FROM investments');
    console.log(`📊 Инвестиций в системе: ${investmentsCheck.rows[0].count}`);
    
    const transactionsCheck = await pool.query('SELECT COUNT(*) as count FROM transactions');
    console.log(`💳 Транзакций в системе: ${transactionsCheck.rows[0].count}`);
    
    const depositRequestsCheck = await pool.query('SELECT COUNT(*) as count FROM deposit_requests');
    console.log(`💰 Заявок на пополнение: ${depositRequestsCheck.rows[0].count}`);
    
    const withdrawalRequestsCheck = await pool.query('SELECT COUNT(*) as count FROM withdrawal_requests');
    console.log(`💸 Заявок на вывод: ${withdrawalRequestsCheck.rows[0].count}`);
    
    console.log('\n🎉 ОЧИСТКА ЗАВЕРШЕНА! Все пользователи начинают с нулевого баланса.');
    
  } catch (error) {
    // Откатываем транзакцию в случае ошибки
    await pool.query('ROLLBACK');
    console.error('❌ Ошибка при очистке данных:', error.message);
  } finally {
    await pool.end();
  }
}

clearAllFinancialData();
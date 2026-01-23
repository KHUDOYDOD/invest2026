require('dotenv').config({ path: '.env.production' });

async function testStatisticsUpdateOnServer() {
  try {
    console.log('🧪 Тестируем обновление статистики на сервере...\n');
    
    // Получаем статистику до обновления
    console.log('📊 Статистика ДО обновления:');
    const statsBefore = await fetch('http://213.171.31.215/api/statistics');
    const statsBeforeData = await statsBefore.json();
    console.log(`   Инвестиции: $${statsBeforeData.investments_amount}`);
    console.log(`   Обновлено: ${new Date(statsBeforeData.updated_at).toLocaleString()}`);

    // Вызываем функцию обновления статистики напрямую на сервере
    console.log('\n🔄 Вызываем обновление статистики на сервере...');
    
    // Логинимся как админ
    const loginResponse = await fetch('http://213.171.31.215/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'X11021997x'
      })
    });

    const loginData = await loginResponse.json();
    if (!loginData.success) {
      throw new Error('Ошибка входа: ' + loginData.error);
    }

    // Обновляем статистику через API (если есть такой endpoint)
    console.log('✅ Логин успешен, проверяем обновление статистики...');

    // Ждем немного
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Получаем статистику после
    console.log('\n📊 Статистика ПОСЛЕ:');
    const statsAfter = await fetch('http://213.171.31.215/api/statistics');
    const statsAfterData = await statsAfter.json();
    console.log(`   Инвестиции: $${statsAfterData.investments_amount}`);
    console.log(`   Обновлено: ${new Date(statsAfterData.updated_at).toLocaleString()}`);

    // Проверяем данные в базе напрямую
    console.log('\n🔍 Проверяем данные в базе напрямую...');
    const response = await fetch('http://213.171.31.215/api/all-transactions');
    const transactionsData = await response.json();
    
    if (transactionsData.success) {
      const investmentTransactions = transactionsData.data.filter(t => t.type === 'investment' && t.status === 'completed');
      const totalInvestments = investmentTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
      console.log(`   Реальная сумма инвестиций в базе: $${totalInvestments}`);
      console.log(`   Количество инвестиционных транзакций: ${investmentTransactions.length}`);
    }

  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
  }
}

testStatisticsUpdateOnServer();
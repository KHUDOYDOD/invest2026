require('dotenv').config({ path: '.env.production' });

async function testInvestmentWithStatistics() {
  try {
    console.log('🧪 Тестируем создание инвестиции с автоматическим обновлением статистики...\n');
    
    // Получаем статистику до создания инвестиции
    console.log('📊 Статистика ДО создания инвестиции:');
    const statsBefore = await fetch('http://213.171.31.215/api/statistics');
    const statsBeforeData = await statsBefore.json();
    console.log(`   Пользователи: ${statsBeforeData.users_count}`);
    console.log(`   Инвестиции: $${statsBeforeData.investments_amount}`);
    console.log(`   Выплаты: $${statsBeforeData.payouts_amount}`);
    console.log(`   Доходность: ${statsBeforeData.profitability_rate}%`);
    console.log(`   Обновлено: ${new Date(statsBeforeData.updated_at).toLocaleString()}`);

    // Логинимся как админ
    console.log('\n🔐 Логинимся как админ...');
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

    const token = loginData.token;
    console.log('✅ Успешный вход');

    // Создаем инвестицию
    console.log('\n💰 Создаем инвестицию $150...');
    const investmentResponse = await fetch('http://213.171.31.215/api/investments/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        planId: '7f131fd6-0517-4cfe-9b38-81f354bb0308', // Стартер план
        amount: 150
      })
    });

    const investmentData = await investmentResponse.json();
    if (!investmentData.success) {
      throw new Error('Ошибка создания инвестиции: ' + investmentData.error);
    }

    console.log('✅ Инвестиция создана:', investmentData.investment);

    // Ждем немного для обновления статистики
    console.log('\n⏳ Ждем обновления статистики...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Получаем статистику после создания инвестиции
    console.log('\n📊 Статистика ПОСЛЕ создания инвестиции:');
    const statsAfter = await fetch('http://213.171.31.215/api/statistics');
    const statsAfterData = await statsAfter.json();
    console.log(`   Пользователи: ${statsAfterData.users_count}`);
    console.log(`   Инвестиции: $${statsAfterData.investments_amount}`);
    console.log(`   Выплаты: $${statsAfterData.payouts_amount}`);
    console.log(`   Доходность: ${statsAfterData.profitability_rate}%`);
    console.log(`   Обновлено: ${new Date(statsAfterData.updated_at).toLocaleString()}`);

    // Сравниваем изменения
    console.log('\n📈 Изменения:');
    const investmentsDiff = statsAfterData.investments_amount - statsBeforeData.investments_amount;
    console.log(`   Инвестиции: +$${investmentsDiff}`);
    
    if (investmentsDiff === 150) {
      console.log('✅ Статистика обновилась корректно!');
    } else {
      console.log('❌ Статистика не обновилась или обновилась неправильно');
    }

    // Проверяем время обновления
    const timeBefore = new Date(statsBeforeData.updated_at);
    const timeAfter = new Date(statsAfterData.updated_at);
    
    if (timeAfter > timeBefore) {
      console.log('✅ Время обновления статистики изменилось');
    } else {
      console.log('❌ Время обновления статистики не изменилось');
    }

  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
  }
}

testInvestmentWithStatistics();
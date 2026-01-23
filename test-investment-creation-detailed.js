require('dotenv').config({ path: '.env.production' });

async function testInvestmentCreationDetailed() {
  try {
    console.log('🧪 Детальный тест создания инвестиции...\n');
    
    // Логинимся как админ
    console.log('🔐 Логинимся как админ...');
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

    // Получаем статистику до создания инвестиции
    console.log('\n📊 Статистика ДО создания инвестиции:');
    const statsBefore = await fetch('http://213.171.31.215/api/statistics');
    const statsBeforeData = await statsBefore.json();
    console.log(`   Инвестиции: $${statsBeforeData.investments_amount}`);
    console.log(`   Обновлено: ${new Date(statsBeforeData.updated_at).toLocaleString()}`);

    // Создаем инвестицию с детальным логированием
    console.log('\n💰 Создаем инвестицию $200...');
    const investmentResponse = await fetch('http://213.171.31.215/api/investments/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        planId: '7f131fd6-0517-4cfe-9b38-81f354bb0308', // Стартер план
        amount: 200
      })
    });

    console.log('📡 Статус ответа:', investmentResponse.status);
    
    const investmentData = await investmentResponse.json();
    console.log('📦 Ответ сервера:', JSON.stringify(investmentData, null, 2));

    if (!investmentData.success) {
      throw new Error('Ошибка создания инвестиции: ' + investmentData.error);
    }

    console.log('✅ Инвестиция создана успешно');

    // Ждем немного для обновления статистики
    console.log('\n⏳ Ждем 3 секунды для обновления статистики...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Получаем статистику после создания инвестиции
    console.log('\n📊 Статистика ПОСЛЕ создания инвестиции:');
    const statsAfter = await fetch('http://213.171.31.215/api/statistics');
    const statsAfterData = await statsAfter.json();
    console.log(`   Инвестиции: $${statsAfterData.investments_amount}`);
    console.log(`   Обновлено: ${new Date(statsAfterData.updated_at).toLocaleString()}`);

    // Сравниваем изменения
    console.log('\n📈 Анализ изменений:');
    const investmentsDiff = statsAfterData.investments_amount - statsBeforeData.investments_amount;
    console.log(`   Разница в инвестициях: $${investmentsDiff}`);
    console.log(`   Ожидаемая разница: $200`);
    
    const timeBefore = new Date(statsBeforeData.updated_at);
    const timeAfter = new Date(statsAfterData.updated_at);
    console.log(`   Время до: ${timeBefore.toISOString()}`);
    console.log(`   Время после: ${timeAfter.toISOString()}`);
    console.log(`   Время изменилось: ${timeAfter > timeBefore ? 'ДА' : 'НЕТ'}`);

    if (investmentsDiff === 200 && timeAfter > timeBefore) {
      console.log('\n✅ УСПЕХ: Статистика обновилась автоматически!');
    } else if (investmentsDiff === 200) {
      console.log('\n⚠️ Сумма правильная, но время не изменилось');
    } else if (timeAfter > timeBefore) {
      console.log('\n⚠️ Время изменилось, но сумма неправильная');
    } else {
      console.log('\n❌ ОШИБКА: Статистика не обновилась автоматически');
    }

  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }
}

testInvestmentCreationDetailed();
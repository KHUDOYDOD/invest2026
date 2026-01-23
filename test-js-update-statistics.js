require('dotenv').config({ path: '.env.production' });

// Импортируем JavaScript версию функции
const { updateStatistics } = require('./lib/update-statistics.js');

async function testJSUpdateStatistics() {
  try {
    console.log('🧪 Тестируем JavaScript версию updateStatistics()...\n');
    
    // Получаем статистику до обновления
    console.log('📊 Статистика ДО обновления:');
    const statsBefore = await fetch('http://213.171.31.215/api/statistics');
    const statsBeforeData = await statsBefore.json();
    console.log(`   Пользователи: ${statsBeforeData.users_count}`);
    console.log(`   Инвестиции: ${statsBeforeData.investments_amount}`);
    console.log(`   Выплаты: ${statsBeforeData.payouts_amount}`);
    console.log(`   Доходность: ${statsBeforeData.profitability_rate}%`);
    console.log(`   Обновлено: ${new Date(statsBeforeData.updated_at).toLocaleString()}`);

    // Вызываем функцию обновления статистики
    console.log('\n🔄 Вызываем updateStatistics()...');
    const result = await updateStatistics();
    console.log('Результат updateStatistics():', result);

    // Ждем немного
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Получаем статистику после обновления
    console.log('\n📊 Статистика ПОСЛЕ обновления:');
    const statsAfter = await fetch('http://213.171.31.215/api/statistics');
    const statsAfterData = await statsAfter.json();
    console.log(`   Пользователи: ${statsAfterData.users_count}`);
    console.log(`   Инвестиции: ${statsAfterData.investments_amount}`);
    console.log(`   Выплаты: ${statsAfterData.payouts_amount}`);
    console.log(`   Доходность: ${statsAfterData.profitability_rate}%`);
    console.log(`   Обновлено: ${new Date(statsAfterData.updated_at).toLocaleString()}`);

    // Проверяем изменения
    const timeBefore = new Date(statsBeforeData.updated_at);
    const timeAfter = new Date(statsAfterData.updated_at);
    
    if (timeAfter > timeBefore) {
      console.log('\n✅ Статистика обновилась успешно!');
    } else {
      console.log('\n❌ Статистика не обновилась');
    }

  } catch (error) {
    console.error('❌ Ошибка тестирования:', error);
  }
}

testJSUpdateStatistics();
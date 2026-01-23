require('dotenv').config({ path: '.env.production' });

async function testManualStatisticsUpdate() {
  try {
    console.log('🧪 Тестируем ручное обновление статистики через API...\n');
    
    // Получаем статистику до обновления
    console.log('📊 Статистика ДО обновления:');
    const statsBefore = await fetch('http://213.171.31.215/api/statistics');
    const statsBeforeData = await statsBefore.json();
    console.log(`   Пользователи: ${statsBeforeData.users_count}`);
    console.log(`   Инвестиции: ${statsBeforeData.investments_amount}`);
    console.log(`   Выплаты: ${statsBeforeData.payouts_amount}`);
    console.log(`   Доходность: ${statsBeforeData.profitability_rate}%`);
    console.log(`   Обновлено: ${new Date(statsBeforeData.updated_at).toLocaleString()}`);

    // Вызываем API для обновления статистики
    console.log('\n🔄 Вызываем API /api/update-statistics...');
    const updateResponse = await fetch('http://213.171.31.215/api/update-statistics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const updateData = await updateResponse.json();
    console.log('Результат API обновления:', updateData);

    // Ждем немного
    await new Promise(resolve => setTimeout(resolve, 2000));

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
      console.log('\n✅ Статистика обновилась через API!');
      
      // Проверяем правильность данных
      if (statsAfterData.investments_amount === 1212) {
        console.log('✅ Данные корректны (инвестиции = 1212)');
      } else {
        console.log(`❌ Данные некорректны (ожидали 1212, получили ${statsAfterData.investments_amount})`);
      }
    } else {
      console.log('\n❌ Статистика НЕ обновилась через API');
    }

  } catch (error) {
    console.error('❌ Ошибка тестирования:', error);
  }
}

testManualStatisticsUpdate();
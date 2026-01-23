require('dotenv').config({ path: '.env.production' });

async function testAPIDatabaseDirect() {
  try {
    console.log('🧪 Тестируем прямое обращение к API статистики...\n');
    
    // Делаем несколько запросов к API статистики подряд
    console.log('📊 Запрос 1 к API статистики:');
    const response1 = await fetch('http://213.171.31.215/api/statistics', {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    const data1 = await response1.json();
    console.log(`   Инвестиции: ${data1.investments_amount}`);
    console.log(`   Обновлено: ${new Date(data1.updated_at).toLocaleString()}`);

    console.log('\n📊 Запрос 2 к API статистики (через 1 секунду):');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const response2 = await fetch('http://213.171.31.215/api/statistics', {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    const data2 = await response2.json();
    console.log(`   Инвестиции: ${data2.investments_amount}`);
    console.log(`   Обновлено: ${new Date(data2.updated_at).toLocaleString()}`);

    // Проверяем, есть ли разница
    if (data1.updated_at !== data2.updated_at) {
      console.log('\n✅ API возвращает разные данные - кеширования нет');
    } else {
      console.log('\n⚠️ API возвращает одинаковые данные - возможно есть кеширование');
    }

    // Теперь обновим статистику через наш JS скрипт и сразу проверим API
    console.log('\n🔄 Обновляем статистику через JS скрипт...');
    const { updateStatistics } = require('./lib/update-statistics.js');
    const updateResult = await updateStatistics();
    console.log('Результат обновления:', updateResult.success ? 'Успешно' : 'Ошибка');

    // Сразу проверяем API
    console.log('\n📊 Запрос к API сразу после обновления:');
    const response3 = await fetch('http://213.171.31.215/api/statistics', {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    const data3 = await response3.json();
    console.log(`   Инвестиции: ${data3.investments_amount}`);
    console.log(`   Обновлено: ${new Date(data3.updated_at).toLocaleString()}`);

    // Сравниваем время обновления
    const timeBefore = new Date(data2.updated_at);
    const timeAfter = new Date(data3.updated_at);
    
    if (timeAfter > timeBefore) {
      console.log('\n✅ API показывает обновленные данные!');
    } else {
      console.log('\n❌ API НЕ показывает обновленные данные');
      console.log(`   Время до: ${timeBefore.toISOString()}`);
      console.log(`   Время после: ${timeAfter.toISOString()}`);
    }

  } catch (error) {
    console.error('❌ Ошибка тестирования:', error);
  }
}

testAPIDatabaseDirect();
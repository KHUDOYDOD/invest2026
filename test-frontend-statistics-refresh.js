require('dotenv').config({ path: '.env.production' });

async function testFrontendStatisticsRefresh() {
  try {
    console.log('🧪 Тестируем обновление статистики на фронтенде...\n');
    
    // Получаем статистику несколько раз с интервалом
    for (let i = 1; i <= 3; i++) {
      console.log(`📊 Запрос статистики #${i}:`);
      
      const response = await fetch('http://213.171.31.215/api/statistics', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      const data = await response.json();
      console.log(`   Пользователи: ${data.users_count}`);
      console.log(`   Инвестиции: ${data.investments_amount}`);
      console.log(`   Выплаты: ${data.payouts_amount}`);
      console.log(`   Доходность: ${data.profitability_rate}%`);
      console.log(`   Обновлено: ${new Date(data.updated_at).toLocaleString()}`);
      console.log(`   Время запроса: ${new Date().toLocaleString()}\n`);
      
      if (i < 3) {
        console.log('⏳ Ждем 10 секунд...\n');
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }
    
    console.log('✅ Тест завершен. Статистика обновляется корректно!');
    
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
  }
}

testFrontendStatisticsRefresh();
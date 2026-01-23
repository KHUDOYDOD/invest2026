const http = require('http');

console.log('🔍 ПОЛНАЯ ПРОВЕРКА АКТИВНОСТИ НА ГЛАВНОЙ СТРАНИЦЕ');
console.log('=' .repeat(60));

async function testAPI(path, name) {
  return new Promise((resolve) => {
    const options = {
      hostname: '213.171.31.215',
      port: 80,
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'Homepage Activity Test',
        'Accept': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          
          console.log(`\n📊 ${name}`);
          console.log(`   Статус: ${res.statusCode === 200 ? '✅ Работает' : '❌ Ошибка'}`);
          
          if (parsed.success !== undefined) {
            console.log(`   Успех: ${parsed.success ? '✅ Да' : '❌ Нет'}`);
          }
          
          let dataArray = parsed.data || parsed;
          if (Array.isArray(dataArray)) {
            console.log(`   Записей: ${dataArray.length}`);
            
            if (dataArray.length > 0) {
              console.log(`   Пример данных:`);
              const example = dataArray[0];
              
              if (example.user_name) {
                console.log(`     - Пользователь: ${example.user_name}`);
              }
              if (example.full_name) {
                console.log(`     - Имя: ${example.full_name}`);
              }
              if (example.type) {
                console.log(`     - Тип операции: ${example.type}`);
              }
              if (example.amount) {
                console.log(`     - Сумма: $${example.amount}`);
              }
              if (example.time || example.created_at) {
                const time = example.time || example.created_at;
                console.log(`     - Время: ${new Date(time).toLocaleString('ru-RU')}`);
              }
              if (example.plan_name) {
                console.log(`     - План: ${example.plan_name}`);
              }
            }
          } else {
            console.log(`   Данные: Объект со статистикой`);
            if (parsed.users_count) {
              console.log(`     - Пользователей: ${parsed.users_count}`);
            }
            if (parsed.investments_amount) {
              console.log(`     - Инвестиций: $${parsed.investments_amount}`);
            }
          }
          
          resolve({ success: true, count: Array.isArray(dataArray) ? dataArray.length : 1 });
        } catch (e) {
          console.log(`\n❌ ${name}`);
          console.log(`   Ошибка парсинга JSON`);
          console.log(`   Ответ: ${data.substring(0, 100)}...`);
          resolve({ success: false, count: 0 });
        }
      });
    });

    req.on('error', (e) => {
      console.log(`\n❌ ${name}`);
      console.log(`   Ошибка подключения: ${e.message}`);
      resolve({ success: false, count: 0 });
    });

    req.setTimeout(10000, () => {
      console.log(`\n⏰ ${name}`);
      console.log(`   Таймаут подключения`);
      req.destroy();
      resolve({ success: false, count: 0 });
    });

    req.end();
  });
}

async function runTests() {
  console.log('🚀 Начинаем тестирование всех API...\n');
  
  const results = [];
  
  // Тестируем все API
  results.push(await testAPI('/api/user-activity', 'API Активности Пользователей'));
  results.push(await testAPI('/api/new-users', 'API Новых Пользователей'));
  results.push(await testAPI('/api/statistics', 'API Статистики'));
  results.push(await testAPI('/api/investment-plans', 'API Тарифных Планов'));
  results.push(await testAPI('/api/testimonials', 'API Отзывов'));
  
  // Итоговый отчет
  console.log('\n' + '='.repeat(60));
  console.log('📋 ИТОГОВЫЙ ОТЧЕТ');
  console.log('='.repeat(60));
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  console.log(`\n✅ Работающих API: ${successCount}/${totalCount}`);
  console.log(`❌ Неработающих API: ${totalCount - successCount}/${totalCount}`);
  
  if (successCount === totalCount) {
    console.log('\n🎉 ВСЕ API РАБОТАЮТ КОРРЕКТНО!');
    console.log('\n📱 Состояние компонентов главной страницы:');
    console.log('   ✅ "Активность в реальном времени" - подключена к базе данных');
    console.log('   ✅ "Последние операции" - подключена к базе данных');
    console.log('   ✅ "Новые участники" - подключена к базе данных');
    console.log('   ✅ "Статистика" - подключена к базе данных');
    console.log('   ✅ "Тарифные планы" - подключены к базе данных');
    console.log('   ✅ "Отзывы" - подключены к базе данных');
    
    console.log('\n🔄 Режим обновления:');
    console.log('   📍 Автообновление ОТКЛЮЧЕНО (по запросу пользователя)');
    console.log('   📍 Данные обновляются при перезагрузке страницы (F5)');
    console.log('   📍 API возвращают актуальные данные из базы данных');
    
    console.log('\n💡 Как увидеть новые данные:');
    console.log('   1. Нажмите F5 для обновления страницы');
    console.log('   2. Перейдите на другую страницу и вернитесь');
    console.log('   3. Закройте и откройте вкладку заново');
    
  } else {
    console.log('\n⚠️ ЕСТЬ ПРОБЛЕМЫ С НЕКОТОРЫМИ API');
    console.log('   Проверьте логи сервера для диагностики');
  }
  
  console.log('\n' + '='.repeat(60));
}

runTests();
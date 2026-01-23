const fetch = require('node-fetch');

const BASE_URL = 'http://213.171.31.215';

async function testAPI(endpoint, description) {
  try {
    console.log(`\n🔍 Тестируем: ${description}`);
    console.log(`📡 URL: ${BASE_URL}${endpoint}`);
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`📊 Статус: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Успешно получены данные:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('❌ Ошибка:');
      console.log(errorText);
    }
  } catch (error) {
    console.log(`❌ Ошибка сети: ${error.message}`);
  }
}

async function runTests() {
  console.log('🚀 Тестирование API эндпоинтов на главной странице...\n');
  
  // Тестируем основные API которые используются на главной странице
  await testAPI('/api/statistics', 'Статистика платформы');
  await testAPI('/api/investment-plans', 'Инвестиционные планы');
  await testAPI('/api/testimonials?limit=5', 'Отзывы пользователей');
  await testAPI('/api/user-activity', 'Активность пользователей');
  await testAPI('/api/new-users', 'Новые пользователи');
  
  console.log('\n✨ Тестирование завершено!');
}

runTests();
const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

async function testAdminWithdrawalAPI() {
  try {
    console.log('🔄 Тестирование API заявок на вывод для админа...\n');

    // Получаем токен администратора из localStorage (нужно будет ввести вручную)
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question('Введите токен администратора (из localStorage в браузере): ', async (token) => {
      readline.close();

      if (!token) {
        console.error('❌ Токен не указан');
        return;
      }

      console.log('📤 Отправка запроса к API...');
      
      const response = await fetch('http://localhost:3000/api/admin/withdrawal-requests', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📥 Статус ответа:', response.status);
      console.log('📥 Статус текст:', response.statusText);

      const data = await response.json();
      
      console.log('\n📋 Ответ API:');
      console.log(JSON.stringify(data, null, 2));

      if (data.requests) {
        console.log(`\n✅ Найдено заявок: ${data.requests.length}`);
        
        if (data.requests.length > 0) {
          console.log('\n📝 Первая заявка:');
          console.log(JSON.stringify(data.requests[0], null, 2));
        }
      } else {
        console.log('\n❌ Поле requests отсутствует в ответе');
      }
    });

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

testAdminWithdrawalAPI();

const fetch = require('node-fetch');

async function testAdminAuth() {
  try {
    console.log('🔐 Тестируем админ аутентификацию...');
    
    const response = await fetch('http://213.171.31.215/api/admin/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'X11021997x'
      })
    });
    
    console.log('📊 Статус ответа:', response.status);
    
    const data = await response.json();
    console.log('📋 Ответ сервера:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Аутентификация успешна!');
      console.log('🔑 Токен:', data.token);
      
      // Тестируем получение заявок
      console.log('\n🔍 Тестируем получение заявок...');
      
      const requestsResponse = await fetch('http://213.171.31.215/api/admin/withdrawal-requests', {
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      });
      
      console.log('📊 Статус заявок:', requestsResponse.status);
      
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        console.log('📋 Количество заявок на вывод:', requestsData.requests?.length || 0);
      } else {
        const errorData = await requestsResponse.json();
        console.log('❌ Ошибка получения заявок:', errorData);
      }
      
    } else {
      console.log('❌ Ошибка аутентификации:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
  }
}

testAdminAuth();
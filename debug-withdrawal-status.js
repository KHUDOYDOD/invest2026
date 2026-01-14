const fetch = require('node-fetch');

async function debugWithdrawalStatus() {
  try {
    console.log('=== ОТЛАДКА СТАТУСА ЗАЯВКИ НА ВЫВОД ===');
    
    // Логинимся как админ
    console.log('🔐 Логинимся как админ...');
    const loginResponse = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (!loginData.success) {
      console.log('❌ Ошибка входа:', loginData.error);
      return;
    }
    
    console.log('✅ Админ вошел успешно!');
    
    // Получаем список заявок на вывод
    console.log('\n📊 Получаем заявки на вывод...');
    const requestsResponse = await fetch('http://localhost:3000/api/admin/withdrawal-requests', {
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });
    
    const requestsData = await requestsResponse.json();
    
    if (!requestsData.success || requestsData.requests.length === 0) {
      console.log('❌ Нет заявок для тестирования');
      return;
    }
    
    // Находим заявку со статусом pending
    const pendingRequest = requestsData.requests.find(req => req.status === 'pending');
    
    if (!pendingRequest) {
      console.log('❌ Нет заявок со статусом pending');
      console.log('📋 Доступные заявки:');
      requestsData.requests.forEach(req => {
        console.log(`   💸 ID: ${req.id.substring(0, 8)}..., Статус: "${req.status}", Сумма: $${req.amount}`);
      });
      return;
    }
    
    console.log(`💸 Найдена заявка для тестирования: ID ${pendingRequest.id.substring(0, 8)}..., статус "${pendingRequest.status}"`);
    
    // Тестируем разные статусы
    const statusesToTest = ['approved', 'rejected', 'pending'];
    
    for (const status of statusesToTest) {
      console.log(`\n🔍 Тестируем статус "${status}"...`);
      
      const testResponse = await fetch(`http://localhost:3000/api/admin/withdrawal-requests/${pendingRequest.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData.token}`
        },
        body: JSON.stringify({
          status: status,
          admin_comment: `Тест статуса ${status}`
        })
      });
      
      console.log(`   📥 Ответ для статуса "${status}":`);
      console.log(`      Status Code: ${testResponse.status}`);
      
      if (testResponse.ok) {
        const data = await testResponse.json();
        console.log(`      ✅ Успех: ${data.success}`);
        console.log(`      📝 Сообщение: ${data.message}`);
        break; // Если успешно, прекращаем тестирование
      } else {
        const errorData = await testResponse.text();
        console.log(`      ❌ Ошибка: ${errorData.substring(0, 200)}...`);
      }
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

debugWithdrawalStatus();
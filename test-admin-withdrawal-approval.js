const fetch = require('node-fetch');

async function testAdminWithdrawalApproval() {
  try {
    console.log('=== ТЕСТИРОВАНИЕ ОДОБРЕНИЯ ЗАЯВКИ НА ВЫВОД ===');
    
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
        console.log(`   💸 ID: ${req.id}, Статус: ${req.status}, Сумма: $${req.amount}`);
      });
      return;
    }
    
    console.log(`💸 Найдена заявка для одобрения: ID ${pendingRequest.id}, сумма $${pendingRequest.amount}`);
    
    // Одобряем заявку
    console.log('\n✅ Одобряем заявку...');
    const approvalResponse = await fetch(`http://localhost:3000/api/admin/withdrawal-requests/${pendingRequest.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify({
        status: 'approved',
        admin_comment: 'Заявка одобрена администратором (тест)'
      })
    });
    
    const approvalData = await approvalResponse.json();
    
    console.log('📥 Ответ API одобрения:');
    console.log('   Status Code:', approvalResponse.status);
    console.log('   Success:', approvalData.success);
    
    if (approvalData.success) {
      console.log('   ✅ Заявка одобрена успешно!');
      console.log('   📝 Сообщение:', approvalData.message);
    } else {
      console.log('   ❌ Ошибка:', approvalData.error);
      console.log('   📝 Детали:', approvalData.details);
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

testAdminWithdrawalApproval();
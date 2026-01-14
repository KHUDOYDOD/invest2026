const fetch = require('node-fetch');

async function testInvestmentCreation() {
  try {
    console.log('=== ТЕСТИРОВАНИЕ СОЗДАНИЯ ИНВЕСТИЦИИ ===');
    
    // Логинимся как пользователь
    console.log('🔐 Логинимся как пользователь...');
    const loginResponse = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'x11021997x@mail.ru',
        password: 'password123'
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (!loginData.success) {
      console.log('❌ Ошибка входа:', loginData.error);
      return;
    }
    
    console.log('✅ Пользователь вошел успешно!');
    console.log('💰 Баланс:', loginData.user.balance);
    
    // Получаем планы инвестирования
    console.log('\n📋 Получаем планы инвестирования...');
    const dashboardResponse = await fetch(`http://localhost:3000/api/dashboard/all?userId=${loginData.user.id}`, {
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });
    
    const dashboardData = await dashboardResponse.json();
    
    if (!dashboardData.success || !dashboardData.investment_plans.length) {
      console.log('❌ Нет планов для тестирования');
      return;
    }
    
    const plan = dashboardData.investment_plans[0]; // Берем первый план
    console.log(`📊 Выбран план: ${plan.name} (мин: $${plan.min_amount}, макс: $${plan.max_amount})`);
    
    // Создаем инвестицию
    const investmentAmount = plan.min_amount; // Инвестируем минимальную сумму
    console.log(`\n💰 Создаем инвестицию на $${investmentAmount}...`);
    
    const investmentResponse = await fetch('http://localhost:3000/api/investments/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify({
        planId: plan.id,
        amount: investmentAmount
      })
    });
    
    console.log('📥 Ответ API создания инвестиции:');
    console.log('   Status Code:', investmentResponse.status);
    
    if (investmentResponse.ok) {
      const data = await investmentResponse.json();
      console.log('   ✅ Успех:', data.success);
      console.log('   📝 Сообщение:', data.message);
      console.log('   💼 Инвестиция:', data.investment);
      console.log('   💰 Новый баланс:', data.newBalance);
    } else {
      const errorData = await investmentResponse.json();
      console.log('   ❌ Ошибка:', errorData.error);
      console.log('   📝 Детали:', errorData.details);
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

testInvestmentCreation();
const fetch = require('node-fetch');

async function testInvestmentCreation() {
  try {
    console.log('🧪 Тестирование создания инвестиции...');
    
    // Сначала логинимся для получения токена
    console.log('🔐 Авторизация...');
    const loginResponse = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123'
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }
    
    const loginData = await loginResponse.json();
    console.log('✅ Авторизация успешна');
    
    const token = loginData.token;
    const userId = loginData.user.id;
    
    // Получаем планы
    console.log('📋 Получение планов...');
    const plansResponse = await fetch('http://localhost:3000/api/investment-plans');
    const plansData = await plansResponse.json();
    
    if (!plansData.success || !plansData.plans.length) {
      throw new Error('No investment plans available');
    }
    
    const plan = plansData.plans[0]; // Берем первый план (Базовый)
    console.log(`📦 Выбран план: ${plan.name} (ID: ${plan.id})`);
    
    // Создаем инвестицию
    console.log('💰 Создание инвестиции...');
    const investmentResponse = await fetch('http://localhost:3000/api/investments/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        planId: plan.id,
        amount: plan.min_amount
      })
    });
    
    console.log('📊 Статус ответа:', investmentResponse.status);
    
    const investmentData = await investmentResponse.json();
    console.log('📋 Ответ API:', JSON.stringify(investmentData, null, 2));
    
    if (investmentResponse.ok && investmentData.success) {
      console.log('✅ Инвестиция создана успешно!');
      console.log(`   💰 Сумма: $${investmentData.investment.amount}`);
      console.log(`   📈 Дневная прибыль: $${investmentData.investment.daily_profit}`);
      console.log(`   📦 План: ${investmentData.investment.plan}`);
      console.log(`   💳 Новый баланс: $${investmentData.newBalance}`);
    } else {
      console.log('❌ Ошибка создания инвестиции:', investmentData.error);
    }
    
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
  }
}

testInvestmentCreation();
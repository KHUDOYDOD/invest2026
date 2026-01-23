const fetch = require('node-fetch');

const BASE_URL = 'http://213.171.31.215';

async function testInvestmentFlow() {
  console.log('🚀 Тестируем создание инвестиции...\n');

  try {
    // 1. Сначала логинимся
    console.log('1️⃣ Авторизация...');
    const loginResponse = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'X11021997x'
      })
    });

    if (!loginResponse.ok) {
      console.log('❌ Ошибка авторизации:', loginResponse.status);
      const errorText = await loginResponse.text();
      console.log(errorText);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Авторизация успешна');
    console.log('Token:', loginData.token ? 'EXISTS' : 'MISSING');
    console.log('User ID:', loginData.user.id);

    // 2. Получаем планы инвестиций
    console.log('\n2️⃣ Получаем планы инвестиций...');
    const plansResponse = await fetch(`${BASE_URL}/api/investment-plans`);
    const plansData = await plansResponse.json();
    
    if (!plansData.success || !plansData.plans.length) {
      console.log('❌ Нет доступных планов');
      return;
    }

    const plan = plansData.plans[0]; // Берем первый план
    console.log('✅ Выбран план:', plan.name);
    console.log('Min amount:', plan.min_amount);

    // 3. Создаем инвестицию
    console.log('\n3️⃣ Создаем инвестицию...');
    const investmentResponse = await fetch(`${BASE_URL}/api/investments/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify({
        planId: plan.id,
        amount: plan.min_amount + 1 // Чуть больше минимума
      })
    });

    console.log('Статус ответа:', investmentResponse.status);

    if (investmentResponse.ok) {
      const investmentData = await investmentResponse.json();
      console.log('✅ Инвестиция создана успешно!');
      console.log(JSON.stringify(investmentData, null, 2));
    } else {
      const errorData = await investmentResponse.json();
      console.log('❌ Ошибка создания инвестиции:');
      console.log(JSON.stringify(errorData, null, 2));
    }

  } catch (error) {
    console.log('❌ Ошибка:', error.message);
  }
}

testInvestmentFlow();
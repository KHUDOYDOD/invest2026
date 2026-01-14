const fetch = require('node-fetch');

async function testCompleteInvestmentFlow() {
  try {
    console.log('🧪 Полное тестирование инвестиционного процесса...');
    
    // 1. Проверяем сервер
    console.log('\n1️⃣ Проверка сервера...');
    try {
      const healthResponse = await fetch('http://localhost:3000/api/investment-plans');
      console.log(`   ✅ Сервер отвечает: ${healthResponse.status}`);
    } catch (error) {
      console.log('   ❌ Сервер не отвечает:', error.message);
      return;
    }
    
    // 2. Авторизация
    console.log('\n2️⃣ Авторизация...');
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
      console.log('   ❌ Ошибка авторизации:', loginResponse.status);
      const errorData = await loginResponse.json();
      console.log('   Детали:', errorData);
      return;
    }
    
    const loginData = await loginResponse.json();
    console.log('   ✅ Авторизация успешна');
    console.log('   👤 Пользователь:', loginData.user.email);
    console.log('   💰 Баланс:', loginData.user.balance);
    
    const token = loginData.token;
    const userId = loginData.user.id;
    
    // 3. Получение планов
    console.log('\n3️⃣ Получение планов...');
    const plansResponse = await fetch('http://localhost:3000/api/investment-plans');
    const plansData = await plansResponse.json();
    
    if (!plansData.success || !plansData.plans.length) {
      console.log('   ❌ Планы не найдены');
      return;
    }
    
    console.log(`   ✅ Загружено планов: ${plansData.plans.length}`);
    const plan = plansData.plans[0];
    console.log(`   📦 Выбран план: ${plan.name}`);
    console.log(`   🆔 ID плана: ${plan.id} (тип: ${typeof plan.id})`);
    console.log(`   💵 Мин. сумма: $${plan.min_amount}`);
    console.log(`   📈 Доходность: ${plan.daily_percent}%`);
    
    // 4. Проверка баланса пользователя
    console.log('\n4️⃣ Проверка баланса...');
    const dashboardResponse = await fetch(`http://localhost:3000/api/dashboard/all?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (dashboardResponse.ok) {
      const dashboardData = await dashboardResponse.json();
      console.log(`   💰 Текущий баланс: $${dashboardData.user.balance}`);
      
      if (dashboardData.user.balance < plan.min_amount) {
        console.log('   ⚠️ Недостаточно средств для инвестиции');
        return;
      }
    }
    
    // 5. Создание инвестиции
    console.log('\n5️⃣ Создание инвестиции...');
    const investmentAmount = plan.min_amount;
    
    const requestBody = {
      planId: plan.id,
      amount: investmentAmount
    };
    
    console.log('   📤 Тело запроса:', JSON.stringify(requestBody, null, 2));
    
    const investmentResponse = await fetch('http://localhost:3000/api/investments/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log(`   📊 Статус ответа: ${investmentResponse.status}`);
    
    const investmentData = await investmentResponse.json();
    console.log('   📋 Ответ сервера:', JSON.stringify(investmentData, null, 2));
    
    if (investmentResponse.ok && investmentData.success) {
      console.log('\n🎉 УСПЕХ! Инвестиция создана:');
      console.log(`   💰 Сумма: $${investmentData.investment.amount}`);
      console.log(`   📈 Дневная прибыль: $${investmentData.investment.daily_profit}`);
      console.log(`   📦 План: ${investmentData.investment.plan}`);
      console.log(`   💳 Новый баланс: $${investmentData.newBalance}`);
      console.log(`   🆔 ID инвестиции: ${investmentData.investment.id}`);
    } else {
      console.log('\n❌ ОШИБКА создания инвестиции:');
      console.log(`   Код: ${investmentResponse.status}`);
      console.log(`   Сообщение: ${investmentData.error || 'Неизвестная ошибка'}`);
      if (investmentData.details) {
        console.log(`   Детали: ${investmentData.details}`);
      }
    }
    
    // 6. Проверка созданной инвестиции в базе
    console.log('\n6️⃣ Проверка в базе данных...');
    // Здесь можно добавить запрос к базе для проверки
    
  } catch (error) {
    console.error('\n💥 КРИТИЧЕСКАЯ ОШИБКА:', error.message);
    console.error('Стек:', error.stack);
  }
}

testCompleteInvestmentFlow();
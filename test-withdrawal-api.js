const fetch = require('node-fetch');

async function testWithdrawalAPI() {
  try {
    console.log('=== ТЕСТИРОВАНИЕ API ВЫВОДА СРЕДСТВ ===');
    
    // Сначала логинимся
    console.log('🔐 Логинимся...');
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
    
    console.log('✅ Успешный вход!');
    console.log('💰 Баланс:', loginData.user.balance);
    
    // Тестируем создание заявки на вывод
    console.log('\n💸 Создаем заявку на вывод $100...');
    const withdrawalResponse = await fetch('http://localhost:3000/api/withdraw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify({
        amount: 100,
        payment_method: 'crypto',
        wallet_address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
      })
    });
    
    const withdrawalData = await withdrawalResponse.json();
    
    console.log('📥 Ответ API вывода:');
    console.log('   Success:', withdrawalData.success);
    
    if (withdrawalData.success) {
      console.log('   ✅ Заявка создана успешно!');
      console.log('   💳 ID транзакции:', withdrawalData.transaction.id);
      console.log('   💰 Сумма:', withdrawalData.transaction.amount);
      console.log('   💸 Комиссия:', withdrawalData.transaction.fee);
      console.log('   💎 К выплате:', withdrawalData.transaction.final_amount);
      console.log('   📊 Статус:', withdrawalData.transaction.status);
    } else {
      console.log('   ❌ Ошибка:', withdrawalData.error);
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

testWithdrawalAPI();
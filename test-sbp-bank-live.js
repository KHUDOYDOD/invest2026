// Тест создания заявки СБП с банком через API
const SERVER_URL = 'http://213.171.31.215';

async function testSbpBankLive() {
  try {
    console.log('🧪 Тестирование СБП с банком на живом сервере...');

    // Авторизуемся
    console.log('🔐 Авторизация...');
    const loginResponse = await fetch(`${SERVER_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: '123123@mail.ru',
        password: '123456'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);

    if (!loginData.success) {
      throw new Error(`Ошибка авторизации: ${loginData.error}`);
    }

    const token = loginData.token;
    console.log('✅ Авторизация успешна');

    // Создаем заявку на вывод через СБП с банком
    console.log('💸 Создание заявки на вывод через СБП с банком...');
    
    const withdrawResponse = await fetch(`${SERVER_URL}/api/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: 50,
        payment_method: 'sbp',
        phone_number: '79991234567',
        account_holder_name: 'Тестов Тест Тестович',
        bank_name: 'Альфа-Банк'
      })
    });

    const withdrawData = await withdrawResponse.json();
    console.log('Withdraw response:', withdrawData);

    if (withdrawData.success) {
      console.log('✅ ТЕСТ УСПЕШЕН!');
      console.log(`   ID транзакции: ${withdrawData.transaction?.id}`);
      console.log(`   Сумма: $50`);
      console.log(`   Метод: СБП`);
      console.log(`   Телефон: +7 (999) 123-45-67`);
      console.log(`   ФИО: Тестов Тест Тестович`);
      console.log(`   🏦 Банк: Альфа-Банк`);
      console.log(`   Статус: ${withdrawData.transaction?.status}`);
      console.log('');
      console.log('🎯 Проверьте админ панель: http://213.171.31.215/admin/requests');
    } else {
      throw new Error(withdrawData.error || 'Неизвестная ошибка');
    }

  } catch (error) {
    console.error('❌ Ошибка теста:', error.message);
  }
}

// Запускаем тест только если это Node.js
if (typeof window === 'undefined') {
  testSbpBankLive();
}
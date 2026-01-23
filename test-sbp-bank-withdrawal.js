// Тест создания заявки на вывод через СБП с банком
const SERVER_URL = 'http://213.171.31.215:3000';

async function testSBPWithdrawal() {
  console.log('🧪 Тестирование создания СБП заявки с банком');
  
  try {
    // 1. Авторизация
    console.log('\n🔐 1. Авторизация пользователя...');
    const loginResponse = await fetch(`${SERVER_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin',
        password: 'X11021997x'
      })
    });

    const loginData = await loginResponse.json();
    
    if (!loginData.success) {
      console.log('❌ Ошибка авторизации:', loginData.error);
      return;
    }
    
    const token = loginData.token;
    console.log('✅ Авторизация успешна');

    // 2. Создание СБП заявки
    console.log('\n📱 2. Создание СБП заявки с банком...');
    const withdrawalData = {
      amount: 150.00,
      method: 'sbp',
      phone_number: '+79876543210',
      account_holder_name: 'Тест СБП Пользователь',
      bank_name: 'Альфа-Банк'
    };

    console.log('📋 Данные заявки:', withdrawalData);

    const withdrawResponse = await fetch(`${SERVER_URL}/api/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(withdrawalData)
    });

    const withdrawResult = await withdrawResponse.json();
    
    if (!withdrawResult.success) {
      console.log('❌ Ошибка создания заявки:', withdrawResult.error);
      if (withdrawResult.details) {
        console.log('📋 Детали:', withdrawResult.details);
      }
      return;
    }

    console.log('✅ СБП заявка создана успешно!');
    console.log('📋 Результат:', withdrawResult);

    // 3. Проверка в админ панели
    console.log('\n🔍 3. Проверка заявки в админ панели...');
    
    const adminResponse = await fetch(`${SERVER_URL}/api/admin/withdrawal-requests`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const adminData = await adminResponse.json();
    
    if (!adminData.success) {
      console.log('❌ Ошибка получения админ данных:', adminData.error);
      return;
    }

    const requests = adminData.requests;
    console.log(`📊 Всего заявок: ${requests.length}`);

    // Ищем СБП заявки
    const sbpRequests = requests.filter(req => 
      req.method === 'СБП' || req.method === 'sbp' || req.phone_number
    );

    console.log(`📱 СБП заявок: ${sbpRequests.length}`);

    if (sbpRequests.length > 0) {
      console.log('\n📋 СБП заявки с банками:');
      sbpRequests.forEach((req, index) => {
        console.log(`\n${index + 1}. Заявка ID: ${req.id}`);
        console.log(`   Метод: ${req.method}`);
        console.log(`   Телефон: ${req.phone_number}`);
        console.log(`   Банк: ${req.bank_name || '❌ НЕ УКАЗАН'}`);
        console.log(`   Владелец: ${req.account_holder_name}`);
        console.log(`   Сумма: $${req.amount}`);
        console.log(`   Статус: ${req.status}`);
        
        if (req.bank_name) {
          console.log(`   ✅ Банк СБП отображается!`);
        } else {
          console.log(`   ❌ Банк СБП НЕ отображается!`);
        }
      });

      // Проверяем последнюю созданную заявку
      const latestSBP = sbpRequests.find(req => req.phone_number === '+79876543210');
      if (latestSBP) {
        console.log('\n🎯 РЕЗУЛЬТАТ ТЕСТА:');
        if (latestSBP.bank_name === 'Альфа-Банк') {
          console.log('✅ СБП банк сохраняется и отображается корректно!');
          console.log(`✅ Банк: ${latestSBP.bank_name}`);
          console.log(`✅ Телефон: ${latestSBP.phone_number}`);
          console.log(`✅ Владелец: ${latestSBP.account_holder_name}`);
        } else {
          console.log('❌ СБП банк НЕ сохраняется правильно!');
          console.log(`❌ Ожидался: Альфа-Банк`);
          console.log(`❌ Получен: ${latestSBP.bank_name || 'null'}`);
        }
      } else {
        console.log('❌ Созданная СБП заявка не найдена в админ панели!');
      }
    } else {
      console.log('❌ СБП заявки не найдены в админ панели!');
    }

  } catch (error) {
    console.error('❌ Ошибка тестирования:', error);
  }
}

// Запуск теста
testSBPWithdrawal();
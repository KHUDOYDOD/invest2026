// Тест для проверки отображения реквизитов в админ панели
const SERVER_URL = 'http://213.171.31.215:3000';

async function debugAdminBankDisplay() {
  console.log('🔍 Отладка отображения реквизитов в админ панели');
  
  try {
    // 1. Авторизация администратора
    console.log('\n🔐 1. Авторизация администратора...');
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

    // 2. Получение заявок на вывод
    console.log('\n📤 2. Получение заявок на вывод...');
    const withdrawalResponse = await fetch(`${SERVER_URL}/api/admin/withdrawal-requests`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const withdrawalData = await withdrawalResponse.json();
    
    if (!withdrawalData.success) {
      console.log('❌ Ошибка получения заявок на вывод:', withdrawalData.error);
      return;
    }

    const withdrawalRequests = withdrawalData.requests;
    console.log(`📊 Всего заявок на вывод: ${withdrawalRequests.length}`);

    // 3. Анализ реквизитов в заявках на вывод
    console.log('\n💳 3. Анализ реквизитов в заявках на вывод:');
    
    withdrawalRequests.forEach((request, index) => {
      console.log(`\n📋 Заявка ${index + 1} (ID: ${request.id}):`);
      console.log(`   Пользователь: ${request.users?.full_name || 'Неизвестный'}`);
      console.log(`   Метод: ${request.method}`);
      console.log(`   Сумма: $${request.amount}`);
      console.log(`   Статус: ${request.status}`);
      
      // Проверяем реквизиты для карт
      if (request.card_number) {
        console.log(`   💳 КАРТА:`);
        console.log(`     Номер карты: ${request.card_number}`);
        console.log(`     Владелец: ${request.card_holder_name || 'Не указан'}`);
        console.log(`     Банк: ${request.bank_name || 'Не указан'}`);
      }
      
      // Проверяем реквизиты для СБП
      if (request.phone_number) {
        console.log(`   📱 СБП:`);
        console.log(`     Телефон: ${request.phone_number}`);
        console.log(`     Владелец: ${request.account_holder_name || 'Не указан'}`);
        console.log(`     Банк: ${request.bank_name || 'Не указан'}`);
      }
      
      // Проверяем реквизиты для крипто
      if (request.wallet_address) {
        console.log(`   🔐 КРИПТО:`);
        console.log(`     Адрес: ${request.wallet_address}`);
        console.log(`     Сеть: ${request.crypto_network || 'Не указана'}`);
      }
      
      // Если нет реквизитов
      if (!request.card_number && !request.phone_number && !request.wallet_address) {
        console.log(`   ❌ РЕКВИЗИТЫ НЕ НАЙДЕНЫ!`);
      }
    });

    // 4. Получение заявок на пополнение
    console.log('\n📥 4. Получение заявок на пополнение...');
    const depositResponse = await fetch(`${SERVER_URL}/api/admin/deposit-requests`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const depositData = await depositResponse.json();
    
    if (!depositData.success) {
      console.log('❌ Ошибка получения заявок на пополнение:', depositData.error);
      return;
    }

    const depositRequests = depositData.requests;
    console.log(`📊 Всего заявок на пополнение: ${depositRequests.length}`);

    // 5. Анализ реквизитов в заявках на пополнение
    console.log('\n💰 5. Анализ реквизитов в заявках на пополнение:');
    
    depositRequests.forEach((request, index) => {
      console.log(`\n📋 Заявка ${index + 1} (ID: ${request.id}):`);
      console.log(`   Пользователь: ${request.users?.full_name || 'Неизвестный'}`);
      console.log(`   Метод: ${request.method}`);
      console.log(`   Сумма: $${request.amount}`);
      console.log(`   Статус: ${request.status}`);
      
      // Проверяем payment_details
      if (request.payment_details && typeof request.payment_details === 'object') {
        console.log(`   📋 PAYMENT_DETAILS:`);
        
        if (request.payment_details.card_number) {
          console.log(`     💳 Номер карты: ${request.payment_details.card_number}`);
        }
        
        if (request.payment_details.phone_number) {
          console.log(`     📱 Телефон: ${request.payment_details.phone_number}`);
        }
        
        if (request.payment_details.wallet_address) {
          console.log(`     🔐 Кошелек: ${request.payment_details.wallet_address}`);
        }
        
        if (request.payment_details.transaction_hash) {
          console.log(`     🔗 Хэш: ${request.payment_details.transaction_hash}`);
        }
      } else {
        console.log(`   ❌ PAYMENT_DETAILS НЕ НАЙДЕНЫ!`);
      }
    });

    // 6. Итоговый анализ
    console.log('\n🎯 6. ИТОГОВЫЙ АНАЛИЗ:');
    
    const withdrawalWithDetails = withdrawalRequests.filter(r => 
      r.card_number || r.phone_number || r.wallet_address
    );
    
    const depositWithDetails = depositRequests.filter(r => 
      r.payment_details && typeof r.payment_details === 'object'
    );
    
    console.log(`📤 Заявки на вывод с реквизитами: ${withdrawalWithDetails.length}/${withdrawalRequests.length}`);
    console.log(`📥 Заявки на пополнение с реквизитами: ${depositWithDetails.length}/${depositRequests.length}`);
    
    if (withdrawalWithDetails.length === 0 && depositWithDetails.length === 0) {
      console.log('\n❌ ПРОБЛЕМА: Реквизиты не найдены ни в одной заявке!');
      console.log('Возможные причины:');
      console.log('- Заявки созданы без реквизитов');
      console.log('- API не возвращает реквизиты');
      console.log('- Проблема с базой данных');
    } else {
      console.log('\n✅ РЕКВИЗИТЫ НАЙДЕНЫ! Админ панель должна их отображать.');
    }

  } catch (error) {
    console.error('❌ Ошибка отладки:', error);
  }
}

// Запуск отладки
debugAdminBankDisplay();
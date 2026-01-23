// Тест для проверки отображения СБП банков в админ панели
console.log('🔍 Отладка проблемы с СБП банками в админ панели');

// Симуляция данных, которые приходят из API
const mockWithdrawalRequests = [
  {
    id: '1',
    user_id: '1',
    amount: 100.00,
    method: 'СБП', // Переведенное название
    phone_number: '+79123456789',
    account_holder_name: 'Иван Иванов',
    bank_name: 'Сбербанк', // Это поле должно отображаться
    status: 'pending',
    created_at: '2025-01-22T14:30:00Z',
    users: {
      full_name: 'Иван Иванов',
      email: 'ivan@example.com'
    }
  },
  {
    id: '2',
    user_id: '2',
    amount: 250.00,
    method: 'Банковская карта',
    card_number: '1234567890123456',
    card_holder_name: 'Петр Петров',
    bank_name: 'ВТБ',
    status: 'pending',
    created_at: '2025-01-22T15:00:00Z',
    users: {
      full_name: 'Петр Петров',
      email: 'petr@example.com'
    }
  }
];

console.log('\n📋 Тестовые данные заявок:');
mockWithdrawalRequests.forEach((request, index) => {
  console.log(`\n${index + 1}. Заявка ID: ${request.id}`);
  console.log(`   Метод: ${request.method}`);
  console.log(`   Сумма: $${request.amount}`);
  
  if (request.method === 'СБП') {
    console.log(`   📱 СБП данные:`);
    console.log(`     Телефон: ${request.phone_number}`);
    console.log(`     Банк: ${request.bank_name}`);
    console.log(`     Владелец: ${request.account_holder_name}`);
  } else if (request.method === 'Банковская карта') {
    console.log(`   💳 Карта данные:`);
    console.log(`     Номер карты: ${request.card_number}`);
    console.log(`     Банк: ${request.bank_name}`);
    console.log(`     Владелец: ${request.card_holder_name}`);
  }
});

// Проверяем логику отображения реквизитов
console.log('\n🔍 Проверка логики отображения реквизитов:');

function checkRequestDetails(request) {
  console.log(`\n📋 Анализ заявки ${request.id} (${request.method}):`);
  
  // Проверяем условия для отображения реквизитов
  const hasCardDetails = !!request.card_number;
  const hasSBPDetails = !!request.phone_number;
  const hasWalletDetails = !!request.wallet_address;
  const hasPaymentDetails = request.payment_details && typeof request.payment_details === 'object';
  
  console.log(`   Карта: ${hasCardDetails ? '✅' : '❌'}`);
  console.log(`   СБП: ${hasSBPDetails ? '✅' : '❌'}`);
  console.log(`   Кошелек: ${hasWalletDetails ? '✅' : '❌'}`);
  console.log(`   Payment Details: ${hasPaymentDetails ? '✅' : '❌'}`);
  
  // Проверяем отображение банка
  if (hasCardDetails && request.bank_name) {
    console.log(`   🏦 Банк карты: ${request.bank_name} ✅`);
  }
  
  if (hasSBPDetails && request.bank_name) {
    console.log(`   🏦 Банк СБП: ${request.bank_name} ✅`);
  }
  
  if (!request.bank_name) {
    console.log(`   ❌ Банк не указан!`);
  }
  
  // Проверяем условие "нет реквизитов"
  const noDetails = !hasCardDetails && !hasSBPDetails && !hasWalletDetails && 
    (!hasPaymentDetails || 
     (!request.payment_details.card_number && 
      !request.payment_details.phone_number && 
      !request.payment_details.wallet_address));
  
  if (noDetails) {
    console.log(`   ⚠️ Будет показано "Реквизиты не указаны"`);
  }
}

mockWithdrawalRequests.forEach(checkRequestDetails);

// Проверяем фильтрацию СБП заявок
console.log('\n🔍 Фильтрация СБП заявок:');
const sbpRequests = mockWithdrawalRequests.filter(req => req.method === 'СБП');
console.log(`Найдено СБП заявок: ${sbpRequests.length}`);

sbpRequests.forEach(req => {
  console.log(`\n📱 СБП заявка ${req.id}:`);
  console.log(`   Телефон: ${req.phone_number}`);
  console.log(`   Банк: ${req.bank_name}`);
  console.log(`   Владелец: ${req.account_holder_name}`);
  
  if (req.phone_number && req.bank_name) {
    console.log(`   ✅ Все данные СБП присутствуют`);
  } else {
    console.log(`   ❌ Отсутствуют данные СБП`);
  }
});

console.log('\n🎯 ВЫВОДЫ:');
console.log('1. ✅ Структура данных корректна');
console.log('2. ✅ СБП заявки содержат bank_name');
console.log('3. ✅ Логика отображения должна работать');
console.log('4. 🔍 Нужно проверить реальные данные из API');

console.log('\n📋 СЛЕДУЮЩИЕ ШАГИ:');
console.log('1. Проверить реальный API /api/admin/withdrawal-requests');
console.log('2. Убедиться, что СБП заявки сохраняются с bank_name');
console.log('3. Проверить фронтенд код админ панели');
console.log('4. Протестировать в браузере');

// Симуляция API ответа
console.log('\n📡 Симуляция API ответа:');
const apiResponse = {
  success: true,
  requests: mockWithdrawalRequests
};

console.log('API Response:', JSON.stringify(apiResponse, null, 2));
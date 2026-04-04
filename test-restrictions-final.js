// Финальный тест ограничений API
const fetch = require('node-fetch');

const BASE_URL = 'http://213.171.31.215';

async function testAPIRestrictions() {
  console.log('🧪 Финальный тест ограничений API...\n');

  // 1. Проверяем статус функций
  console.log('1️⃣ Проверяем статус функций:');
  try {
    const response = await fetch(`${BASE_URL}/api/site-status`);
    const data = await response.json();
    
    console.log(`   🚫 Регистрация: ${data.registration_enabled ? 'ВКЛЮЧЕНА' : 'ОТКЛЮЧЕНА'}`);
    console.log(`   📈 Инвестиции: ${data.investments_enabled ? 'ВКЛЮЧЕНЫ' : 'ОТКЛЮЧЕНЫ'}`);
    console.log(`   💰 Пополнение: ${data.deposits_enabled ? 'ВКЛЮЧЕНО' : 'ОТКЛЮЧЕНО'}`);
    console.log(`   💸 Вывод: ${data.withdrawals_enabled ? 'ВКЛЮЧЕН' : 'ОТКЛЮЧЕН'}`);
    console.log(`   📝 Сообщение: ${data.message}\n`);
  } catch (error) {
    console.log(`   ❌ Ошибка: ${error.message}\n`);
  }

  // 2. Тестируем регистрацию
  console.log('2️⃣ Тестируем регистрацию:');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: '123456',
        fullName: 'Тест Пользователь',
        country: 'Россия'
      })
    });
    
    const data = await response.json();
    
    if (response.status === 403 && data.disabled) {
      console.log('   ✅ ОГРАНИЧЕНИЕ РАБОТАЕТ!');
      console.log(`   🚫 Статус: ${response.status}`);
      console.log(`   📝 Сообщение: ${data.error}\n`);
    } else if (response.ok) {
      console.log('   ⚠️ Регистрация прошла успешно (ограничение НЕ работает)');
      console.log(`   ✅ Пользователь создан: ${data.user?.email}\n`);
    } else {
      console.log(`   ❌ Неожиданная ошибка: ${data.error}\n`);
    }
  } catch (error) {
    console.log(`   ❌ Ошибка запроса: ${error.message}\n`);
  }

  // 3. Тестируем пополнение (без токена - должно вернуть 401)
  console.log('3️⃣ Тестируем пополнение (без авторизации):');
  try {
    const response = await fetch(`${BASE_URL}/api/deposit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 100,
        payment_method: 'card',
        card_number: '1234567890123456'
      })
    });
    
    const data = await response.json();
    
    if (response.status === 401) {
      console.log('   ✅ Правильно требует авторизацию');
      console.log(`   🔐 Статус: ${response.status}`);
      console.log(`   📝 Сообщение: ${data.error}\n`);
    } else {
      console.log(`   ⚠️ Неожиданный ответ: ${response.status} - ${data.error || data.message}\n`);
    }
  } catch (error) {
    console.log(`   ❌ Ошибка запроса: ${error.message}\n`);
  }

  console.log('🎯 Тест завершен!');
  console.log('📋 Для полного тестирования с авторизацией откройте:');
  console.log('   http://213.171.31.215/test-api-restrictions.html');
}

testAPIRestrictions();
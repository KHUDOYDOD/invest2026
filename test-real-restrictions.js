// Реальный тест ограничений с полной диагностикой
const fetch = require('node-fetch');

const BASE_URL = 'http://213.171.31.215';

async function testRealRestrictions() {
  console.log('🔍 РЕАЛЬНЫЙ ТЕСТ ОГРАНИЧЕНИЙ API...\n');

  // 1. Проверяем статус функций
  console.log('1️⃣ Проверяем статус функций:');
  try {
    const response = await fetch(`${BASE_URL}/api/site-status`);
    const data = await response.json();
    
    console.log(`   Статус ответа: ${response.status}`);
    console.log(`   🚫 Регистрация: ${data.registration_enabled ? 'ВКЛЮЧЕНА ❌' : 'ОТКЛЮЧЕНА ✅'}`);
    console.log(`   📈 Инвестиции: ${data.investments_enabled ? 'ВКЛЮЧЕНЫ ❌' : 'ОТКЛЮЧЕНЫ ✅'}`);
    console.log(`   💰 Пополнение: ${data.deposits_enabled ? 'ВКЛЮЧЕНО ❌' : 'ОТКЛЮЧЕНО ✅'}`);
    console.log(`   💸 Вывод: ${data.withdrawals_enabled ? 'ВКЛЮЧЕН ❌' : 'ОТКЛЮЧЕН ✅'}`);
    console.log(`   📝 Сообщение: ${data.message}`);
    console.log(`   🔍 Полный ответ:`, JSON.stringify(data, null, 2));
    console.log('');
  } catch (error) {
    console.log(`   ❌ Ошибка: ${error.message}\n`);
  }

  // 2. Тестируем регистрацию с уникальным email
  console.log('2️⃣ Тестируем регистрацию:');
  const testEmail = `test${Date.now()}@example.com`;
  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: '123456',
        fullName: 'Тест Пользователь',
        country: 'Россия'
      })
    });
    
    const data = await response.json();
    
    console.log(`   Статус ответа: ${response.status}`);
    console.log(`   🔍 Полный ответ:`, JSON.stringify(data, null, 2));
    
    if (response.status === 403 && data.disabled) {
      console.log('   ✅ ОГРАНИЧЕНИЕ РАБОТАЕТ!');
      console.log(`   📝 Сообщение: ${data.error}`);
    } else if (response.ok) {
      console.log('   ❌ ОГРАНИЧЕНИЕ НЕ РАБОТАЕТ! Регистрация прошла успешно');
      console.log(`   ✅ Пользователь создан: ${data.user?.email}`);
    } else {
      console.log(`   ⚠️ Другая ошибка: ${data.error}`);
    }
    console.log('');
  } catch (error) {
    console.log(`   ❌ Ошибка запроса: ${error.message}\n`);
  }

  // 3. Создаем тестового пользователя для проверки других функций
  console.log('3️⃣ Создаем тестового пользователя для проверки других API:');
  let testToken = null;
  const testUserEmail = `testuser${Date.now()}@example.com`;
  
  try {
    // Сначала попробуем войти как админ
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'X11021997x'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      testToken = loginData.token;
      console.log('   ✅ Вошли как админ для тестирования');
    } else {
      console.log('   ⚠️ Не удалось войти как админ, создаем нового пользователя...');
      
      // Если не получилось войти как админ, попробуем создать нового пользователя
      const registerResponse = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUserEmail,
          password: '123456',
          fullName: 'Тест Пользователь',
          country: 'Россия'
        })
      });
      
      if (registerResponse.ok) {
        const registerData = await registerResponse.json();
        testToken = registerData.token;
        console.log('   ✅ Создан тестовый пользователь');
      }
    }
    console.log('');
  } catch (error) {
    console.log(`   ❌ Ошибка создания пользователя: ${error.message}\n`);
  }

  // 4. Тестируем инвестиции
  if (testToken) {
    console.log('4️⃣ Тестируем создание инвестиции:');
    try {
      const response = await fetch(`${BASE_URL}/api/investments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${testToken}`
        },
        body: JSON.stringify({
          planId: '1',
          amount: 100
        })
      });
      
      const data = await response.json();
      
      console.log(`   Статус ответа: ${response.status}`);
      console.log(`   🔍 Полный ответ:`, JSON.stringify(data, null, 2));
      
      if (response.status === 403 && data.disabled) {
        console.log('   ✅ ОГРАНИЧЕНИЕ РАБОТАЕТ!');
        console.log(`   📝 Сообщение: ${data.error}`);
      } else if (response.ok) {
        console.log('   ❌ ОГРАНИЧЕНИЕ НЕ РАБОТАЕТ! Инвестиция создана');
      } else {
        console.log(`   ⚠️ Другая ошибка: ${data.error}`);
      }
      console.log('');
    } catch (error) {
      console.log(`   ❌ Ошибка запроса: ${error.message}\n`);
    }

    // 5. Тестируем пополнение
    console.log('5️⃣ Тестируем пополнение:');
    try {
      const response = await fetch(`${BASE_URL}/api/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${testToken}`
        },
        body: JSON.stringify({
          amount: 50,
          payment_method: 'card',
          card_number: '1234567890123456'
        })
      });
      
      const data = await response.json();
      
      console.log(`   Статус ответа: ${response.status}`);
      console.log(`   🔍 Полный ответ:`, JSON.stringify(data, null, 2));
      
      if (response.status === 403 && data.disabled) {
        console.log('   ✅ ОГРАНИЧЕНИЕ РАБОТАЕТ!');
        console.log(`   📝 Сообщение: ${data.error}`);
      } else if (response.ok) {
        console.log('   ❌ ОГРАНИЧЕНИЕ НЕ РАБОТАЕТ! Пополнение создано');
      } else {
        console.log(`   ⚠️ Другая ошибка: ${data.error}`);
      }
      console.log('');
    } catch (error) {
      console.log(`   ❌ Ошибка запроса: ${error.message}\n`);
    }

    // 6. Тестируем вывод
    console.log('6️⃣ Тестируем вывод средств:');
    try {
      const response = await fetch(`${BASE_URL}/api/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${testToken}`
        },
        body: JSON.stringify({
          amount: 25,
          method: 'card',
          card_number: '1234567890123456',
          card_holder_name: 'Test User'
        })
      });
      
      const data = await response.json();
      
      console.log(`   Статус ответа: ${response.status}`);
      console.log(`   🔍 Полный ответ:`, JSON.stringify(data, null, 2));
      
      if (response.status === 403 && data.disabled) {
        console.log('   ✅ ОГРАНИЧЕНИЕ РАБОТАЕТ!');
        console.log(`   📝 Сообщение: ${data.error}`);
      } else if (response.ok) {
        console.log('   ❌ ОГРАНИЧЕНИЕ НЕ РАБОТАЕТ! Вывод создан');
      } else {
        console.log(`   ⚠️ Другая ошибка: ${data.error}`);
      }
      console.log('');
    } catch (error) {
      console.log(`   ❌ Ошибка запроса: ${error.message}\n`);
    }
  }

  console.log('🎯 ДИАГНОСТИКА ЗАВЕРШЕНА!');
  console.log('📋 Если ограничения не работают, нужно проверить:');
  console.log('   1. Настройки в базе данных');
  console.log('   2. Логику в API файлах');
  console.log('   3. Кэширование на сервере');
}

testRealRestrictions();
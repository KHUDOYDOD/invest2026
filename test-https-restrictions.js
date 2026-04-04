// Тест ограничений через HTTPS
const https = require('https');

// Отключаем проверку SSL для самоподписанных сертификатов
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

async function testHttpsRestrictions() {
  console.log('🧪 ТЕСТ ОГРАНИЧЕНИЙ ЧЕРЕЗ HTTPS\n');
  
  // 1. Проверяем статус через HTTPS
  console.log('1️⃣ Проверяем статус функций через HTTPS:');
  try {
    const response = await fetch('https://tradepo.ru/api/site-status');
    const data = await response.json();
    
    const regStatus = data.registration_enabled ? '❌ ВКЛЮЧЕНА' : '✅ ОТКЛЮЧЕНА';
    const invStatus = data.investments_enabled ? '❌ ВКЛЮЧЕНЫ' : '✅ ОТКЛЮЧЕНЫ';
    const depStatus = data.deposits_enabled ? '❌ ВКЛЮЧЕНО' : '✅ ОТКЛЮЧЕНО';
    const witStatus = data.withdrawals_enabled ? '❌ ВКЛЮЧЕН' : '✅ ОТКЛЮЧЕН';
    
    console.log(`   🚫 Регистрация: ${regStatus}`);
    console.log(`   📈 Инвестиции: ${invStatus}`);
    console.log(`   💰 Пополнение: ${depStatus}`);
    console.log(`   💸 Вывод: ${witStatus}`);
    
    const allDisabled = !data.registration_enabled && !data.investments_enabled && 
                       !data.deposits_enabled && !data.withdrawals_enabled;
    
    if (allDisabled) {
      console.log('\n🎉 ВСЕ ФУНКЦИИ ОТКЛЮЧЕНЫ - СИСТЕМА РАБОТАЕТ!');
    } else {
      console.log('\n⚠️ Некоторые функции еще включены');
    }
    
  } catch (error) {
    console.log(`❌ Ошибка: ${error.message}`);
  }
  
  // 2. Тестируем регистрацию через HTTPS
  console.log('\n2️⃣ Тестируем регистрацию через HTTPS:');
  try {
    const response = await fetch('https://tradepo.ru/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test${Date.now()}@example.com`,
        password: '123456',
        fullName: 'Test User',
        country: 'Russia'
      })
    });
    
    if (response.status === 403) {
      console.log('   ✅ РЕГИСТРАЦИЯ ЗАБЛОКИРОВАНА!');
      const data = await response.json();
      console.log(`   📝 Сообщение: ${data.error}`);
    } else if (response.ok) {
      console.log('   ❌ Регистрация НЕ заблокирована');
    } else {
      console.log(`   ⚠️ Неожиданный статус: ${response.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Ошибка: ${error.message}`);
  }
  
  console.log('\n🔗 Ссылки для проверки:');
  console.log('   📊 Статус API: https://tradepo.ru/api/site-status');
  console.log('   🧪 Полный тест: https://tradepo.ru/test-api-restrictions.html');
  console.log('   🎛️ Админ панель: https://tradepo.ru/admin/project-launches');
}

testHttpsRestrictions();
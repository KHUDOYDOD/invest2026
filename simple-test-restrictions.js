// Простой тест для проверки ограничений
const fetch = require('node-fetch');

async function simpleTest() {
  console.log('🧪 ПРОСТОЙ ТЕСТ ОГРАНИЧЕНИЙ\n');
  
  // 1. Проверяем статус
  console.log('1️⃣ Проверяем статус функций:');
  try {
    const response = await fetch('http://213.171.31.215/api/site-status');
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
  
  // 2. Тестируем регистрацию
  console.log('\n2️⃣ Тестируем регистрацию:');
  try {
    const response = await fetch('http://213.171.31.215/api/auth/register', {
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
    } else {
      console.log('   ❌ Регистрация НЕ заблокирована');
    }
  } catch (error) {
    console.log(`   ❌ Ошибка: ${error.message}`);
  }
  
  console.log('\n🔗 Ссылки для проверки:');
  console.log('   📊 Статус API: http://213.171.31.215/api/site-status');
  console.log('   🧪 Полный тест: http://213.171.31.215/test-api-restrictions.html');
  console.log('   🎛️ Админ панель: http://213.171.31.215/admin/project-launches');
}

simpleTest();
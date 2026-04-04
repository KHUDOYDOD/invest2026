const fetch = require('node-fetch')

const BASE_URL = 'http://213.171.31.215'

async function testWithAdminLogin() {
  console.log('🧪 ТЕСТ ОГРАНИЧЕНИЙ С РЕАЛЬНЫМ ВХОДОМ...\n')
  
  // 1. Входим как админ
  console.log('1️⃣ Входим как админ:')
  let adminToken = null
  
  try {
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'X11021997x'
      })
    })
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json()
      adminToken = loginData.token
      console.log('   ✅ Успешно вошли как админ')
      console.log(`   👤 Пользователь: ${loginData.user?.email}`)
      console.log(`   🔑 Токен получен`)
    } else {
      const errorData = await loginResponse.json()
      console.log('   ❌ Не удалось войти как админ')
      console.log(`   📝 Ошибка: ${errorData.error}`)
      return
    }
  } catch (error) {
    console.log(`   ❌ Ошибка входа: ${error.message}`)
    return
  }
  
  // 2. Проверяем статус ограничений
  console.log('\n2️⃣ Проверяем статус ограничений:')
  try {
    const statusResponse = await fetch(`${BASE_URL}/api/site-status`)
    const statusData = await statusResponse.json()
    
    console.log(`   🚫 Регистрация: ${statusData.registration_enabled ? 'ВКЛЮЧЕНА ❌' : 'ОТКЛЮЧЕНА ✅'}`)
    console.log(`   📈 Инвестиции: ${statusData.investments_enabled ? 'ВКЛЮЧЕНЫ ❌' : 'ОТКЛЮЧЕНЫ ✅'}`)
    console.log(`   💰 Пополнение: ${statusData.deposits_enabled ? 'ВКЛЮЧЕНО ❌' : 'ОТКЛЮЧЕНО ✅'}`)
    console.log(`   💸 Вывод: ${statusData.withdrawals_enabled ? 'ВКЛЮЧЕН ❌' : 'ОТКЛЮЧЕН ✅'}`)
  } catch (error) {
    console.log(`   ❌ Ошибка проверки статуса: ${error.message}`)
  }
  
  // 3. Тестируем инвестиции с админским токеном
  console.log('\n3️⃣ Тестируем инвестиции (админ):')
  try {
    const response = await fetch(`${BASE_URL}/api/investments/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        planId: '1',
        amount: 100
      })
    })
    
    const data = await response.json()
    
    console.log(`   Статус: ${response.status}`)
    if (response.status === 403 && data.disabled) {
      console.log('   ✅ ИНВЕСТИЦИИ ЗАБЛОКИРОВАНЫ!')
      console.log(`   📝 ${data.error}`)
    } else {
      console.log('   ❌ Инвестиции НЕ заблокированы')
      console.log(`   📊 Ответ: ${JSON.stringify(data, null, 2)}`)
    }
  } catch (error) {
    console.log(`   ❌ Ошибка: ${error.message}`)
  }
  
  // 4. Тестируем пополнение с админским токеном
  console.log('\n4️⃣ Тестируем пополнение (админ):')
  try {
    const response = await fetch(`${BASE_URL}/api/deposit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        amount: 50,
        payment_method: 'card',
        card_number: '1234567890123456'
      })
    })
    
    const data = await response.json()
    
    console.log(`   Статус: ${response.status}`)
    if (response.status === 403 && data.disabled) {
      console.log('   ✅ ПОПОЛНЕНИЕ ЗАБЛОКИРОВАНО!')
      console.log(`   📝 ${data.error}`)
    } else {
      console.log('   ❌ Пополнение НЕ заблокировано')
      console.log(`   📊 Ответ: ${JSON.stringify(data, null, 2)}`)
    }
  } catch (error) {
    console.log(`   ❌ Ошибка: ${error.message}`)
  }
  
  // 5. Тестируем вывод с админским токеном
  console.log('\n5️⃣ Тестируем вывод (админ):')
  try {
    const response = await fetch(`${BASE_URL}/api/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        amount: 25,
        method: 'card',
        card_number: '1234567890123456',
        card_holder_name: 'Admin User'
      })
    })
    
    const data = await response.json()
    
    console.log(`   Статус: ${response.status}`)
    if (response.status === 403 && data.disabled) {
      console.log('   ✅ ВЫВОД ЗАБЛОКИРОВАН!')
      console.log(`   📝 ${data.error}`)
    } else {
      console.log('   ❌ Вывод НЕ заблокирован')
      console.log(`   📊 Ответ: ${JSON.stringify(data, null, 2)}`)
    }
  } catch (error) {
    console.log(`   ❌ Ошибка: ${error.message}`)
  }
  
  // 6. Тестируем регистрацию нового пользователя
  console.log('\n6️⃣ Тестируем регистрацию нового пользователя:')
  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `newtest${Date.now()}@example.com`,
        password: '123456',
        fullName: 'New Test User',
        country: 'Russia'
      })
    })
    
    const data = await response.json()
    
    console.log(`   Статус: ${response.status}`)
    if (response.status === 403 && data.disabled) {
      console.log('   ✅ РЕГИСТРАЦИЯ ЗАБЛОКИРОВАНА!')
      console.log(`   📝 ${data.error}`)
    } else {
      console.log('   ❌ Регистрация НЕ заблокирована')
      console.log(`   📊 Ответ: ${JSON.stringify(data, null, 2)}`)
    }
  } catch (error) {
    console.log(`   ❌ Ошибка: ${error.message}`)
  }
  
  console.log('\n🎯 ИТОГ ТЕСТИРОВАНИЯ:')
  console.log('Если все функции показывают "ЗАБЛОКИРОВАНО" - система работает!')
  console.log('Если какие-то функции НЕ заблокированы - нужно дополнительное исправление.')
}

testWithAdminLogin()
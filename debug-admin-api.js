const fetch = require('node-fetch');

async function debugAdminAPI() {
  const baseUrl = 'http://213.171.31.215';
  
  console.log('🔍 Отладка админ API...\n');
  
  try {
    // Тест 1: Проверяем API заявок без авторизации
    console.log('1️⃣ Проверяем API заявок на пополнение без авторизации...');
    const depositResponse = await fetch(`${baseUrl}/api/admin/deposit-requests`);
    console.log(`Статус: ${depositResponse.status}`);
    const depositText = await depositResponse.text();
    console.log(`Ответ: ${depositText.substring(0, 200)}`);
    
    console.log('\n2️⃣ Проверяем API заявок на вывод без авторизации...');
    const withdrawalResponse = await fetch(`${baseUrl}/api/admin/withdrawal-requests`);
    console.log(`Статус: ${withdrawalResponse.status}`);
    const withdrawalText = await withdrawalResponse.text();
    console.log(`Ответ: ${withdrawalText.substring(0, 200)}`);
    
    // Тест 3: Проверяем логин админа
    console.log('\n3️⃣ Пробуем войти как админ...');
    const loginResponse = await fetch(`${baseUrl}/api/admin/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: 'admin',
        password: 'X11021997x'
      })
    });
    
    console.log(`Статус логина: ${loginResponse.status}`);
    const loginResult = await loginResponse.text();
    console.log(`Результат логина: ${loginResult.substring(0, 300)}`);
    
    // Если логин успешен, пробуем получить токен
    if (loginResponse.ok) {
      const loginData = JSON.parse(loginResult);
      if (loginData.token) {
        console.log('\n4️⃣ Проверяем API с токеном...');
        
        const authDepositResponse = await fetch(`${baseUrl}/api/admin/deposit-requests`, {
          headers: {
            'Authorization': `Bearer ${loginData.token}`
          }
        });
        
        console.log(`Статус с токеном: ${authDepositResponse.status}`);
        if (authDepositResponse.ok) {
          const authDepositData = await authDepositResponse.json();
          console.log(`✅ Заявки на пополнение: ${authDepositData.requests ? authDepositData.requests.length : 0}`);
        }
        
        const authWithdrawalResponse = await fetch(`${baseUrl}/api/admin/withdrawal-requests`, {
          headers: {
            'Authorization': `Bearer ${loginData.token}`
          }
        });
        
        console.log(`Статус вывода с токеном: ${authWithdrawalResponse.status}`);
        if (authWithdrawalResponse.ok) {
          const authWithdrawalData = await authWithdrawalResponse.json();
          console.log(`✅ Заявки на вывод: ${authWithdrawalData.requests ? authWithdrawalData.requests.length : 0}`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Ошибка при отладке:', error.message);
  }
}

debugAdminAPI();
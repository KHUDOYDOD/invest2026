const fetch = require('node-fetch');

async function testRegistration() {
  try {
    console.log('🧪 Тестируем регистрацию...');
    
    const testUser = {
      email: 'test.registration@example.com',
      password: 'TestPassword123',
      fullName: 'Тестовый Пользователь Регистрации',
      country: 'RU'
    };
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });
    
    const data = await response.json();
    
    console.log('📊 Статус ответа:', response.status);
    console.log('📦 Данные ответа:', data);
    
    if (response.ok && data.success) {
      console.log('✅ Регистрация работает!');
      console.log('👤 Создан пользователь:', data.user.fullName);
      console.log('🎫 Реферальный код:', data.user.referralCode);
    } else {
      console.log('❌ Ошибка регистрации:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Ошибка теста:', error.message);
  }
}

testRegistration();
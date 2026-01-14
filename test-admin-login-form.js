const fetch = require('node-fetch');

async function testAdminLoginForm() {
  try {
    console.log('=== ТЕСТИРОВАНИЕ ФОРМЫ ВХОДА АДМИНА ===');
    
    // Тестируем вход с данными админа через обычный API
    console.log('🔐 Тестируем вход админа через /api/login...');
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
      })
    });
    
    const data = await response.json();
    
    console.log('📥 Ответ API:');
    console.log('   Status Code:', response.status);
    console.log('   Success:', data.success);
    
    if (data.success) {
      console.log('   ✅ Вход успешен!');
      console.log('   👤 Пользователь:', data.user.fullName);
      console.log('   📧 Email:', data.user.email);
      console.log('   🎭 Роль:', data.user.role);
      console.log('   👑 Админ:', data.user.isAdmin);
      console.log('   🎫 Токен:', data.token.substring(0, 50) + '...');
      console.log('   🔄 Redirect:', data.redirect);
      
      if (data.user.isAdmin) {
        console.log('\n✅ Пользователь имеет права администратора!');
        console.log('🎯 Форма входа админа должна работать правильно');
      } else {
        console.log('\n❌ Пользователь НЕ имеет права администратора!');
      }
    } else {
      console.log('   ❌ Ошибка входа:', data.error);
    }
    
    // Тестируем вход с неправильными данными
    console.log('\n🔐 Тестируем вход с неправильными данными...');
    const wrongResponse = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'wrong@example.com',
        password: 'wrongpassword'
      })
    });
    
    const wrongData = await wrongResponse.json();
    console.log('📥 Ответ с неправильными данными:');
    console.log('   Status Code:', wrongResponse.status);
    console.log('   Success:', wrongData.success);
    console.log('   Error:', wrongData.error);
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

testAdminLoginForm();
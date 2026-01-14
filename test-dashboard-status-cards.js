const fetch = require('node-fetch');

async function testDashboardStatusCards() {
  try {
    console.log('🧪 Тестирование карточек статуса в дашборде...');
    
    // Тестируем разных пользователей
    const users = [
      { email: 'test@example.com', password: 'test123', name: 'Верифицированный пользователь' },
      { email: 'admin@example.com', password: 'admin123', name: 'Неверифицированный админ' }
    ];

    for (const testUser of users) {
      console.log(`\n👤 Тестирование: ${testUser.name}`);
      console.log('🔐 Авторизация...');
      
      const loginResponse = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      });
      
      if (!loginResponse.ok) {
        console.log(`❌ Ошибка авторизации для ${testUser.email}: ${loginResponse.status}`);
        continue;
      }
      
      const loginData = await loginResponse.json();
      console.log('✅ Авторизация успешна');
      
      const token = loginData.token;
      const userId = loginData.user.id;
      
      // Получаем данные дашборда
      console.log('📊 Получение данных дашборда...');
      const dashboardResponse = await fetch(`http://localhost:3000/api/dashboard/all?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!dashboardResponse.ok) {
        console.log(`❌ Ошибка API дашборда: ${dashboardResponse.status}`);
        continue;
      }
      
      const dashboardData = await dashboardResponse.json();
      const user = dashboardData.user;
      
      console.log('📋 Данные для карточек статуса:');
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   📊 Статус: ${user.status}`);
      console.log(`   ✅ Верифицирован: ${user.email_verified}`);
      console.log(`   📱 Телефон верифицирован: ${user.phone_verified}`);
      console.log(`   🌍 Страна: ${user.country} (${user.country})`);
      console.log(`   🏙️ Город: ${user.city}`);
      console.log(`   🟢 Активен: ${user.is_active}`);
      
      console.log('\n🎨 Как будут выглядеть карточки:');
      
      // Карточка статуса аккаунта
      const statusText = user.status === 'active' ? 'Активный' : 
                        user.status === 'pending' ? 'На проверке' :
                        user.status === 'suspended' ? 'Заблокирован' : 'Активный';
      const verificationText = user.email_verified ? '✓ Верифицированный пользователь' : '⏳ Требуется верификация';
      
      console.log(`   👤 Статус аккаунта: ${statusText}`);
      console.log(`      ${verificationText}`);
      
      // Карточка безопасности
      const securityStatus = user.email_verified ? 'Защищен' : 'Частично';
      const securityText = user.email_verified ? '✓ Аккаунт верифицирован' : '⚠️ Завершите верификацию';
      
      console.log(`   🛡️ Безопасность: ${securityStatus}`);
      console.log(`      ${securityText}`);
      
      // Карточка локации
      const countryNames = {
        'RU': 'Россия', 'US': 'США', 'GB': 'Великобритания', 'DE': 'Германия'
      };
      const countryName = countryNames[user.country] || user.country || 'Не указана';
      const locationText = user.city ? `${user.city}, ${countryName}` : 'Подключено к БД';
      
      console.log(`   🌍 Локация: ${countryName}`);
      console.log(`      ${locationText}`);
      
      console.log('   ' + '─'.repeat(50));
    }
    
    console.log('\n🎉 Тестирование завершено!');
    console.log('💡 Карточки статуса теперь показывают реальные данные из базы');
    
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
  }
}

testDashboardStatusCards();
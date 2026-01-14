const fetch = require('node-fetch');

async function debugDashboardAPI() {
  try {
    console.log('=== ОТЛАДКА DASHBOARD API ===');
    
    // Сначала логинимся
    console.log('🔐 Логинимся как x11021997x@mail.ru...');
    const loginResponse = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'x11021997x@mail.ru',
        password: 'password123'
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (!loginData.success) {
      console.log('❌ Ошибка входа:', loginData.error);
      return;
    }
    
    console.log('✅ Успешный вход!');
    console.log('👤 Пользователь:', loginData.user.fullName);
    console.log('💰 Баланс из логина:', loginData.user.balance);
    console.log('🆔 User ID:', loginData.user.id);
    
    // Теперь тестируем dashboard API
    console.log('\n📊 Тестируем dashboard API...');
    const dashboardResponse = await fetch(`http://localhost:3000/api/dashboard/all?userId=${loginData.user.id}`, {
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const dashboardData = await dashboardResponse.json();
    
    console.log('📥 Ответ dashboard API:');
    console.log('   Success:', dashboardData.success);
    console.log('   Demo Mode:', dashboardData.isDemoMode);
    
    if (dashboardData.user) {
      console.log('   👤 Пользователь из API:');
      console.log('      Email:', dashboardData.user.email);
      console.log('      Баланс:', dashboardData.user.balance);
      console.log('      Инвестировано:', dashboardData.user.total_invested);
      console.log('      Заработано:', dashboardData.user.total_earned);
    }
    
    if (dashboardData.investments) {
      console.log('   📈 Инвестиции:', dashboardData.investments.length);
    }
    
    if (dashboardData.investment_plans) {
      console.log('   📋 Планы:', dashboardData.investment_plans.length);
      dashboardData.investment_plans.forEach(plan => {
        console.log(`      💎 ${plan.name}: $${plan.min_amount}-$${plan.max_amount}`);
      });
    }
    
    // Если API возвращает демо-данные, значит есть проблема с базой данных
    if (dashboardData.isDemoMode) {
      console.log('\n⚠️  API РАБОТАЕТ В ДЕМО-РЕЖИМЕ!');
      console.log('Это означает, что API не может подключиться к базе данных.');
    } else {
      console.log('\n✅ API работает с реальной базой данных');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

// Проверяем, установлен ли node-fetch
try {
  debugDashboardAPI();
} catch (error) {
  console.log('❌ node-fetch не установлен. Устанавливаем...');
  console.log('Выполните: npm install node-fetch@2');
}
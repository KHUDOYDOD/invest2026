const fetch = require('node-fetch');

async function testAllUsersAPI() {
  try {
    console.log('🔍 Тестируем API /api/all-users...');
    
    const response = await fetch('http://localhost:3000/api/all-users');
    const data = await response.json();
    
    if (data.success && data.data) {
      console.log(`✅ API работает, получено ${data.data.length} пользователей`);
      console.log(`📊 Общее количество: ${data.total}`);
      
      console.log('\n👥 Первые 3 пользователя:');
      data.data.slice(0, 3).forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email})`);
        console.log(`   Баланс: $${user.balance}, Инвестировано: $${user.total_invested}`);
        console.log(`   Страна: ${user.country}, Рефералы: ${user.referrals_count}`);
        console.log(`   Зарегистрирован: ${new Date(user.joinedDate).toLocaleDateString()}`);
        console.log('');
      });
      
      // Статистика
      const totalBalance = data.data.reduce((sum, u) => sum + (u.balance || 0), 0);
      const totalInvested = data.data.reduce((sum, u) => sum + (u.total_invested || 0), 0);
      const totalProfit = data.data.reduce((sum, u) => sum + (u.total_profit || 0), 0);
      const totalReferrals = data.data.reduce((sum, u) => sum + (u.referrals_count || 0), 0);
      
      console.log('📊 Общая статистика:');
      console.log(`💰 Общий баланс: $${totalBalance.toLocaleString()}`);
      console.log(`💎 Общие инвестиции: $${totalInvested.toLocaleString()}`);
      console.log(`📈 Общая прибыль: $${totalProfit.toLocaleString()}`);
      console.log(`👥 Общие рефералы: ${totalReferrals}`);
      
      // Страны
      const countries = {};
      data.data.forEach(u => {
        if (u.country) {
          countries[u.country] = (countries[u.country] || 0) + 1;
        }
      });
      
      console.log('\n🌍 По странам:');
      Object.entries(countries).forEach(([country, count]) => {
        console.log(`${country}: ${count} пользователей`);
      });
      
    } else {
      console.log('❌ API вернул ошибку:', data);
    }
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании API:', error.message);
  }
}

testAllUsersAPI();
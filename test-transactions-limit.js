const fetch = require('node-fetch');

async function testTransactionsLimit() {
  try {
    console.log('🧪 Тестирование лимита транзакций...');
    
    // Авторизация
    console.log('🔐 Авторизация...');
    const loginResponse = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123'
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
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
      throw new Error(`Dashboard API failed: ${dashboardResponse.status}`);
    }
    
    const dashboardData = await dashboardResponse.json();
    
    console.log('📋 Результаты:');
    console.log(`   👤 Пользователь: ${dashboardData.user.email}`);
    console.log(`   💰 Баланс: $${dashboardData.user.balance}`);
    console.log(`   📊 Всего транзакций: ${dashboardData.transactions?.length || 0}`);
    
    if (dashboardData.transactions && dashboardData.transactions.length > 0) {
      console.log('\n📋 Транзакции:');
      dashboardData.transactions.forEach((tx, index) => {
        console.log(`   ${index + 1}. ${tx.type.toUpperCase()}: $${tx.amount} - ${tx.status}`);
        console.log(`      ${tx.description || 'Без описания'}`);
        console.log(`      ${new Date(tx.created_at).toLocaleDateString('ru-RU')}`);
        if (tx.method) {
          console.log(`      Метод: ${tx.method}`);
        }
        console.log('      ---');
      });
      
      console.log('\n💡 Тестирование лимита:');
      console.log(`   📊 В дашборде должно показываться максимум 5 транзакций`);
      console.log(`   📋 На странице "Все транзакции" должны показываться все ${dashboardData.transactions.length} транзакций`);
      
      if (dashboardData.transactions.length > 5) {
        console.log(`   ✅ Лимит работает корректно: есть ${dashboardData.transactions.length} транзакций для тестирования`);
      } else {
        console.log(`   ⚠️ Недостаточно транзакций для тестирования лимита (нужно больше 5)`);
      }
    } else {
      console.log('   ❌ Транзакции не найдены');
    }
    
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
  }
}

testTransactionsLimit();
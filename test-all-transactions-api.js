const fetch = require('node-fetch');

async function testAllTransactionsAPI() {
  try {
    console.log('🔍 Тестируем API /api/all-transactions...');
    
    const response = await fetch('http://localhost:3000/api/all-transactions');
    const data = await response.json();
    
    if (data.success && data.data) {
      console.log(`✅ API работает, получено ${data.data.length} транзакций`);
      console.log(`📊 Общее количество: ${data.total}`);
      console.log(`💰 Общая сумма из API: $${data.totalAmount?.toLocaleString()}`);
      
      // Проверяем расчет суммы на клиенте
      const clientTotal = data.data.reduce((sum, t) => {
        const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : (t.amount || 0);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
      
      console.log(`💰 Общая сумма (расчет клиента): $${clientTotal.toLocaleString()}`);
      
      console.log('\n📋 Первые 5 транзакций:');
      data.data.slice(0, 5).forEach((transaction, index) => {
        const amount = typeof transaction.amount === 'string' ? parseFloat(transaction.amount) : transaction.amount;
        console.log(`${index + 1}. ${transaction.user_name} - ${transaction.type} - $${amount} (тип: ${typeof transaction.amount})`);
      });
      
      // Проверяем типы транзакций
      const typeStats = {};
      data.data.forEach(t => {
        if (!typeStats[t.type]) {
          typeStats[t.type] = { count: 0, total: 0 };
        }
        typeStats[t.type].count++;
        typeStats[t.type].total += (typeof t.amount === 'string' ? parseFloat(t.amount) : (t.amount || 0));
      });
      
      console.log('\n📊 Статистика по типам:');
      Object.entries(typeStats).forEach(([type, stats]) => {
        console.log(`${type}: ${stats.count} транзакций, сумма: $${stats.total.toLocaleString()}`);
      });
      
    } else {
      console.log('❌ API вернул ошибку:', data);
    }
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании API:', error.message);
  }
}

testAllTransactionsAPI();
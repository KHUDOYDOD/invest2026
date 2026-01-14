const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('🔍 Тестируем API /api/user-activity...');
    
    const response = await fetch('http://localhost:3000/api/user-activity');
    const data = await response.json();
    
    if (data.success && data.data) {
      console.log(`✅ API работает, получено ${data.data.length} транзакций`);
      
      let totalAmount = 0;
      console.log('\n📋 Первые 5 транзакций:');
      
      data.data.slice(0, 5).forEach((transaction, index) => {
        const amount = typeof transaction.amount === 'string' ? parseFloat(transaction.amount) : transaction.amount;
        totalAmount += amount || 0;
        
        console.log(`${index + 1}. ${transaction.user_name} - ${transaction.type} - $${amount} (тип: ${typeof transaction.amount})`);
      });
      
      console.log(`\n💰 Общая сумма первых 5 транзакций: $${totalAmount.toLocaleString()}`);
      
      // Проверяем все транзакции
      const allTotal = data.data.reduce((sum, t) => {
        const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : (t.amount || 0);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
      
      console.log(`💰 Общая сумма всех ${data.data.length} транзакций: $${allTotal.toLocaleString()}`);
      
    } else {
      console.log('❌ API вернул ошибку:', data);
    }
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании API:', error.message);
  }
}

testAPI();
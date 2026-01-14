const fetch = require('node-fetch');

async function testInvestmentPlansAPI() {
  try {
    console.log('🧪 Тестирование API инвестиционных планов...');
    
    const response = await fetch('http://localhost:3000/api/investment-plans');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('📊 Ответ API:');
    console.log('Success:', data.success);
    console.log('Plans count:', data.plans?.length || 0);
    
    if (data.plans && data.plans.length > 0) {
      console.log('\n📋 Планы:');
      data.plans.forEach((plan, index) => {
        console.log(`  ${index + 1}. ${plan.name}:`);
        console.log(`     ID: ${plan.id}`);
        console.log(`     Сумма: $${plan.min_amount} - $${plan.max_amount}`);
        console.log(`     Доходность: ${plan.daily_percent}% в день`);
        console.log(`     Длительность: ${plan.duration} дней`);
        console.log(`     Общий доход: ${plan.total_return}%`);
        console.log(`     Активен: ${plan.is_active}`);
        console.log('     ---');
      });
      
      console.log('✅ API работает корректно!');
    } else {
      console.log('⚠️ Планы не найдены');
    }
    
  } catch (error) {
    console.error('❌ Ошибка тестирования API:', error.message);
  }
}

testInvestmentPlansAPI();
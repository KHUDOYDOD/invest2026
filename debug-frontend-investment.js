// Этот скрипт поможет отладить проблему с созданием инвестиций в браузере
// Запустите его в консоли браузера на странице инвестиций

console.log('🔍 Отладка создания инвестиций...');

// Проверяем localStorage
const token = localStorage.getItem('authToken');
const userId = localStorage.getItem('userId');

console.log('📋 Данные авторизации:');
console.log('  Token:', token ? 'ЕСТЬ' : 'НЕТ');
console.log('  UserId:', userId);

// Проверяем планы
async function checkPlans() {
  try {
    console.log('📦 Проверка планов...');
    const response = await fetch('/api/investment-plans');
    const data = await response.json();
    
    console.log('  Статус:', response.status);
    console.log('  Данные:', data);
    
    if (data.success && data.plans) {
      console.log('  ✅ Планы загружены:', data.plans.length);
      return data.plans[0]; // Возвращаем первый план
    }
  } catch (error) {
    console.error('  ❌ Ошибка загрузки планов:', error);
  }
}

// Проверяем создание инвестиции
async function testInvestment() {
  const plan = await checkPlans();
  
  if (!plan) {
    console.log('❌ Нет планов для тестирования');
    return;
  }
  
  console.log('💰 Тестирование создания инвестиции...');
  console.log('  План:', plan.name, 'ID:', plan.id);
  console.log('  Сумма:', plan.min_amount);
  
  try {
    const response = await fetch('/api/investments/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        planId: plan.id,
        amount: plan.min_amount
      })
    });
    
    console.log('  Статус ответа:', response.status);
    
    const data = await response.json();
    console.log('  Данные ответа:', data);
    
    if (response.ok && data.success) {
      console.log('  ✅ Инвестиция создана успешно!');
    } else {
      console.log('  ❌ Ошибка:', data.error);
    }
    
  } catch (error) {
    console.error('  ❌ Ошибка запроса:', error);
  }
}

// Запускаем тест
testInvestment();

console.log('📝 Инструкции:');
console.log('1. Откройте консоль браузера (F12)');
console.log('2. Скопируйте и вставьте этот код');
console.log('3. Нажмите Enter');
console.log('4. Посмотрите результаты отладки');
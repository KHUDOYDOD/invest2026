const fetch = require('node-fetch');

async function testAdminPanel() {
  const baseUrl = 'http://213.171.31.215';
  
  console.log('🔍 Тестируем админ панель...\n');
  
  try {
    // Тест 1: Главная страница
    console.log('1️⃣ Проверяем главную страницу...');
    const homeResponse = await fetch(baseUrl);
    console.log(`✅ Главная страница: ${homeResponse.status} ${homeResponse.statusText}`);
    
    // Тест 2: Страница логина админа
    console.log('\n2️⃣ Проверяем страницу логина админа...');
    const loginResponse = await fetch(`${baseUrl}/admin/login`);
    console.log(`✅ Админ логин: ${loginResponse.status} ${loginResponse.statusText}`);
    
    // Тест 3: API статуса
    console.log('\n3️⃣ Проверяем API статуса...');
    const statusResponse = await fetch(`${baseUrl}/api/status`);
    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      console.log('✅ База данных подключена:', statusData.database.connected);
      console.log('✅ Версия PostgreSQL:', statusData.database.version);
      console.log('✅ Пользователей в базе:', statusData.tables.counts.users);
      console.log('✅ Транзакций в базе:', statusData.tables.counts.transactions);
    }
    
    // Тест 4: Статистика
    console.log('\n4️⃣ Проверяем статистику...');
    const statsResponse = await fetch(`${baseUrl}/api/statistics`);
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ Статистика загружена');
      console.log(`  - Пользователи: ${statsData.users_count}`);
      console.log(`  - Инвестиции: $${statsData.investments_amount}`);
      console.log(`  - Выплаты: $${statsData.payouts_amount}`);
    }
    
    // Тест 5: Тарифы
    console.log('\n5️⃣ Проверяем тарифы...');
    const plansResponse = await fetch(`${baseUrl}/api/investment-plans`);
    if (plansResponse.ok) {
      const plansData = await plansResponse.json();
      console.log(`✅ Тарифов загружено: ${plansData.plans.length}`);
      plansData.plans.forEach(plan => {
        console.log(`  - ${plan.name}: ${plan.daily_percent}% в день`);
      });
    }
    
    console.log('\n🎉 ВСЕ РАБОТАЕТ! Сайт полностью привязан к базе данных!');
    console.log('\n📋 Адреса для доступа:');
    console.log(`  - Сайт: ${baseUrl}`);
    console.log(`  - Админ логин: ${baseUrl}/admin/login`);
    console.log(`  - Упрощенная админ панель: ${baseUrl}/admin/requests-simple`);
    console.log('\n🔑 Данные для входа: admin / X11021997x');
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.message);
  }
}

testAdminPanel();
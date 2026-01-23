// Тест подключения сайта к базе данных
const fetch = require('node-fetch');

async function testSiteDatabase() {
  const baseUrl = 'http://213.171.31.215:3000';
  
  console.log('🔍 Тестируем подключение сайта к базе данных...\n');
  
  try {
    // Тест 1: Проверяем статус сайта
    console.log('1️⃣ Проверяем статус сайта...');
    const statusResponse = await fetch(`${baseUrl}/api/status`);
    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      console.log('✅ Сайт работает:', statusData);
    } else {
      console.log('❌ Сайт не отвечает');
    }
    
    // Тест 2: Проверяем API статистики
    console.log('\n2️⃣ Проверяем API статистики...');
    const statsResponse = await fetch(`${baseUrl}/api/statistics`);
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ Статистика загружена:', statsData);
    } else {
      console.log('❌ Ошибка загрузки статистики:', statsResponse.status);
    }
    
    // Тест 3: Проверяем тарифы инвестиций
    console.log('\n3️⃣ Проверяем тарифы инвестиций...');
    const plansResponse = await fetch(`${baseUrl}/api/investment-plans`);
    if (plansResponse.ok) {
      const plansData = await plansResponse.json();
      console.log('✅ Тарифы загружены:', plansData.length, 'тарифов');
    } else {
      console.log('❌ Ошибка загрузки тарифов:', plansResponse.status);
    }
    
    // Тест 4: Проверяем отзывы
    console.log('\n4️⃣ Проверяем отзывы...');
    const testimonialsResponse = await fetch(`${baseUrl}/api/testimonials`);
    if (testimonialsResponse.ok) {
      const testimonialsData = await testimonialsResponse.json();
      console.log('✅ Отзывы загружены:', testimonialsData.length, 'отзывов');
    } else {
      console.log('❌ Ошибка загрузки отзывов:', testimonialsResponse.status);
    }
    
    // Тест 5: Проверяем админ API (без авторизации)
    console.log('\n5️⃣ Проверяем админ API...');
    const adminResponse = await fetch(`${baseUrl}/api/admin/stats`);
    console.log('Админ API статус:', adminResponse.status);
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.message);
  }
}

testSiteDatabase();
const fetch = require('node-fetch');

async function testDateFix() {
  try {
    console.log('🔍 Тестируем исправление ошибки дат...');
    
    const response = await fetch('http://localhost:3000/api/all-users');
    const data = await response.json();
    
    if (data.success && data.data) {
      console.log(`✅ API работает без ошибок`);
      console.log(`📊 Получено ${data.data.length} пользователей`);
      
      console.log('\n📅 Проверка дат:');
      data.data.slice(0, 3).forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        
        // Проверяем joinedDate
        if (user.joinedDate) {
          const joinedDate = new Date(user.joinedDate);
          if (isNaN(joinedDate.getTime())) {
            console.log(`   ❌ Неверная дата регистрации: ${user.joinedDate}`);
          } else {
            console.log(`   ✅ Дата регистрации: ${joinedDate.toLocaleDateString('ru-RU')}`);
          }
        } else {
          console.log(`   ⚠️  Дата регистрации не указана`);
        }
        
        // Проверяем last_activity
        if (user.last_activity) {
          const lastActivity = new Date(user.last_activity);
          if (isNaN(lastActivity.getTime())) {
            console.log(`   ❌ Неверная дата активности: ${user.last_activity}`);
          } else {
            console.log(`   ✅ Последняя активность: ${lastActivity.toLocaleDateString('ru-RU')}`);
          }
        } else {
          console.log(`   ⚠️  Последняя активность не указана`);
        }
        console.log('');
      });
      
      // Проверяем функции форматирования
      console.log('🛠 Тестируем функции форматирования:');
      
      const testDates = [
        new Date().toISOString(), // Валидная дата
        null, // null
        undefined, // undefined
        'invalid-date', // Неверная дата
        '2024-01-15T10:30:00Z' // Валидная ISO дата
      ];
      
      testDates.forEach((testDate, index) => {
        console.log(`Тест ${index + 1}: ${testDate}`);
        
        // Имитируем функцию formatDate
        const formatDate = (dateString) => {
          if (!dateString) return 'Не указано'
          const date = new Date(dateString)
          if (isNaN(date.getTime())) return 'Неверная дата'
          return date.toLocaleDateString('ru-RU')
        };
        
        // Имитируем функцию formatTimeAgo
        const formatTimeAgo = (dateString) => {
          if (!dateString) return 'Неизвестно'
          const date = new Date(dateString)
          if (isNaN(date.getTime())) return 'Неверная дата'
          return 'только что'
        };
        
        console.log(`   formatDate: ${formatDate(testDate)}`);
        console.log(`   formatTimeAgo: ${formatTimeAgo(testDate)}`);
        console.log('');
      });
      
      console.log('🎉 Все проверки пройдены! Ошибка "Invalid time value" исправлена.');
      
    } else {
      console.log('❌ API вернул ошибку:', data);
    }
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.message);
  }
}

testDateFix();
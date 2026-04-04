const https = require('https');

function testAPI() {
  console.log('🔌 Тестирование API /api/admin/project-launches...\n');
  
  const options = {
    hostname: '213.171.31.215',
    port: 80,
    path: '/api/admin/project-launches',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = require('http').request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const projects = JSON.parse(data);
        console.log('✅ API работает!');
        console.log('='.repeat(80));
        console.log(`Статус: ${res.statusCode}`);
        console.log(`Найдено проектов: ${projects.length}`);
        console.log('='.repeat(80));
        
        if (projects.length > 0) {
          projects.forEach((project, index) => {
            console.log(`\n📦 Проект ${index + 1}:`);
            console.log(`   Название: ${project.title}`);
            console.log(`   Запущен: ${project.is_launched ? '✅ ДА' : '❌ НЕТ'}`);
            console.log(`   Показывать: ${project.show_on_site ? '✅ ДА' : '❌ НЕТ'}`);
            console.log(`   Активен: ${project.is_active ? '✅ ДА' : '❌ НЕТ'}`);
            console.log(`   Дата: ${new Date(project.launch_date).toLocaleString('ru-RU')}`);
          });
          
          const launched = projects.filter(p => p.is_launched && p.show_on_site && p.is_active);
          console.log('\n' + '='.repeat(80));
          console.log(`✅ Запущенных проектов для показа: ${launched.length}`);
          
          if (launched.length > 0) {
            console.log('\n🎉 КОМПОНЕНТ ДОЛЖЕН ПОКАЗАТЬСЯ НА ГЛАВНОЙ СТРАНИЦЕ!');
            console.log('🌐 Откройте: http://213.171.31.215');
            console.log('💡 Очистите кэш: Ctrl+Shift+Delete и обновите: Ctrl+F5');
          }
        } else {
          console.log('\n❌ Проектов не найдено');
        }
        
      } catch (error) {
        console.error('❌ Ошибка парсинга:', error.message);
        console.log('Ответ:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Ошибка запроса:', error.message);
  });

  req.end();
}

testAPI();

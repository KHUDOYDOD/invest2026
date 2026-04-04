const http = require('http');

console.log('🔍 Проверка реального HTML страницы...\n');

const options = {
  hostname: '213.171.31.215',
  port: 80,
  path: '/',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('✅ Страница загружена\n');
    console.log('='.repeat(80));
    
    // Проверяем наличие компонента
    if (data.includes('ProjectLaunches')) {
      console.log('✅ ProjectLaunches найден в HTML');
    } else {
      console.log('❌ ProjectLaunches НЕ найден в HTML');
    }
    
    // Проверяем текст
    if (data.includes('Проект запущен')) {
      console.log('✅ Текст "Проект запущен" найден');
    } else {
      console.log('❌ Текст "Проект запущен" НЕ найден');
    }
    
    // Проверяем Hero Section
    if (data.includes('HeroSection')) {
      console.log('✅ HeroSection найден');
    } else {
      console.log('❌ HeroSection НЕ найден');
    }
    
    console.log('='.repeat(80));
    
    // Ищем где находится ProjectLaunches
    const projectLaunchesIndex = data.indexOf('ProjectLaunches');
    const heroSectionIndex = data.indexOf('HeroSection');
    
    if (projectLaunchesIndex > -1 && heroSectionIndex > -1) {
      console.log('\n📍 Позиции в HTML:');
      console.log(`   HeroSection: символ ${heroSectionIndex}`);
      console.log(`   ProjectLaunches: символ ${projectLaunchesIndex}`);
      
      if (projectLaunchesIndex > heroSectionIndex) {
        console.log('   ✅ ProjectLaunches идет ПОСЛЕ HeroSection');
      } else {
        console.log('   ⚠️ ProjectLaunches идет ДО HeroSection');
      }
    }
    
    // Показываем фрагмент вокруг ProjectLaunches
    if (projectLaunchesIndex > -1) {
      const start = Math.max(0, projectLaunchesIndex - 200);
      const end = Math.min(data.length, projectLaunchesIndex + 200);
      const fragment = data.substring(start, end);
      
      console.log('\n📄 Фрагмент HTML вокруг ProjectLaunches:');
      console.log('='.repeat(80));
      console.log(fragment);
      console.log('='.repeat(80));
    }
    
    // Проверяем есть ли ошибки в HTML
    if (data.includes('Application error')) {
      console.log('\n❌ ОШИБКА: Найден текст "Application error"');
      console.log('Сайт показывает ошибку!');
    }
    
    // Проверяем размер HTML
    console.log(`\n📊 Размер HTML: ${data.length} байт`);
    
    // Сохраняем HTML в файл для анализа
    const fs = require('fs');
    fs.writeFileSync('page-html-output.html', data);
    console.log('💾 HTML сохранен в файл: page-html-output.html');
    
    console.log('\n💡 Откройте page-html-output.html и найдите ProjectLaunches');
  });
});

req.on('error', (error) => {
  console.error('❌ Ошибка запроса:', error.message);
});

req.end();

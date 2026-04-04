const http = require('http');

console.log('🔍 Fetching page and checking component...\n');

http.get('http://213.171.31.215/', (res) => {
  let data = '';
  
  res.on('data', chunk => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📊 Page loaded, size:', data.length, 'bytes\n');
    
    // Check for component references
    const hasProjectLaunches = data.includes('ProjectLaunches');
    const hasProjectLaunchesSimple = data.includes('ProjectLaunchesSimple');
    const hasProjectText = data.includes('Проект запущен');
    const hasLoadingText = data.includes('Загрузка информации');
    const hasErrorText = data.includes('Ошибка загрузки');
    const hasNoProjectsText = data.includes('Нет запущенных проектов');
    
    console.log('Component checks:');
    console.log('  ProjectLaunches:', hasProjectLaunches ? '✅' : '❌');
    console.log('  ProjectLaunchesSimple:', hasProjectLaunchesSimple ? '✅' : '❌');
    console.log('  "Проект запущен":', hasProjectText ? '✅' : '❌');
    console.log('  "Загрузка информации":', hasLoadingText ? '✅' : '❌');
    console.log('  "Ошибка загрузки":', hasErrorText ? '✅' : '❌');
    console.log('  "Нет запущенных проектов":', hasNoProjectsText ? '✅' : '❌');
    
    console.log('\n📝 Analysis:');
    if (hasProjectLaunchesSimple && !hasProjectText && !hasLoadingText && !hasErrorText && !hasNoProjectsText) {
      console.log('⚠️  Component is in HTML but NOT rendering any content');
      console.log('   This means the component returns null or has a client-side error');
      console.log('   Check browser console for JavaScript errors');
    } else if (hasProjectText) {
      console.log('✅ Component is rendering successfully!');
    } else if (hasLoadingText) {
      console.log('⏳ Component is in loading state');
    } else if (hasErrorText) {
      console.log('❌ Component has an error');
    } else if (hasNoProjectsText) {
      console.log('⚠️  Component loaded but no projects to display');
    }
    
    // Extract component section
    const componentIndex = data.indexOf('ProjectLaunchesSimple');
    if (componentIndex > -1) {
      const snippet = data.substring(componentIndex - 100, componentIndex + 200);
      console.log('\n📄 Component context in HTML:');
      console.log(snippet);
    }
  });
}).on('error', (e) => {
  console.error('❌ Error fetching page:', e.message);
});

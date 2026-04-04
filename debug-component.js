const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
});

async function debugComponent() {
  try {
    console.log('🔍 Диагностика компонента запусков...\n');
    
    // 1. Проверяем данные в БД
    console.log('1️⃣ Проверка базы данных:');
    console.log('='.repeat(80));
    const dbResult = await pool.query(`
      SELECT 
        id, 
        name, 
        title, 
        is_launched, 
        show_on_site, 
        is_active,
        launch_date
      FROM project_launches
      WHERE is_launched = true 
        AND show_on_site = true 
        AND is_active = true
    `);
    
    if (dbResult.rows.length === 0) {
      console.log('❌ НЕТ ПРОЕКТОВ для показа');
      console.log('Проверяем все проекты...\n');
      
      const allProjects = await pool.query('SELECT * FROM project_launches');
      console.log(`Всего проектов в БД: ${allProjects.rows.length}`);
      
      if (allProjects.rows.length > 0) {
        allProjects.rows.forEach(p => {
          console.log(`\nПроект: ${p.title}`);
          console.log(`  is_launched: ${p.is_launched}`);
          console.log(`  show_on_site: ${p.show_on_site}`);
          console.log(`  is_active: ${p.is_active}`);
        });
      }
    } else {
      console.log(`✅ Найдено проектов: ${dbResult.rows.length}`);
      dbResult.rows.forEach(p => {
        console.log(`\n  Проект: ${p.title}`);
        console.log(`  ID: ${p.id}`);
        console.log(`  Дата: ${p.launch_date}`);
      });
    }
    
    // 2. Проверяем что компонент загружается
    console.log('\n2️⃣ Проверка файлов компонента:');
    console.log('='.repeat(80));
    
    const fs = require('fs');
    const path = require('path');
    
    // Проверяем локально
    const componentPath = './components/project-launches.tsx';
    const pagePath = './app/page.tsx';
    
    if (fs.existsSync(componentPath)) {
      const componentContent = fs.readFileSync(componentPath, 'utf8');
      console.log('✅ Компонент существует локально');
      console.log(`   Размер: ${componentContent.length} байт`);
      
      // Проверяем ключевые части
      if (componentContent.includes('is_launched === true')) {
        console.log('✅ Фильтр is_launched === true найден');
      } else {
        console.log('❌ Фильтр is_launched === true НЕ найден');
      }
      
      if (componentContent.includes('Проект запущен')) {
        console.log('✅ Текст "Проект запущен" найден');
      } else {
        console.log('❌ Текст "Проект запущен" НЕ найден');
      }
    } else {
      console.log('❌ Компонент НЕ существует локально');
    }
    
    if (fs.existsSync(pagePath)) {
      const pageContent = fs.readFileSync(pagePath, 'utf8');
      console.log('✅ Главная страница существует');
      
      if (pageContent.includes('<ProjectLaunches />')) {
        console.log('✅ <ProjectLaunches /> найден в page.tsx');
        
        // Проверяем позицию
        const heroIndex = pageContent.indexOf('<HeroSection />');
        const launchesIndex = pageContent.indexOf('<ProjectLaunches />');
        
        if (heroIndex > -1 && launchesIndex > -1) {
          if (launchesIndex > heroIndex) {
            console.log('✅ ProjectLaunches идет ПОСЛЕ HeroSection');
          } else {
            console.log('⚠️ ProjectLaunches идет ДО HeroSection');
          }
        }
      } else {
        console.log('❌ <ProjectLaunches /> НЕ найден в page.tsx');
      }
    }
    
    // 3. Проверяем на сервере
    console.log('\n3️⃣ Проверка на сервере:');
    console.log('='.repeat(80));
    console.log('Нужно проверить вручную:');
    console.log('1. Откройте http://213.171.31.215');
    console.log('2. Нажмите F12 (открыть консоль)');
    console.log('3. Перейдите на вкладку Console');
    console.log('4. Обновите страницу (Ctrl+F5)');
    console.log('5. Проверьте есть ли ошибки');
    
    console.log('\n4️⃣ Проверка API:');
    console.log('='.repeat(80));
    console.log('Откройте в браузере:');
    console.log('http://213.171.31.215/api/admin/project-launches');
    console.log('Должен вернуть JSON с проектами');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

debugComponent();

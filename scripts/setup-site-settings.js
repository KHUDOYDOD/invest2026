const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Читаем .env.local файл вручную
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');

let DATABASE_URL = '';
envLines.forEach(line => {
  if (line.startsWith('DATABASE_URL=')) {
    DATABASE_URL = line.split('=')[1].trim().replace(/['"]/g, '');
  }
});

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL не найден в .env.local');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
});

async function setupSiteSettings() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Настройка таблицы site_settings...\n');

    // Читаем SQL файл
    const sqlPath = path.join(__dirname, 'create-site-settings-table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Выполняем SQL
    await client.query(sql);

    console.log('✅ Таблица site_settings создана успешно!');

    // Проверяем созданные настройки
    const result = await client.query(
      'SELECT setting_key, setting_value, category FROM site_settings ORDER BY category, setting_key'
    );

    console.log('\n📋 Текущие настройки:');
    console.log('─'.repeat(80));
    
    let currentCategory = '';
    result.rows.forEach(row => {
      if (row.category !== currentCategory) {
        currentCategory = row.category;
        console.log(`\n📁 ${currentCategory.toUpperCase()}:`);
      }
      console.log(`  ${row.setting_key}: ${row.setting_value}`);
    });

    console.log('\n' + '─'.repeat(80));
    console.log(`\n✨ Всего настроек: ${result.rows.length}`);
    console.log('\n🎉 Настройка завершена! Теперь админ-панель полностью привязана к БД.');

  } catch (error) {
    console.error('❌ Ошибка при настройке:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Запускаем настройку
setupSiteSettings().catch(err => {
  console.error('Критическая ошибка:', err);
  process.exit(1);
});

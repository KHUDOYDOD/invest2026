const { Pool } = require('pg');
const fs = require('fs');

// Читаем DATABASE_URL из .env.local
function getDatabaseUrl() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const match = envContent.match(/DATABASE_URL=(.+)/);
    return match ? match[1].trim() : null;
  } catch (error) {
    console.error('❌ Не удалось прочитать .env.local');
    return null;
  }
}

async function addCityField() {
  const databaseUrl = getDatabaseUrl();
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL не найден в .env.local');
    process.exit(1);
  }
  
  const pool = new Pool({
    connectionString: databaseUrl,
  });

  try {
    console.log('🔄 Подключение к базе данных...');
    
    // Добавляем поле city
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS city VARCHAR(100)
    `);
    
    console.log('✅ Поле city успешно добавлено!');
    
    // Проверяем результат
    const result = await pool.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'users' 
      AND column_name IN ('phone', 'country', 'city')
      ORDER BY column_name
    `);
    
    console.log('\n📊 Поля в таблице users:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}${row.character_maximum_length ? `(${row.character_maximum_length})` : ''}`);
    });
    
    console.log('\n✅ Готово! Теперь вы можете редактировать город в профиле.');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

addCityField();

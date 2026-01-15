const { Pool } = require('pg');

async function addCityField() {
  const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require',
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
    
    console.log('\n✅ Готово! Теперь сайт должен работать без ошибок.');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

addCityField();

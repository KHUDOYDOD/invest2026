const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function addBankNameField() {
  try {
    console.log('🔄 Добавляем поле bank_name в таблицу withdrawal_requests...');
    
    // Добавляем поле bank_name
    await pool.query(`
      ALTER TABLE withdrawal_requests 
      ADD COLUMN IF NOT EXISTS bank_name VARCHAR(100)
    `);
    
    console.log('✅ Поле bank_name успешно добавлено');
    
    // Проверяем структуру таблицы
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'withdrawal_requests' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Структура таблицы withdrawal_requests:');
    result.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка при добавлении поля:', error);
  } finally {
    await pool.end();
  }
}

addBankNameField();
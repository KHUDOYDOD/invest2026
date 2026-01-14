const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function checkInvestmentsTable() {
  try {
    console.log('=== ПРОВЕРКА ТАБЛИЦЫ INVESTMENTS ===');
    
    // Проверяем структуру таблицы
    const structure = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'investments' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Структура таблицы investments:');
    structure.rows.forEach(col => {
      console.log(`   📝 ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'}) ${col.column_default ? `default: ${col.column_default}` : ''}`);
    });
    
    // Проверяем ограничения
    const constraints = await pool.query(`
      SELECT 
        conname as constraint_name,
        pg_get_constraintdef(oid) as constraint_definition
      FROM pg_constraint 
      WHERE conrelid = 'investments'::regclass
    `);
    
    console.log('\n🔒 Ограничения таблицы:');
    constraints.rows.forEach(constraint => {
      console.log(`   🔒 ${constraint.constraint_name}: ${constraint.constraint_definition}`);
    });
    
    // Проверяем существующие данные
    const data = await pool.query('SELECT * FROM investments LIMIT 3');
    console.log(`\n📊 Существующие инвестиции (${data.rows.length}):`);
    data.rows.forEach(inv => {
      console.log(`   💼 ID: ${inv.id}, Сумма: $${inv.amount}, Статус: ${inv.status}`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

checkInvestmentsTable();
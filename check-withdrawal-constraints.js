const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function checkWithdrawalConstraints() {
  try {
    console.log('=== ПРОВЕРКА ОГРАНИЧЕНИЙ ТАБЛИЦЫ WITHDRAWAL_REQUESTS ===');
    
    // Проверяем ограничения таблицы
    const constraints = await pool.query(`
      SELECT 
        conname as constraint_name,
        pg_get_constraintdef(oid) as constraint_definition
      FROM pg_constraint 
      WHERE conrelid = 'withdrawal_requests'::regclass
    `);
    
    console.log('📋 Ограничения таблицы withdrawal_requests:');
    constraints.rows.forEach(constraint => {
      console.log(`   🔒 ${constraint.constraint_name}:`);
      console.log(`      ${constraint.constraint_definition}`);
    });
    
    // Проверяем структуру таблицы
    console.log('\n📊 Структура таблицы:');
    const structure = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'withdrawal_requests' 
      ORDER BY ordinal_position
    `);
    
    structure.rows.forEach(col => {
      console.log(`   📝 ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'}) ${col.column_default ? `default: ${col.column_default}` : ''}`);
    });
    
    // Проверяем текущие статусы в таблице
    console.log('\n📈 Текущие статусы в таблице:');
    const statuses = await pool.query(`
      SELECT DISTINCT status, COUNT(*) as count
      FROM withdrawal_requests 
      GROUP BY status
      ORDER BY status
    `);
    
    statuses.rows.forEach(status => {
      console.log(`   📊 "${status.status}": ${status.count} записей`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

checkWithdrawalConstraints();
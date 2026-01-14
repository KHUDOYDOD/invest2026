const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function checkDepositTable() {
  const client = await pool.connect();
  try {
    console.log('🔍 Проверка таблицы deposit_requests...\n');
    
    // Проверяем существование таблицы
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'deposit_requests'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('❌ Таблица deposit_requests не существует!');
      console.log('\n💡 Создаем таблицу...\n');
      
      await client.query(`
        CREATE TABLE IF NOT EXISTS deposit_requests (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          amount DECIMAL(15,2) NOT NULL,
          method VARCHAR(100) NOT NULL,
          payment_details JSONB,
          status VARCHAR(20) DEFAULT 'pending',
          admin_comment TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          processed_at TIMESTAMP,
          processed_by UUID,
          FOREIGN KEY (user_id) REFERENCES users(id)
        );
      `);
      
      console.log('✅ Таблица deposit_requests создана!');
    } else {
      console.log('✅ Таблица deposit_requests существует');
    }
    
    // Проверяем структуру
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'deposit_requests'
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 Структура таблицы:');
    columns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    // Проверяем количество записей
    const count = await client.query('SELECT COUNT(*) FROM deposit_requests');
    console.log(`\n📊 Всего заявок: ${count.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkDepositTable();

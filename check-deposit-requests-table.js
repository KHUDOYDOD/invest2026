const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/investpro',
});

async function checkDepositRequestsTable() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Проверяем таблицу deposit_requests...');
    
    // Проверяем существует ли таблица
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'deposit_requests'
      );
    `);
    
    if (!tableExists.rows[0].exists) {
      console.log('❌ Таблица deposit_requests не существует!');
      console.log('🔧 Создаем таблицу...');
      
      await client.query(`
        CREATE TABLE deposit_requests (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id),
          amount DECIMAL(10,2) NOT NULL,
          method VARCHAR(50) NOT NULL,
          payment_details JSONB,
          status VARCHAR(20) DEFAULT 'pending',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      
      console.log('✅ Таблица deposit_requests создана!');
    } else {
      console.log('✅ Таблица deposit_requests существует');
      
      // Проверяем структуру
      const columns = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'deposit_requests'
        ORDER BY ordinal_position;
      `);
      
      console.log('📋 Структура таблицы:');
      columns.rows.forEach(col => {
        console.log(`- ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
    }
    
    // Проверяем есть ли записи
    const count = await client.query('SELECT COUNT(*) FROM deposit_requests');
    console.log(`📊 Количество заявок: ${count.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkDepositRequestsTable().catch(console.error);
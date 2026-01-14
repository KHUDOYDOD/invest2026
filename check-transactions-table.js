const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'investpro',
  user: 'postgres',
  password: 'postgres123'
});

async function checkTable() {
  try {
    await client.connect();
    console.log('Подключение к базе данных успешно');

    // Проверяем структуру таблицы transactions
    const columnsResult = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'transactions' 
      ORDER BY ordinal_position
    `);

    console.log('\n📋 Столбцы таблицы transactions:');
    columnsResult.rows.forEach(row => {
      console.log(`${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });

    // Проверяем есть ли столбец plan_id
    const planIdExists = columnsResult.rows.some(row => row.column_name === 'plan_id');
    console.log(`\n🔍 Столбец plan_id существует: ${planIdExists}`);

    // Проверяем количество транзакций
    const countResult = await client.query('SELECT COUNT(*) FROM transactions');
    console.log(`📊 Всего транзакций: ${countResult.rows[0].count}`);

    // Проверяем первые несколько транзакций
    const sampleResult = await client.query(`
      SELECT id, user_id, type, amount, status, created_at 
      FROM transactions 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    console.log('\n📋 Первые 5 транзакций:');
    sampleResult.rows.forEach((row, index) => {
      console.log(`${index + 1}. ID: ${row.id}, User: ${row.user_id}, Type: ${row.type}, Amount: ${row.amount}, Status: ${row.status}`);
    });

  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    await client.end();
  }
}

checkTable();
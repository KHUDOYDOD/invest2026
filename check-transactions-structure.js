const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function checkTransactionsStructure() {
  try {
    await client.connect();
    console.log('🔗 Подключение к базе данных...');

    // Проверяем структуру таблицы transactions
    const structureResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'transactions' 
      ORDER BY ordinal_position
    `);

    console.log('📋 Структура таблицы transactions:');
    structureResult.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });

    // Проверяем данные в таблице
    const dataResult = await client.query(`
      SELECT id, user_id, type, amount, status, description, created_at
      FROM transactions 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    console.log('\n📊 Последние 5 транзакций:');
    dataResult.rows.forEach((tx, index) => {
      console.log(`  ${index + 1}. ${tx.type.toUpperCase()}: $${tx.amount} - ${tx.status}`);
      console.log(`     ${tx.description || 'Без описания'}`);
      console.log(`     ${new Date(tx.created_at).toLocaleDateString('ru-RU')}`);
      console.log('     ---');
    });

    console.log(`\n📈 Всего транзакций: ${dataResult.rowCount}`);

  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await client.end();
  }
}

checkTransactionsStructure();
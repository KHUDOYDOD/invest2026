const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'investpro',
  user: 'postgres',
  password: 'postgres123'
});

async function addTestTransactions() {
  try {
    await client.connect();
    console.log('Подключение к базе данных успешно');

    // Получаем ID пользователей
    const usersResult = await client.query('SELECT id, full_name FROM users LIMIT 5');
    const users = usersResult.rows;

    if (users.length === 0) {
      console.log('Нет пользователей в базе данных');
      return;
    }

    console.log(`Найдено пользователей: ${users.length}`);

    // Добавляем тестовые транзакции с разными суммами
    const testTransactions = [
      { user_id: users[0]?.id, type: 'deposit', amount: 1500.50, status: 'completed' },
      { user_id: users[1]?.id, type: 'investment', amount: 2000.00, status: 'completed' },
      { user_id: users[2]?.id, type: 'withdrawal', amount: 750.25, status: 'completed' },
      { user_id: users[0]?.id, type: 'profit', amount: 125.75, status: 'completed' },
      { user_id: users[1]?.id, type: 'deposit', amount: 3000.00, status: 'completed' },
      { user_id: users[2]?.id, type: 'investment', amount: 5000.00, status: 'completed' },
      { user_id: users[0]?.id, type: 'profit', amount: 89.50, status: 'completed' },
      { user_id: users[1]?.id, type: 'withdrawal', amount: 1200.00, status: 'completed' }
    ];

    for (const transaction of testTransactions) {
      if (transaction.user_id) {
        await client.query(`
          INSERT INTO transactions (user_id, type, amount, status, created_at)
          VALUES ($1, $2, $3, $4, NOW())
        `, [transaction.user_id, transaction.type, transaction.amount, transaction.status]);
        
        console.log(`✅ Добавлена транзакция: ${transaction.type} - $${transaction.amount}`);
      }
    }

    // Показываем статистику
    const statsResult = await client.query(`
      SELECT 
        type,
        COUNT(*) as count,
        SUM(CAST(amount AS DECIMAL(10,2))) as total_amount
      FROM transactions 
      GROUP BY type
      ORDER BY total_amount DESC
    `);

    console.log('\n📊 Статистика транзакций:');
    statsResult.rows.forEach(row => {
      console.log(`${row.type}: ${row.count} транзакций, общая сумма: $${parseFloat(row.total_amount).toLocaleString()}`);
    });

    // Общая сумма всех транзакций
    const totalResult = await client.query(`
      SELECT SUM(CAST(amount AS DECIMAL(10,2))) as total
      FROM transactions
    `);

    console.log(`\n💰 Общая сумма всех транзакций: $${parseFloat(totalResult.rows[0].total).toLocaleString()}`);

  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    await client.end();
  }
}

addTestTransactions();
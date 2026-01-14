const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function addTestTransactions() {
  try {
    await client.connect();
    console.log('🔗 Подключение к базе данных...');

    // Получаем ID пользователя test@example.com
    const userResult = await client.query('SELECT id FROM users WHERE email = $1', ['test@example.com']);
    
    if (userResult.rows.length === 0) {
      console.log('❌ Пользователь test@example.com не найден');
      return;
    }
    
    const userId = userResult.rows[0].id;
    console.log('👤 Пользователь найден:', userId);

    // Создаем тестовые транзакции
    const transactions = [
      {
        type: 'deposit',
        amount: 1000,
        status: 'completed',
        description: 'Пополнение баланса через банковскую карту',
        payment_method: 'card'
      },
      {
        type: 'investment',
        amount: 500,
        status: 'completed',
        description: 'Инвестиция в план "Базовый"',
        payment_method: 'balance'
      },
      {
        type: 'deposit',
        amount: 2000,
        status: 'pending',
        description: 'Пополнение баланса через банковский перевод',
        payment_method: 'bank_transfer'
      },
      {
        type: 'withdrawal',
        amount: 150,
        status: 'approved',
        description: 'Вывод прибыли на карту',
        payment_method: 'card'
      },
      {
        type: 'investment',
        amount: 300,
        status: 'completed',
        description: 'Инвестиция в план "Стандарт"',
        payment_method: 'balance'
      },
      {
        type: 'deposit',
        amount: 750,
        status: 'completed',
        description: 'Пополнение баланса через криптовалюту',
        payment_method: 'crypto'
      },
      {
        type: 'withdrawal',
        amount: 200,
        status: 'pending',
        description: 'Запрос на вывод средств',
        payment_method: 'bank_transfer'
      },
      {
        type: 'profit',
        amount: 25,
        status: 'completed',
        description: 'Ежедневная прибыль от инвестиций',
        payment_method: 'balance'
      }
    ];

    console.log('📝 Создание тестовых транзакций...');

    for (let i = 0; i < transactions.length; i++) {
      const tx = transactions[i];
      
      // Создаем транзакцию с разными датами (последние 7 дней)
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - i);
      
      await client.query(`
        INSERT INTO transactions (id, user_id, type, amount, status, description, method, created_at)
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7)
      `, [
        userId,
        tx.type,
        tx.amount,
        tx.status,
        tx.description,
        tx.payment_method,
        createdAt
      ]);

      console.log(`✅ Создана транзакция: ${tx.type} $${tx.amount} (${tx.status})`);
    }

    // Проверяем результат
    const result = await client.query(`
      SELECT type, amount, status, description, created_at 
      FROM transactions 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `, [userId]);

    console.log(`\n📊 Всего транзакций для пользователя: ${result.rows.length}`);
    console.log('\n📋 Последние 5 транзакций:');
    result.rows.slice(0, 5).forEach((tx, index) => {
      console.log(`  ${index + 1}. ${tx.type.toUpperCase()}: $${tx.amount} - ${tx.status}`);
      console.log(`     ${tx.description}`);
      console.log(`     ${new Date(tx.created_at).toLocaleDateString('ru-RU')}`);
      console.log('     ---');
    });

    console.log('\n🎉 Тестовые транзакции созданы успешно!');
    console.log('💡 Теперь в дашборде будет показано 5 транзакций, а остальные на странице "Все транзакции"');

  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await client.end();
  }
}

addTestTransactions();
require('dotenv').config({ path: '.env.production' });
const { Pool } = require('pg');

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fixInvestmentTransactions() {
  try {
    console.log('🔧 Исправляем связи investment_id в транзакциях...\n');
    
    // Находим все инвестиционные транзакции без investment_id
    const investmentTransactions = await pool.query(`
      SELECT 
        t.id as transaction_id,
        t.user_id,
        t.amount,
        t.created_at as transaction_time,
        i.id as investment_id,
        i.created_at as investment_time,
        u.full_name
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN investments i ON (
        i.user_id = t.user_id 
        AND i.amount = t.amount 
        AND ABS(EXTRACT(EPOCH FROM (i.created_at - t.created_at))) < 60
      )
      WHERE t.type = 'investment' 
      AND t.investment_id IS NULL
      ORDER BY t.created_at DESC
    `);

    console.log(`📊 Найдено ${investmentTransactions.rows.length} инвестиционных транзакций без investment_id:`);
    
    let fixedCount = 0;
    
    for (const tx of investmentTransactions.rows) {
      if (tx.investment_id) {
        console.log(`✅ ${tx.full_name}: $${tx.amount} -> связываем с investment ${tx.investment_id}`);
        
        await pool.query(
          'UPDATE transactions SET investment_id = $1 WHERE id = $2',
          [tx.investment_id, tx.transaction_id]
        );
        
        fixedCount++;
      } else {
        console.log(`❌ ${tx.full_name}: $${tx.amount} -> не найдена соответствующая инвестиция`);
      }
    }

    console.log(`\n🎉 Исправлено ${fixedCount} транзакций`);

    // Проверяем результат
    console.log('\n🔍 Проверяем результат:');
    const checkResult = await pool.query(`
      SELECT 
        t.id,
        t.user_id,
        t.type,
        t.amount,
        t.investment_id,
        u.full_name,
        p.name as plan_name
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN investments i ON i.id = t.investment_id
      LEFT JOIN investment_plans p ON p.id = i.plan_id
      WHERE t.type = 'investment'
      ORDER BY t.created_at DESC
      LIMIT 5
    `);

    checkResult.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.full_name} - $${row.amount}`);
      console.log(`   Investment ID: ${row.investment_id || 'NULL'}`);
      console.log(`   План: ${row.plan_name || 'Не найден'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

fixInvestmentTransactions();
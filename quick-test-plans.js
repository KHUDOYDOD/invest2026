const { Pool } = require('pg');
const fs = require('fs');

function getDatabaseUrl() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const match = envContent.match(/DATABASE_URL=(.+)/);
    return match ? match[1].trim() : null;
  } catch (error) {
    return null;
  }
}

async function quickTest() {
  const databaseUrl = getDatabaseUrl();
  const pool = new Pool({ connectionString: databaseUrl });

  try {
    console.log('🔍 Быстрая проверка тарифов...\n');
    
    const plans = await pool.query(`
      SELECT 
        id, name, description, min_amount, max_amount, 
        daily_profit, duration_days, is_active
      FROM investment_plans
      ORDER BY min_amount ASC
    `);
    
    console.log(`✅ Найдено тарифов: ${plans.rows.length}\n`);
    
    plans.rows.forEach((plan, index) => {
      console.log(`${index + 1}. ${plan.name} ${plan.is_active ? '✅' : '❌'}`);
      console.log(`   ${plan.description}`);
      console.log(`   $${plan.min_amount} - $${plan.max_amount} | ${plan.daily_profit}% в день | ${plan.duration_days} дней`);
      console.log('');
    });
    
    console.log('─'.repeat(80));
    console.log('📝 Что дальше:');
    console.log('1. Запустите сервер: npm run dev');
    console.log('2. Откройте админ-панель: http://localhost:3000/admin/dashboard');
    console.log('3. Перейдите в раздел "Investments" (Управление тарифами)');
    console.log('4. Вы должны увидеть все эти тарифы и сможете их редактировать');
    console.log('─'.repeat(80));
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

quickTest();

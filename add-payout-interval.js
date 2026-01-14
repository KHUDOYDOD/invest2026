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

async function addPayoutInterval() {
  const databaseUrl = getDatabaseUrl();
  const pool = new Pool({ connectionString: databaseUrl });

  try {
    console.log('🔧 Добавление поля payout_interval_hours...\n');
    
    // Проверяем, есть ли уже это поле
    const check = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'investment_plans' 
      AND column_name = 'payout_interval_hours'
    `);
    
    if (check.rows.length === 0) {
      await pool.query(`
        ALTER TABLE investment_plans 
        ADD COLUMN payout_interval_hours INTEGER DEFAULT 24
      `);
      console.log('✅ Поле payout_interval_hours добавлено');
    } else {
      console.log('✅ Поле payout_interval_hours уже существует');
    }
    
    // Обновляем существующие записи
    await pool.query(`
      UPDATE investment_plans 
      SET payout_interval_hours = 24 
      WHERE payout_interval_hours IS NULL
    `);
    
    console.log('✅ Данные обновлены');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

addPayoutInterval();

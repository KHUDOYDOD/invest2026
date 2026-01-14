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

async function checkReferralCode() {
  const databaseUrl = getDatabaseUrl();
  const pool = new Pool({ connectionString: databaseUrl });

  try {
    // Проверяем, есть ли поле referral_code
    console.log('📊 Проверка поля referral_code...\n');
    
    const columnCheck = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'users' 
      AND column_name = 'referral_code'
    `);
    
    if (columnCheck.rows.length === 0) {
      console.log('❌ Поле referral_code не найдено в таблице users');
      console.log('🔧 Добавляем поле...');
      
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS referral_code VARCHAR(50) UNIQUE
      `);
      
      console.log('✅ Поле referral_code добавлено');
    } else {
      console.log('✅ Поле referral_code существует');
    }
    
    // Проверяем пользователей без реферального кода
    const usersWithoutCode = await pool.query(`
      SELECT id, email, referral_code
      FROM users
      WHERE referral_code IS NULL
      LIMIT 5
    `);
    
    if (usersWithoutCode.rows.length > 0) {
      console.log(`\n⚠️  Найдено ${usersWithoutCode.rows.length} пользователей без реферального кода`);
      console.log('🔧 Генерируем коды...\n');
      
      for (const user of usersWithoutCode.rows) {
        // Генерируем уникальный код
        const code = 'REF' + Math.random().toString(36).substring(2, 10).toUpperCase();
        
        await pool.query(`
          UPDATE users 
          SET referral_code = $1 
          WHERE id = $2
        `, [code, user.id]);
        
        console.log(`  ✓ ${user.email}: ${code}`);
      }
      
      console.log('\n✅ Реферальные коды сгенерированы');
    } else {
      console.log('\n✅ У всех пользователей есть реферальные коды');
    }
    
    // Показываем примеры
    const examples = await pool.query(`
      SELECT id, email, referral_code
      FROM users
      LIMIT 3
    `);
    
    console.log('\n📋 Примеры пользователей:');
    examples.rows.forEach(user => {
      console.log(`  ${user.email}: ${user.referral_code || 'НЕТ КОДА'}`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

checkReferralCode();

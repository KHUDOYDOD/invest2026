const { Pool } = require('pg');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const env = fs.readFileSync('.env.local', 'utf8');
const dbUrl = env.match(/DATABASE_URL=(.+)/)[1].trim();
const pool = new Pool({ connectionString: dbUrl });

async function checkPasswords() {
  try {
    const users = await pool.query('SELECT id, email, full_name, password_hash FROM users');
    
    console.log('\n🔐 Проверка паролей пользователей:\n');
    
    for (const user of users.rows) {
      console.log(`👤 ${user.full_name} (${user.email})`);
      console.log(`   ID: ${user.id}`);
      
      if (user.password_hash) {
        console.log(`   ✅ Пароль установлен (хеш существует)`);
        
        // Проверяем, работает ли хеш
        const testPassword = 'test123';
        const isValid = await bcrypt.compare(testPassword, user.password_hash);
        console.log(`   Тест пароля "test123": ${isValid ? '✅ подходит' : '❌ не подходит'}`);
      } else {
        console.log(`   ❌ Пароль НЕ установлен!`);
      }
      console.log('');
    }
    
    console.log('💡 Если пароль не установлен, нужно создать новый хеш');
    
  } catch (error) {
    console.error('Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

checkPasswords();

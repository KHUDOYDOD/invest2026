const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const fs = require('fs');

function getDatabaseUrl() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    // Пробуем найти DATABASE_URL или POSTGRES_URL
    let match = envContent.match(/DATABASE_URL=(.+)/);
    if (!match) {
      match = envContent.match(/POSTGRES_URL="?([^"\n]+)"?/);
    }
    return match ? match[1].trim().replace(/"/g, '') : null;
  } catch (error) {
    console.error('Не удалось прочитать .env.local');
    return null;
  }
}

async function createAdmin() {
  const databaseUrl = getDatabaseUrl();
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL не найден в .env.local');
    return;
  }

  const pool = new Pool({ 
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    console.log('✅ Подключаемся к базе данных...');

    // Данные админа
    const username = 'Admin';
    const email = 'X45395x@gmail.com';
    const password = 'X11021997x';
    const fullName = 'Administrator';

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Пароль захеширован');

    // Проверяем существует ли пользователь
    const checkUser = await pool.query(
      'SELECT id, username, email, role, is_admin FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (checkUser.rows.length > 0) {
      const existingUser = checkUser.rows[0];
      console.log('\n⚠️  Пользователь уже существует:');
      console.log('ID:', existingUser.id);
      console.log('Username:', existingUser.username);
      console.log('Email:', existingUser.email);
      console.log('Role:', existingUser.role);
      console.log('Is Admin:', existingUser.is_admin);

      // Обновляем существующего пользователя
      console.log('\n🔄 Обновляем данные пользователя...');
      
      await pool.query(
        `UPDATE users 
         SET username = $1, 
             email = $2, 
             password = $3, 
             full_name = $4,
             role = 'admin',
             is_admin = true
         WHERE id = $5`,
        [username, email, hashedPassword, fullName, existingUser.id]
      );

      console.log('✅ Пользователь обновлён!');
      
    } else {
      // Создаём нового пользователя
      console.log('\n➕ Создаём нового админа...');
      
      const result = await pool.query(
        `INSERT INTO users (
          username, 
          email, 
          password, 
          full_name, 
          role, 
          is_admin,
          balance,
          total_earned,
          total_invested,
          active_investments
        ) VALUES ($1, $2, $3, $4, 'admin', true, 0, 0, 0, 0)
        RETURNING id, username, email, role, is_admin`,
        [username, email, hashedPassword, fullName]
      );

      console.log('✅ Админ создан!');
      console.log('\nДанные нового админа:');
      console.log('ID:', result.rows[0].id);
      console.log('Username:', result.rows[0].username);
      console.log('Email:', result.rows[0].email);
      console.log('Role:', result.rows[0].role);
      console.log('Is Admin:', result.rows[0].is_admin);
    }

    // Проверяем финальный результат
    const finalCheck = await pool.query(
      'SELECT id, username, email, role, is_admin FROM users WHERE username = $1',
      [username]
    );

    console.log('\n========================================');
    console.log('✅ АДМИН ГОТОВ!');
    console.log('========================================');
    console.log('\nДанные для входа:');
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('\nСтатус:');
    console.log('Role:', finalCheck.rows[0].role);
    console.log('Is Admin:', finalCheck.rows[0].is_admin);
    console.log('\nАдмин панель:');
    console.log('http://130.49.213.197/admin');
    console.log('http://localhost:3000/admin');
    console.log('========================================');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

createAdmin();

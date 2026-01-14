const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/investpro',
});

async function setRealPasswords() {
  const client = await pool.connect();
  
  try {
    console.log('🔐 Устанавливаем реальные пароли для тестовых пользователей...');
    
    // Пользователи с их новыми паролями
    const users = [
      {
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Администратор Системы'
      },
      {
        email: 'test@example.com', 
        password: 'test123',
        name: 'Тестовый Пользователь'
      },
      {
        email: 'alexander.petrov@example.com',
        password: 'alex123',
        name: 'Александр Петров'
      },
      {
        email: 'maria.ivanova@example.com',
        password: 'maria123', 
        name: 'Мария Иванова'
      },
      {
        email: 'dmitry.smirnov@example.com',
        password: 'dmitry123',
        name: 'Дмитрий Смирнов'
      }
    ];
    
    for (const user of users) {
      try {
        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(user.password, 10);
        
        // Обновляем пароль в базе данных
        const result = await client.query(
          'UPDATE users SET password_hash = $1 WHERE email = $2',
          [hashedPassword, user.email]
        );
        
        if (result.rowCount > 0) {
          console.log(`✅ ${user.name} (${user.email}) - пароль: ${user.password}`);
        } else {
          console.log(`⚠️  Пользователь ${user.email} не найден`);
        }
      } catch (err) {
        console.log(`❌ Ошибка для ${user.email}:`, err.message);
      }
    }
    
    console.log('\n🎉 Готово! Теперь можете войти с этими данными:');
    console.log('');
    users.forEach(user => {
      console.log(`📧 Email: ${user.email}`);
      console.log(`🔑 Пароль: ${user.password}`);
      console.log('');
    });
    
    console.log('💡 Также ваш пользователь:');
    console.log('📧 Email: x11021997x@mail.ru');
    console.log('🔑 Пароль: тот, что вы указали при регистрации');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

setRealPasswords().catch(console.error);
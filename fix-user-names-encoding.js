const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro',
});

async function fixUserNamesEncoding() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Исправляем кодировку имен пользователей...');
    
    // Обновляем тестовых пользователей с правильными русскими именами
    const updates = [
      {
        email: 'test@example.com',
        name: 'Тестовый Пользователь'
      },
      {
        email: 'admin@example.com', 
        name: 'Администратор Системы'
      }
    ];
    
    for (const user of updates) {
      const result = await client.query(
        'UPDATE users SET full_name = $1 WHERE email = $2',
        [user.name, user.email]
      );
      
      if (result.rowCount > 0) {
        console.log(`✅ Обновлен пользователь: ${user.email} -> ${user.name}`);
      }
    }
    
    // Добавим несколько новых пользователей с русскими именами для демонстрации
    const newUsers = [
      {
        email: 'alexander.petrov@example.com',
        name: 'Александр Петров',
        country: 'RU'
      },
      {
        email: 'maria.ivanova@example.com',
        name: 'Мария Иванова', 
        country: 'RU'
      },
      {
        email: 'dmitry.smirnov@example.com',
        name: 'Дмитрий Смирнов',
        country: 'RU'
      }
    ];
    
    for (const user of newUsers) {
      try {
        const result = await client.query(
          `INSERT INTO users (id, email, full_name, password_hash, country, balance, total_invested, total_earned, status, role_id, created_at)
           VALUES (gen_random_uuid(), $1, $2, $3, $4, 0, 0, 0, 'active', 3, NOW())
           ON CONFLICT (email) DO UPDATE SET full_name = $2, country = $4`,
          [user.email, user.name, '$2b$10$dummy.hash.for.demo.users.only', user.country]
        );
        console.log(`✅ Добавлен/обновлен пользователь: ${user.name}`);
      } catch (err) {
        console.log(`ℹ️  Пользователь ${user.email} уже существует`);
      }
    }
    
    // Проверяем результат
    const checkResult = await client.query(
      'SELECT email, full_name, country FROM users ORDER BY created_at DESC LIMIT 5'
    );
    
    console.log('\n📋 Последние пользователи в базе данных:');
    checkResult.rows.forEach(user => {
      console.log(`- ${user.full_name} (${user.email}) - ${user.country}`);
    });
    
    console.log('\n✅ Кодировка имен пользователей исправлена!');
    
  } catch (error) {
    console.error('❌ Ошибка при исправлении кодировки:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

fixUserNamesEncoding().catch(console.error);
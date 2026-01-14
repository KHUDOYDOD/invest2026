const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/investpro',
});

async function checkUserRegistration() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Проверяем регистрацию пользователя X11021997x@mail.ru...');
    
    // Ищем пользователя по email
    const userResult = await client.query(
      `SELECT 
        id, 
        email, 
        full_name, 
        country, 
        referral_code, 
        balance, 
        total_invested, 
        total_earned, 
        role_id, 
        status, 
        created_at
      FROM users 
      WHERE email = $1`,
      ['x11021997x@mail.ru']
    );
    
    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      console.log('✅ ПОЛЬЗОВАТЕЛЬ НАЙДЕН В БАЗЕ ДАННЫХ!');
      console.log('📋 Данные пользователя:');
      console.log(`- ID: ${user.id}`);
      console.log(`- Email: ${user.email}`);
      console.log(`- Имя: ${user.full_name}`);
      console.log(`- Страна: ${user.country}`);
      console.log(`- Реферальный код: ${user.referral_code}`);
      console.log(`- Баланс: ${user.balance}$`);
      console.log(`- Всего инвестировано: ${user.total_invested}$`);
      console.log(`- Всего заработано: ${user.total_earned}$`);
      console.log(`- Роль ID: ${user.role_id}`);
      console.log(`- Статус: ${user.status}`);
      console.log(`- Дата регистрации: ${user.created_at}`);
      
      // Определяем роль
      let roleName = 'Неизвестная роль';
      switch(user.role_id) {
        case 1: roleName = 'Супер-администратор'; break;
        case 2: roleName = 'Администратор'; break;
        case 3: roleName = 'Обычный пользователь'; break;
        case 4: roleName = 'Модератор'; break;
        case 5: roleName = 'Пользователь'; break;
      }
      console.log(`- Роль: ${roleName}`);
      
    } else {
      console.log('❌ ПОЛЬЗОВАТЕЛЬ НЕ НАЙДЕН В БАЗЕ ДАННЫХ');
      console.log('Возможные причины:');
      console.log('1. Регистрация не прошла успешно');
      console.log('2. Email был введен с другой капитализацией');
      console.log('3. Произошла ошибка при сохранении');
    }
    
    // Показываем всех пользователей для справки
    console.log('\n📋 Все пользователи в базе данных:');
    const allUsersResult = await client.query(
      `SELECT email, full_name, country, created_at 
       FROM users 
       ORDER BY created_at DESC 
       LIMIT 10`
    );
    
    if (allUsersResult.rows.length > 0) {
      allUsersResult.rows.forEach((user, index) => {
        console.log(`${index + 1}. ${user.full_name} (${user.email}) - ${user.country} - ${user.created_at}`);
      });
    } else {
      console.log('В базе данных нет пользователей');
    }
    
    // Проверяем также с разными вариантами email
    console.log('\n🔍 Проверяем альтернативные варианты email...');
    const emailVariants = [
      'X11021997x@mail.ru',
      'x11021997x@mail.ru', 
      'X11021997X@mail.ru',
      'x11021997X@mail.ru'
    ];
    
    for (const emailVariant of emailVariants) {
      const variantResult = await client.query(
        'SELECT email, full_name FROM users WHERE email = $1',
        [emailVariant]
      );
      
      if (variantResult.rows.length > 0) {
        console.log(`✅ Найден с email: ${emailVariant} - ${variantResult.rows[0].full_name}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Ошибка при проверке:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkUserRegistration().catch(console.error);
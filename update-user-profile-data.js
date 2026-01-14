const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function updateUserProfileData() {
  try {
    await client.connect();
    console.log('🔗 Подключение к базе данных...');

    // Обновляем данные пользователя test@example.com
    const result = await client.query(`
      UPDATE users 
      SET 
        country = 'RU',
        city = 'Москва',
        status = 'active',
        is_verified = true,
        is_active = true,
        phone = '+7 (999) 123-45-67'
      WHERE email = 'test@example.com'
      RETURNING email, country, city, status, is_verified, is_active, phone
    `);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log('✅ Данные пользователя обновлены:');
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🌍 Страна: ${user.country}`);
      console.log(`   🏙️ Город: ${user.city}`);
      console.log(`   📊 Статус: ${user.status}`);
      console.log(`   ✅ Верифицирован: ${user.is_verified}`);
      console.log(`   🟢 Активен: ${user.is_active}`);
      console.log(`   📱 Телефон: ${user.phone}`);
    } else {
      console.log('❌ Пользователь test@example.com не найден');
    }

    // Обновляем данные пользователя x11021997x@mail.ru
    const result2 = await client.query(`
      UPDATE users 
      SET 
        country = 'RU',
        city = 'Санкт-Петербург',
        status = 'active',
        is_verified = true,
        is_active = true,
        phone = '+7 (911) 234-56-78'
      WHERE email = 'x11021997x@mail.ru'
      RETURNING email, country, city, status, is_verified, is_active, phone
    `);

    if (result2.rows.length > 0) {
      const user = result2.rows[0];
      console.log('\n✅ Данные второго пользователя обновлены:');
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🌍 Страна: ${user.country}`);
      console.log(`   🏙️ Город: ${user.city}`);
      console.log(`   📊 Статус: ${user.status}`);
      console.log(`   ✅ Верифицирован: ${user.is_verified}`);
      console.log(`   🟢 Активен: ${user.is_active}`);
      console.log(`   📱 Телефон: ${user.phone}`);
    }

    // Создаем тестового неверифицированного пользователя
    const result3 = await client.query(`
      UPDATE users 
      SET 
        country = 'US',
        city = 'New York',
        status = 'pending',
        is_verified = false,
        is_active = true,
        phone = null
      WHERE email = 'admin@example.com'
      RETURNING email, country, city, status, is_verified, is_active, phone
    `);

    if (result3.rows.length > 0) {
      const user = result3.rows[0];
      console.log('\n✅ Админ обновлен (для демонстрации неверифицированного статуса):');
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🌍 Страна: ${user.country}`);
      console.log(`   🏙️ Город: ${user.city}`);
      console.log(`   📊 Статус: ${user.status}`);
      console.log(`   ❌ Верифицирован: ${user.is_verified}`);
      console.log(`   🟢 Активен: ${user.is_active}`);
      console.log(`   📱 Телефон: ${user.phone || 'Не указан'}`);
    }

    console.log('\n🎉 Все данные пользователей обновлены!');
    console.log('💡 Теперь карточки статуса будут показывать реальные данные');

  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await client.end();
  }
}

updateUserProfileData();
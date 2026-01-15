const { Pool } = require('pg');

async function fixAdminName() {
  // Прямое подключение к Neon базе данных
  const databaseUrl = 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require';

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Подключаемся к базе данных...\n');

    const newName = 'Главный Администратор';

    console.log('Исправляем имя админа...\n');

    const result = await pool.query(
      `UPDATE users 
       SET full_name = $1,
           updated_at = NOW()
       WHERE email = 'admin@example.com' AND role_id = 1
       RETURNING id, login, email, full_name`,
      [newName]
    );

    if (result.rows.length > 0) {
      const admin = result.rows[0];
      console.log('========================================');
      console.log('✅ ИМЯ УСПЕШНО ИСПРАВЛЕНО!');
      console.log('========================================\n');
      console.log('Данные админа:');
      console.log(`  Login:    ${admin.login}`);
      console.log(`  Email:    ${admin.email}`);
      console.log(`  Имя:      ${admin.full_name}`);
      console.log('');
      console.log('========================================');
      console.log('Админ панель: http://130.49.213.197/admin/dashboard');
      console.log('========================================\n');
      console.log('Обновите страницу в браузере (F5 или Ctrl+F5)');
      console.log('');
    } else {
      console.log('❌ Админ не найден\n');
    }

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

fixAdminName();

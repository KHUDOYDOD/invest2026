const { Pool } = require('pg');

async function checkAdmins() {
  // Прямое подключение к Neon базе данных
  const databaseUrl = 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require';

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Подключаемся к Neon базе данных...\n');

    // Сначала проверим структуру таблицы
    const structure = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);

    console.log('Структура таблицы users:');
    structure.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });
    console.log('');

    // Ищем всех админов (role_id = 1 это админ)
    const result = await pool.query(`
      SELECT 
        id,
        login,
        email,
        full_name,
        role_id,
        created_at
      FROM users 
      WHERE role_id = 1
      ORDER BY created_at DESC
    `);

    console.log('========================================');
    console.log('ВСЕ АДМИНЫ В БАЗЕ ДАННЫХ');
    console.log('========================================\n');

    if (result.rows.length === 0) {
      console.log('❌ Админов не найдено в базе данных\n');
    } else {
      console.log(`✅ Найдено админов: ${result.rows.length}\n`);
      
      result.rows.forEach((admin, index) => {
        console.log(`АДМИН ${index + 1}:`);
        console.log('─────────────────────────────────────');
        console.log(`ID:       ${admin.id}`);
        console.log(`Login:    ${admin.login || 'Не указан'}`);
        console.log(`Email:    ${admin.email}`);
        console.log(`Имя:      ${admin.full_name || 'Не указано'}`);
        console.log(`Role ID:  ${admin.role_id}`);
        console.log(`Создан:   ${admin.created_at}`);
        console.log('');
      });
    }

    console.log('========================================\n');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

checkAdmins();

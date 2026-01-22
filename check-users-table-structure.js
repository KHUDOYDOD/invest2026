const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function checkUsersTableStructure() {
  try {
    console.log('🔍 Проверяем структуру таблицы users...');

    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);

    if (result.rows.length === 0) {
      console.log('❌ Таблица users не найдена');
      return;
    }

    console.log('✅ Структура таблицы users:');
    result.rows.forEach((column, index) => {
      console.log(`${index + 1}. ${column.column_name} (${column.data_type}) - ${column.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // Также проверим несколько записей
    const usersResult = await pool.query('SELECT * FROM users LIMIT 2');
    console.log('\n📋 Пример записей:');
    if (usersResult.rows.length > 0) {
      console.log('Колонки:', Object.keys(usersResult.rows[0]));
      usersResult.rows.forEach((user, index) => {
        console.log(`${index + 1}. ID: ${user.id}, Email: ${user.email}, Name: ${user.full_name}`);
      });
    }

  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await pool.end();
  }
}

checkUsersTableStructure();
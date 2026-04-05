const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false
});

async function createPagesTables() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Создание таблиц для страниц...\n');

    // Читаем SQL файл
    const fs = require('fs');
    const path = require('path');
    const sqlPath = path.join(__dirname, 'create-pages-tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Выполняем SQL
    await client.query(sql);

    console.log('✅ Таблицы успешно созданы!');
    console.log('\nСозданные таблицы:');
    console.log('- team_members (команда)');
    console.log('- careers (вакансии)');
    console.log('- contacts (контакты)');
    console.log('- pages (статические страницы)');
    console.log('- blog_posts (блог)');

    // Проверяем данные
    const teamCount = await client.query('SELECT COUNT(*) FROM team_members');
    const careersCount = await client.query('SELECT COUNT(*) FROM careers');
    const contactsCount = await client.query('SELECT COUNT(*) FROM contacts');
    const pagesCount = await client.query('SELECT COUNT(*) FROM pages');

    console.log('\n📊 Начальные данные:');
    console.log(`- Членов команды: ${teamCount.rows[0].count}`);
    console.log(`- Вакансий: ${careersCount.rows[0].count}`);
    console.log(`- Контактов: ${contactsCount.rows[0].count}`);
    console.log(`- Страниц: ${pagesCount.rows[0].count}`);

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

createPagesTables();

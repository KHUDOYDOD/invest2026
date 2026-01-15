const { Pool } = require('pg');
const fs = require('fs');

async function checkAdmins() {
  // Читаем POSTGRES_URL из .env.local
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const match = envContent.match(/POSTGRES_URL="(.+)"/);
  const databaseUrl = match ? match[1].trim() : null;

  if (!databaseUrl) {
    console.error('POSTGRES_URL не найден в .env.local');
    return;
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Подключаемся к базе данных...\n');

    // Ищем всех админов
    const result = await pool.query(`
      SELECT 
        id,
        username,
        email,
        full_name,
        role,
        is_admin,
        created_at
      FROM users 
      WHERE is_admin = true OR role = 'admin'
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
        console.log(`Username: ${admin.username}`);
        console.log(`Email:    ${admin.email}`);
        console.log(`Имя:      ${admin.full_name || 'Не указано'}`);
        console.log(`Role:     ${admin.role}`);
        console.log(`Is Admin: ${admin.is_admin}`);
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

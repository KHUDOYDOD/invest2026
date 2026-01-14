const { Pool } = require('pg');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const dbUrl = env.match(/DATABASE_URL=(.+)/)[1].trim();
const pool = new Pool({ connectionString: dbUrl });

pool.query('SELECT id, email, full_name FROM users').then(r => {
  console.log('\n👥 Пользователи в базе данных:\n');
  r.rows.forEach(u => {
    console.log(`📧 Email: ${u.email}`);
    console.log(`👤 Имя: ${u.full_name}`);
    console.log(`🆔 ID: ${u.id}`);
    console.log('─'.repeat(50));
  });
  pool.end();
});

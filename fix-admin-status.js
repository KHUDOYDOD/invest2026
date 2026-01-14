const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'investpro',
  password: 'postgres123',
  port: 5432,
});

async function fixAdminStatus() {
  try {
    console.log('🔍 Checking admin user status...');
    
    const result = await pool.query('SELECT id, email, full_name, role_id, status FROM users WHERE email = $1', ['admin@example.com']);
    console.log('Admin user:', result.rows[0]);
    
    if (result.rows[0]) {
      if (result.rows[0].status !== 'active') {
        console.log('⚠️ Admin user is not active. Activating...');
        await pool.query('UPDATE users SET status = $1 WHERE email = $2', ['active', 'admin@example.com']);
        console.log('✅ Admin user activated');
      } else {
        console.log('✅ Admin user is already active');
      }
      
      // Also check password
      const passwordCheck = await pool.query('SELECT password_hash FROM users WHERE email = $1', ['admin@example.com']);
      console.log('Password hash exists:', !!passwordCheck.rows[0].password_hash);
    } else {
      console.log('❌ Admin user not found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

fixAdminStatus();
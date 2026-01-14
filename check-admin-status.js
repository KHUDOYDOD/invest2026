const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function checkAdminStatus() {
  try {
    console.log('=== CHECKING ADMIN USER ===');
    const adminResult = await pool.query('SELECT id, email, full_name, role_id, status FROM users WHERE email = $1', ['admin@example.com']);
    if (adminResult.rows.length > 0) {
      console.log('✅ Admin user found:', adminResult.rows[0]);
    } else {
      console.log('❌ Admin user NOT found');
    }
    
    console.log('\n=== CHECKING DEPOSIT REQUESTS TABLE ===');
    const tableCheck = await pool.query('SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1 ORDER BY ordinal_position', ['deposit_requests']);
    console.log('📋 Deposit requests table structure:');
    tableCheck.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });
    
    console.log('\n=== CHECKING SAMPLE DEPOSIT REQUESTS ===');
    const requests = await pool.query('SELECT id, user_id, amount, method, status, created_at FROM deposit_requests ORDER BY created_at DESC LIMIT 3');
    console.log('📊 Sample requests:', requests.rows);
    
    console.log('\n=== CHECKING USERS WITH ROLE_ID ===');
    const usersWithRoles = await pool.query('SELECT id, email, full_name, role_id FROM users ORDER BY role_id');
    console.log('👥 Users with roles:');
    usersWithRoles.rows.forEach(user => {
      const roleText = user.role_id === 1 ? 'super_admin' : user.role_id === 2 ? 'admin' : 'user';
      console.log(`  - ${user.email}: role_id=${user.role_id} (${roleText})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkAdminStatus();
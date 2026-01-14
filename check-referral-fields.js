const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function checkReferralFields() {
  const client = await pool.connect();
  try {
    console.log('🔍 Checking referral fields in users table...\n');
    
    // Check table structure
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      AND column_name IN ('referral_code', 'referred_by', 'total_earned')
      ORDER BY column_name;
    `);
    
    console.log('📋 Referral-related columns:');
    columns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    // Check if any users have referral codes
    const usersWithCodes = await client.query(`
      SELECT id, email, full_name, referral_code, referred_by, total_earned
      FROM users
      WHERE referral_code IS NOT NULL
      LIMIT 5;
    `);
    
    console.log(`\n👥 Users with referral codes (${usersWithCodes.rows.length}):`);
    usersWithCodes.rows.forEach(user => {
      console.log(`  - ${user.full_name} (${user.email})`);
      console.log(`    Code: ${user.referral_code}`);
      console.log(`    Referred by: ${user.referred_by || 'None'}`);
      console.log(`    Earned: $${user.total_earned || 0}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkReferralFields();

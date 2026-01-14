const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function testReferralSystem() {
  const client = await pool.connect();
  try {
    console.log('🧪 Testing Referral System\n');
    
    // Get a user with referral code
    const userResult = await client.query(`
      SELECT id, full_name, email, referral_code, total_earned
      FROM users
      WHERE referral_code IS NOT NULL
      LIMIT 1
    `);
    
    if (userResult.rows.length === 0) {
      console.log('❌ No users with referral codes found');
      return;
    }
    
    const user = userResult.rows[0];
    console.log('👤 Test User:');
    console.log(`   Name: ${user.full_name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Referral Code: ${user.referral_code}`);
    console.log(`   Total Earned: $${user.total_earned || 0}\n`);
    
    // Get referrals for this user
    const referralsResult = await client.query(`
      SELECT 
        u.id,
        u.full_name as name,
        u.email,
        u.created_at as registration_date,
        u.total_invested,
        u.status,
        u.referred_by
      FROM users u
      WHERE u.referred_by = $1
      ORDER BY u.created_at DESC
    `, [user.referral_code]);
    
    console.log(`📊 Referrals (${referralsResult.rows.length}):`);
    if (referralsResult.rows.length === 0) {
      console.log('   No referrals yet\n');
    } else {
      referralsResult.rows.forEach((ref, index) => {
        console.log(`\n   ${index + 1}. ${ref.name}`);
        console.log(`      Email: ${ref.email}`);
        console.log(`      Registered: ${new Date(ref.registration_date).toLocaleDateString()}`);
        console.log(`      Invested: $${ref.total_invested || 0}`);
        console.log(`      Status: ${ref.status}`);
      });
    }
    
    // Calculate potential earnings
    const totalInvested = referralsResult.rows.reduce((sum, ref) => sum + parseFloat(ref.total_invested || 0), 0);
    const potentialEarnings = totalInvested * 0.05; // 5% commission
    
    console.log(`\n💰 Summary:`);
    console.log(`   Total Referrals: ${referralsResult.rows.length}`);
    console.log(`   Total Invested by Referrals: $${totalInvested.toFixed(2)}`);
    console.log(`   Potential Earnings (5%): $${potentialEarnings.toFixed(2)}`);
    console.log(`   Current Total Earned: $${user.total_earned || 0}`);
    
    // Test the referral link
    console.log(`\n🔗 Referral Link:`);
    console.log(`   http://localhost:3000/register?ref=${user.referral_code}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

testReferralSystem();

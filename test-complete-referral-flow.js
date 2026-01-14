const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function testCompleteReferralFlow() {
  const client = await pool.connect();
  try {
    console.log('🧪 COMPLETE REFERRAL SYSTEM TEST\n');
    console.log('='.repeat(60));
    
    // Step 1: Get a referrer user
    console.log('\n📋 STEP 1: Get Referrer User');
    console.log('-'.repeat(60));
    
    const referrerResult = await client.query(`
      SELECT id, full_name, email, referral_code, balance, total_earned
      FROM users
      WHERE referral_code IS NOT NULL
      LIMIT 1
    `);
    
    if (referrerResult.rows.length === 0) {
      console.log('❌ No users with referral codes found');
      return;
    }
    
    const referrer = referrerResult.rows[0];
    console.log(`✅ Referrer: ${referrer.full_name} (${referrer.email})`);
    console.log(`   Referral Code: ${referrer.referral_code}`);
    console.log(`   Current Balance: $${parseFloat(referrer.balance).toFixed(2)}`);
    console.log(`   Total Earned: $${parseFloat(referrer.total_earned).toFixed(2)}`);
    
    // Step 2: Check for referred users
    console.log('\n📋 STEP 2: Check Referred Users');
    console.log('-'.repeat(60));
    
    const referredUsersResult = await client.query(`
      SELECT id, full_name, email, referred_by, balance, total_invested
      FROM users
      WHERE referred_by = $1
    `, [referrer.referral_code]);
    
    console.log(`✅ Found ${referredUsersResult.rows.length} referred users`);
    
    if (referredUsersResult.rows.length > 0) {
      referredUsersResult.rows.forEach((user, index) => {
        console.log(`\n   ${index + 1}. ${user.full_name} (${user.email})`);
        console.log(`      Balance: $${parseFloat(user.balance).toFixed(2)}`);
        console.log(`      Total Invested: $${parseFloat(user.total_invested).toFixed(2)}`);
      });
    }
    
    // Step 3: Check deposit requests from referred users
    console.log('\n📋 STEP 3: Check Deposit Requests');
    console.log('-'.repeat(60));
    
    if (referredUsersResult.rows.length > 0) {
      const referredUserIds = referredUsersResult.rows.map(u => u.id);
      
      const depositsResult = await client.query(`
        SELECT 
          dr.id,
          dr.user_id,
          dr.amount,
          dr.status,
          dr.created_at,
          u.full_name
        FROM deposit_requests dr
        JOIN users u ON dr.user_id = u.id
        WHERE dr.user_id = ANY($1)
        ORDER BY dr.created_at DESC
      `, [referredUserIds]);
      
      console.log(`✅ Found ${depositsResult.rows.length} deposit requests from referred users`);
      
      if (depositsResult.rows.length > 0) {
        depositsResult.rows.forEach((deposit, index) => {
          console.log(`\n   ${index + 1}. ${deposit.full_name}`);
          console.log(`      Amount: $${parseFloat(deposit.amount).toFixed(2)}`);
          console.log(`      Status: ${deposit.status}`);
          console.log(`      Date: ${new Date(deposit.created_at).toLocaleDateString()}`);
          
          if (deposit.status === 'approved') {
            const commission = parseFloat(deposit.amount) * 0.05;
            console.log(`      💰 Commission earned: $${commission.toFixed(2)}`);
          }
        });
      }
    }
    
    // Step 4: Check referral transactions
    console.log('\n📋 STEP 4: Check Referral Transactions');
    console.log('-'.repeat(60));
    
    const referralTransactionsResult = await client.query(`
      SELECT 
        id,
        amount,
        description,
        created_at
      FROM transactions
      WHERE user_id = $1 AND type = 'referral_bonus'
      ORDER BY created_at DESC
      LIMIT 10
    `, [referrer.id]);
    
    console.log(`✅ Found ${referralTransactionsResult.rows.length} referral bonus transactions`);
    
    if (referralTransactionsResult.rows.length > 0) {
      let totalCommissions = 0;
      referralTransactionsResult.rows.forEach((tx, index) => {
        const amount = parseFloat(tx.amount);
        totalCommissions += amount;
        console.log(`\n   ${index + 1}. $${amount.toFixed(2)}`);
        console.log(`      ${tx.description}`);
        console.log(`      Date: ${new Date(tx.created_at).toLocaleDateString()}`);
      });
      console.log(`\n   💰 Total Commissions: $${totalCommissions.toFixed(2)}`);
    }
    
    // Step 5: Calculate expected vs actual earnings
    console.log('\n📋 STEP 5: Earnings Summary');
    console.log('-'.repeat(60));
    
    if (referredUsersResult.rows.length > 0) {
      const referredUserIds = referredUsersResult.rows.map(u => u.id);
      
      const approvedDepositsResult = await client.query(`
        SELECT COALESCE(SUM(amount), 0) as total
        FROM deposit_requests
        WHERE user_id = ANY($1) AND status = 'approved'
      `, [referredUserIds]);
      
      const totalDeposits = parseFloat(approvedDepositsResult.rows[0].total);
      const expectedEarnings = totalDeposits * 0.05;
      const actualEarnings = parseFloat(referrer.total_earned);
      
      console.log(`   Total Deposits by Referrals: $${totalDeposits.toFixed(2)}`);
      console.log(`   Expected Earnings (5%): $${expectedEarnings.toFixed(2)}`);
      console.log(`   Actual Total Earned: $${actualEarnings.toFixed(2)}`);
      
      if (Math.abs(expectedEarnings - actualEarnings) < 0.01) {
        console.log(`   ✅ Earnings match!`);
      } else {
        console.log(`   ⚠️ Earnings mismatch (difference: $${Math.abs(expectedEarnings - actualEarnings).toFixed(2)})`);
      }
    }
    
    // Step 6: Test API endpoint
    console.log('\n📋 STEP 6: Test API Endpoint');
    console.log('-'.repeat(60));
    console.log(`   API URL: /api/user/referrals?userId=${referrer.id}`);
    console.log(`   Referral Link: http://localhost:3000/register?ref=${referrer.referral_code}`);
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ REFERRAL SYSTEM TEST COMPLETE');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    client.release();
    await pool.end();
  }
}

testCompleteReferralFlow();

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'investpro',
  password: 'postgres123',
  port: 5432,
});

async function fixAllIssues() {
  try {
    console.log('🔧 FIXING ALL ISSUES...\n');
    
    // 1. Check and fix admin user status
    console.log('1. Checking admin user...');
    const adminResult = await pool.query('SELECT id, email, status, role_id FROM users WHERE email = $1', ['admin@example.com']);
    
    if (adminResult.rows.length === 0) {
      console.log('❌ Admin user not found');
      return;
    }
    
    const admin = adminResult.rows[0];
    console.log('✅ Admin user found:', admin);
    
    if (admin.status !== 'active') {
      await pool.query('UPDATE users SET status = $1 WHERE email = $2', ['active', 'admin@example.com']);
      console.log('✅ Admin user activated');
    }
    
    // 2. Check testimonials table structure
    console.log('\n2. Checking testimonials table...');
    const testimonials = await pool.query('SELECT COUNT(*) as count FROM testimonials');
    console.log(`✅ Testimonials table has ${testimonials.rows[0].count} records`);
    
    // 3. Add test balance to admin for withdrawal testing
    console.log('\n3. Adding test balance to admin...');
    await pool.query('UPDATE users SET balance = $1 WHERE email = $2', [5000, 'admin@example.com']);
    console.log('✅ Admin balance set to $5000 for testing');
    
    // 4. Check withdrawal requests table
    console.log('\n4. Checking withdrawal requests...');
    const withdrawals = await pool.query('SELECT COUNT(*) as count FROM withdrawal_requests');
    console.log(`✅ Withdrawal requests table has ${withdrawals.rows[0].count} records`);
    
    // 5. Check deposit requests table
    console.log('\n5. Checking deposit requests...');
    const deposits = await pool.query('SELECT COUNT(*) as count FROM deposit_requests');
    console.log(`✅ Deposit requests table has ${deposits.rows[0].count} records`);
    
    // 6. Create a test testimonial for moderation
    console.log('\n6. Creating test testimonial...');
    const testTestimonial = await pool.query(`
      INSERT INTO testimonials (user_id, rating, title, content, status, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT DO NOTHING
      RETURNING id
    `, [
      admin.id,
      5,
      'Тестовый отзыв для модерации',
      'Это тестовый отзыв для проверки системы модерации администратором.',
      'pending'
    ]);
    
    if (testTestimonial.rows.length > 0) {
      console.log(`✅ Test testimonial created with ID: ${testTestimonial.rows[0].id}`);
    } else {
      console.log('✅ Test testimonial already exists');
    }
    
    // 7. Create test withdrawal request
    console.log('\n7. Creating test withdrawal request...');
    const testWithdrawal = await pool.query(`
      INSERT INTO withdrawal_requests (user_id, amount, method, wallet_address, fee, final_amount, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      ON CONFLICT DO NOTHING
      RETURNING id
    `, [
      admin.id,
      100,
      'crypto',
      '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      2,
      98,
      'pending'
    ]);
    
    if (testWithdrawal.rows.length > 0) {
      console.log(`✅ Test withdrawal request created with ID: ${testWithdrawal.rows[0].id}`);
    } else {
      console.log('✅ Test withdrawal request already exists');
    }
    
    // 8. Create test deposit request
    console.log('\n8. Creating test deposit request...');
    const testDeposit = await pool.query(`
      INSERT INTO deposit_requests (user_id, amount, method, payment_details, status, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT DO NOTHING
      RETURNING id
    `, [
      admin.id,
      500,
      'Банковская карта',
      '{"card_number": "**** **** **** 1234"}',
      'pending'
    ]);
    
    if (testDeposit.rows.length > 0) {
      console.log(`✅ Test deposit request created with ID: ${testDeposit.rows[0].id}`);
    } else {
      console.log('✅ Test deposit request already exists');
    }
    
    console.log('\n🎉 ALL ISSUES FIXED!');
    console.log('\n📋 SUMMARY:');
    console.log('✅ Admin user is active and ready');
    console.log('✅ Admin has $5000 balance for testing');
    console.log('✅ Test testimonial created for moderation');
    console.log('✅ Test withdrawal request created');
    console.log('✅ Test deposit request created');
    console.log('\n🔗 ADMIN LOGIN:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('URL: http://localhost:3000/admin/login');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

fixAllIssues();
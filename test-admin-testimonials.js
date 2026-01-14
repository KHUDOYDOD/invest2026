const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'investpro',
  password: 'postgres123',
  port: 5432,
});

const JWT_SECRET = "fallback_secret";

async function testAdminTestimonials() {
  try {
    console.log('=== TESTING ADMIN TESTIMONIALS API ===');
    
    // 1. Get admin user
    const adminResult = await pool.query('SELECT id, email, role_id FROM users WHERE email = $1', ['admin@example.com']);
    if (adminResult.rows.length === 0) {
      console.log('❌ Admin user not found');
      return;
    }
    
    const admin = adminResult.rows[0];
    console.log('✅ Admin user found:', admin);
    
    // 2. Create JWT token
    const token = jwt.sign(
      { 
        userId: admin.id, 
        email: admin.email, 
        role: admin.role_id === 1 ? 'super_admin' : 'admin'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('✅ JWT token created');
    
    // 3. Test testimonial update
    const testimonialId = 8;
    console.log(`\n🔍 Testing testimonial ${testimonialId} update...`);
    
    // Check if testimonial exists
    const testimonialCheck = await pool.query('SELECT id, status, user_id FROM testimonials WHERE id = $1', [testimonialId]);
    if (testimonialCheck.rows.length === 0) {
      console.log('❌ Testimonial not found');
      return;
    }
    
    console.log('✅ Testimonial found:', testimonialCheck.rows[0]);
    
    // 4. Test the update query
    const updateQuery = `
      UPDATE testimonials 
      SET 
        status = $1,
        admin_comment = $2,
        approved_by = $3,
        approved_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, status, updated_at
    `;
    
    const queryParams = ['approved', 'Test comment', admin.id, testimonialId];
    
    console.log('Query:', updateQuery);
    console.log('Params:', queryParams);
    
    const result = await pool.query(updateQuery, queryParams);
    console.log('✅ Update result:', result.rows[0]);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

testAdminTestimonials();
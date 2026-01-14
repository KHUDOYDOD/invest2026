const { query } = require('./lib/database');

async function checkTestimonials() {
  try {
    console.log('=== CHECKING TESTIMONIALS TABLE ===');
    
    // Check table structure
    const structure = await query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'testimonials' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Testimonials table structure:');
    structure.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });
    
    // Check sample data
    const testimonials = await query('SELECT * FROM testimonials LIMIT 3');
    console.log('\n📊 Sample testimonials:', testimonials.rows.length);
    testimonials.rows.forEach(t => {
      console.log(`  - ID: ${t.id}, Status: ${t.status}, Rating: ${t.rating}`);
    });
    
    // Check if approved_by column exists
    const approvedByCheck = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'testimonials' AND column_name = 'approved_by'
    `);
    
    console.log('\n🔍 approved_by column exists:', approvedByCheck.rows.length > 0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTestimonials();
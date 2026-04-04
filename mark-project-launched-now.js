const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('neon.tech') ? { rejectUnauthorized: false } : false
});

async function markProjectAsLaunched() {
  try {
    console.log('🚀 Marking project as launched...');
    
    // Update the project to mark it as launched
    const result = await pool.query(`
      UPDATE project_launches 
      SET is_launched = true,
          updated_at = NOW()
      WHERE name = 'platform-launch'
      RETURNING *
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Project marked as launched:', result.rows[0]);
    } else {
      console.log('❌ No project found with name "platform-launch"');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

markProjectAsLaunched();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function checkStatus() {
  try {
    const result = await pool.query(`
      SELECT id, name, is_launched, show_on_site, is_active 
      FROM project_launches 
      ORDER BY position 
      LIMIT 5
    `);
    
    console.log('=== PROJECT LAUNCHES STATUS ===');
    console.log(JSON.stringify(result.rows, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkStatus();

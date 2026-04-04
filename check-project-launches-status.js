const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkLaunches() {
  try {
    const result = await pool.query(`
      SELECT id, name, title, launch_date, is_launched, show_on_site, is_active 
      FROM project_launches 
      ORDER BY position
    `);
    
    console.log('=== PROJECT LAUNCHES STATUS ===');
    console.log(JSON.stringify(result.rows, null, 2));
    
    if (result.rows.length === 0) {
      console.log('\n❌ No project launches found in database');
    } else {
      const launched = result.rows.filter(r => r.is_launched === true && r.show_on_site && r.is_active);
      console.log(`\n✅ Total launches: ${result.rows.length}`);
      console.log(`✅ Launched and visible: ${launched.length}`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkLaunches();

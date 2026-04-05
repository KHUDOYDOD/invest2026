require('dotenv').config({ path: '.env.production' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function launchProject() {
  try {
    // Проверяем текущий статус
    const check = await pool.query(`
      SELECT id, name, is_launched, show_on_site 
      FROM project_launches 
      ORDER BY position 
      LIMIT 1
    `);
    
    console.log('=== CURRENT STATUS ===');
    console.log(check.rows[0]);
    
    if (check.rows.length > 0) {
      // Запускаем проект
      const result = await pool.query(`
        UPDATE project_launches 
        SET is_launched = true,
            launch_date = NOW()
        WHERE id = $1
        RETURNING *
      `, [check.rows[0].id]);
      
      console.log('\n=== PROJECT LAUNCHED ===');
      console.log(result.rows[0]);
    } else {
      console.log('No projects found');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

launchProject();

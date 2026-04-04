const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function checkLaunches() {
  try {
    const result = await pool.query('SELECT * FROM project_launches ORDER BY created_at DESC');
    console.log('📊 Project launches in database:', result.rows.length);
    
    if (result.rows.length === 0) {
      console.log('❌ No project launches found. Creating a test launch...');
      
      // Create a test launch
      const insertResult = await pool.query(`
        INSERT INTO project_launches (
          name, title, description, launch_date, countdown_end, 
          is_launched, is_active, show_on_site, show_countdown, 
          position, icon_type, background_type, color_scheme
        ) VALUES (
          'test-launch-2026', 
          'Новая версия InvestPro 2026', 
          'Запуск обновленной платформы с улучшенным дизайном и новыми возможностями', 
          '2026-02-01 12:00:00', 
          '2026-02-01 12:00:00', 
          false, 
          true, 
          true, 
          true, 
          1, 
          'rocket', 
          'gradient', 
          'blue'
        ) RETURNING *
      `);
      
      console.log('✅ Created test launch:', insertResult.rows[0].title);
    } else {
      result.rows.forEach(launch => {
        console.log(`- ${launch.title} (${launch.is_active ? 'active' : 'inactive'}, ${launch.show_on_site ? 'visible' : 'hidden'})`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkLaunches();
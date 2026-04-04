const { pool } = require('./lib/database.ts');

(async () => {
  try {
    console.log('🔍 Checking current project launches status...');
    
    const result = await pool.query(`
      SELECT 
        name, 
        title, 
        is_launched, 
        is_active, 
        show_on_site, 
        disable_registration, 
        disable_investments, 
        disable_deposits, 
        disable_withdrawals,
        launch_date
      FROM project_launches 
      ORDER BY position ASC
    `);
    
    console.log(`\n📊 Found ${result.rows.length} project launches:\n`);
    
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.name}: ${row.title}`);
      console.log(`   🚀 Launched: ${row.is_launched ? 'YES' : 'NO'}`);
      console.log(`   ✅ Active: ${row.is_active ? 'YES' : 'NO'}`);
      console.log(`   👁️  Show on site: ${row.show_on_site ? 'YES' : 'NO'}`);
      console.log(`   📅 Launch date: ${row.launch_date}`);
      console.log(`   🔒 Restrictions:`);
      console.log(`      - Registration: ${row.disable_registration ? 'DISABLED' : 'enabled'}`);
      console.log(`      - Investments: ${row.disable_investments ? 'DISABLED' : 'enabled'}`);
      console.log(`      - Deposits: ${row.disable_deposits ? 'DISABLED' : 'enabled'}`);
      console.log(`      - Withdrawals: ${row.disable_withdrawals ? 'DISABLED' : 'enabled'}`);
      console.log('');
    });
    
    // Check which project is currently controlling restrictions
    const activeResult = await pool.query(`
      SELECT name, title
      FROM project_launches 
      WHERE is_active = true 
        AND show_on_site = true 
        AND (is_launched = false OR is_launched IS NULL)
      ORDER BY position ASC
      LIMIT 1
    `);
    
    if (activeResult.rows.length > 0) {
      console.log(`🎯 Currently controlling restrictions: ${activeResult.rows[0].name} - ${activeResult.rows[0].title}`);
    } else {
      console.log('✅ No active projects controlling restrictions - all functions should be enabled');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
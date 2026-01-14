const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function addReferredByField() {
  const client = await pool.connect();
  try {
    console.log('🔧 Adding referred_by field to users table...\n');
    
    // Check if referred_by column exists
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'referred_by';
    `);
    
    if (checkColumn.rows.length > 0) {
      console.log('✅ referred_by column already exists');
      
      // Check the data type
      const columnInfo = await client.query(`
        SELECT data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'referred_by';
      `);
      
      console.log(`   Current type: ${columnInfo.rows[0].data_type}`);
      
      // If it's UUID, we need to change it to VARCHAR to match referral_code
      if (columnInfo.rows[0].data_type === 'uuid') {
        console.log('\n🔄 Converting referred_by from UUID to VARCHAR...');
        
        // Drop the column with CASCADE to remove dependencies
        await client.query('ALTER TABLE users DROP COLUMN IF EXISTS referred_by CASCADE;');
        await client.query('ALTER TABLE users ADD COLUMN referred_by VARCHAR(50);');
        await client.query('CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users(referred_by);');
        
        console.log('✅ Column converted to VARCHAR(50)');
      }
    } else {
      console.log('➕ Adding referred_by column...');
      
      // Add the column
      await client.query('ALTER TABLE users ADD COLUMN referred_by VARCHAR(50);');
      await client.query('CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users(referred_by);');
      
      console.log('✅ referred_by column added successfully');
    }
    
    // Verify the structure
    console.log('\n📋 Final structure:');
    const finalCheck = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      AND column_name IN ('referral_code', 'referred_by')
      ORDER BY column_name;
    `);
    
    finalCheck.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    console.log('\n✅ Setup complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

addReferredByField();

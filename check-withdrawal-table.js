const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
});

async function checkWithdrawalTable() {
  try {
    console.log('=== CHECKING WITHDRAWAL REQUESTS TABLE ===');
    
    // Check if table exists
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'withdrawal_requests'
      );
    `);
    
    if (tableExists.rows[0].exists) {
      console.log('✅ withdrawal_requests table exists');
      
      // Get table structure
      const structure = await pool.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'withdrawal_requests' 
        ORDER BY ordinal_position
      `);
      
      console.log('📋 Table structure:');
      structure.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
      
      // Get sample data
      const sampleData = await pool.query('SELECT * FROM withdrawal_requests LIMIT 3');
      console.log(`\n📊 Sample data (${sampleData.rows.length} rows):`, sampleData.rows);
      
    } else {
      console.log('❌ withdrawal_requests table does NOT exist');
      console.log('Creating withdrawal_requests table...');
      
      await pool.query(`
        CREATE TABLE withdrawal_requests (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id),
          amount DECIMAL(15,2) NOT NULL,
          method VARCHAR(50) NOT NULL,
          wallet_address TEXT,
          fee DECIMAL(15,2) DEFAULT 0,
          final_amount DECIMAL(15,2),
          status VARCHAR(20) DEFAULT 'pending',
          admin_comment TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          processed_at TIMESTAMP WITH TIME ZONE,
          processed_by UUID REFERENCES users(id)
        );
      `);
      
      console.log('✅ withdrawal_requests table created successfully');
      
      // Create some sample withdrawal requests
      console.log('Creating sample withdrawal requests...');
      
      const users = await pool.query('SELECT id FROM users WHERE role_id = 3 LIMIT 2');
      if (users.rows.length > 0) {
        for (const user of users.rows) {
          await pool.query(`
            INSERT INTO withdrawal_requests (user_id, amount, method, wallet_address, fee, final_amount, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'pending')
          `, [
            user.id,
            Math.floor(Math.random() * 1000) + 100, // 100-1100
            'crypto',
            '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', // Sample Bitcoin address
            10, // $10 fee
            Math.floor(Math.random() * 1000) + 90 // final amount after fee
          ]);
        }
        console.log('✅ Sample withdrawal requests created');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkWithdrawalTable();
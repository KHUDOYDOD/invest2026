const { Client } = require('pg');
const fs = require('fs');

// Читаем .env.local файл вручную
function loadEnv() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const lines = envContent.split('\n');
    const env = {};
    
    lines.forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        env[key] = value;
      }
    });
    
    return env;
  } catch (error) {
    console.error('❌ Не удалось прочитать .env.local:', error.message);
    return null;
  }
}

async function checkMessagesTable() {
  const env = loadEnv();
  if (!env || !env.DATABASE_URL) {
    console.error('❌ DATABASE_URL не найден в .env.local');
    return;
  }

  const client = new Client({
    connectionString: env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('✅ Подключено к базе данных\n');
    
    // Check if messages table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'messages'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('❌ Messages table does not exist');
      console.log('   Run: create-messages-tables.bat\n');
      return;
    }
    
    console.log('✅ Messages table exists\n');
    
    // Get table structure
    const structure = await client.query(`
      SELECT 
        column_name, 
        data_type, 
        character_maximum_length,
        column_default,
        is_nullable
      FROM information_schema.columns
      WHERE table_name = 'messages'
      ORDER BY ordinal_position;
    `);
    
    console.log('Table structure:');
    console.table(structure.rows);
    
    // Check foreign key constraints
    const constraints = await client.query(`
      SELECT
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      LEFT JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.table_name = 'messages';
    `);
    
    console.log('\nConstraints:');
    console.table(constraints.rows);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkMessagesTable();

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

console.log('Loading environment variables...');
console.log('POSTGRES_URL_NON_POOLING exists:', !!process.env.POSTGRES_URL_NON_POOLING);
console.log('POSTGRES_URL exists:', !!process.env.POSTGRES_URL);

const connectionString = process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('No database connection string found in environment variables');
  process.exit(1);
}

console.log('Connection string found, testing connection...');

const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.query('SELECT NOW() as current_time, version() as db_version')
  .then(result => {
    console.log('✅ Database connection successful!');
    console.log('Current time:', result.rows[0].current_time);
    console.log('Database version:', result.rows[0].db_version.split(' ')[0]);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });
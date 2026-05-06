const { Client } = require('pg');

async function testLocalDB() {
  // Try to connect to localhost first
  const connectionString = 'postgresql://medusa:medusa_password@localhost:5432/magicofit';
  const client = new Client({ connectionString });

  try {
    console.log('Testing local PostgreSQL connection...');
    await client.connect();
    console.log('✅ Connection successful!');
    
    const res = await client.query('SELECT current_database(), current_user');
    console.log(`Database: ${res.rows[0].current_database}`);
    console.log(`User: ${res.rows[0].current_user}`);
    
    // Check for tables
    const tableRes = await client.query("SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public'");
    console.log(`Table Count: ${tableRes.rows[0].count}`);
    
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    console.log('\n--- Troubleshooting ---');
    console.log('1. Is PostgreSQL service running?');
    console.log('2. Does the database "magicofit" exist?');
    console.log('3. Is the user "medusa" created with the correct password?');
  } finally {
    await client.end();
  }
}

testLocalDB();

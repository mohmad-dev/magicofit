const { Client } = require('pg');

async function inspect() {
  const connectionString = 'postgresql://postgres.hmphprybilzjdyaypgcy:ZWpg1WzeQU2pO4DT@db.hmphprybilzjdyaypgcy.supabase.co:5432/postgres';
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('--- SUPABASE TABLES (PUBLIC) ---');
    if (res.rows.length === 0) {
      console.log('No tables found in public schema.');
    } else {
      console.log(res.rows.map(r => r.table_name).join('\n'));
    }
  } catch (err) {
    console.error('Supabase Connection Error:', err.message);
  } finally {
    await client.end();
  }
}

inspect();

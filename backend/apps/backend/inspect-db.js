const { Client } = require('pg');
const Database = require('better-sqlite3');

async function run() {
  console.log('--- DATABASE INSPECTION ---');
  
  // 1. SQLite
  try {
    const db = new Database('./data/medusa-db.sqlite');
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('\n--- LOCAL SQLITE TABLES ---');
    console.log(tables.map(t => t.name).sort().join(', ') || 'No tables found.');
    db.close();
  } catch (e) {
    console.log('\n--- LOCAL SQLITE Error ---', e.message);
  }

  // 2. Supabase
  const client = new Client({
    connectionString: 'postgresql://postgres.hmphprybilzjdyaypgcy:ZWpg1WzeQU2pO4DT@db.hmphprybilzjdyaypgcy.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
    console.log('\n--- SUPABASE TABLES ---');
    console.log(res.rows.map(r => r.table_name).join(', ') || 'No tables found.');
  } catch (e) {
    console.log('\n--- SUPABASE Error ---', e.message);
  } finally {
    const timeout = setTimeout(() => {
        console.error('Timed out waiting to close connection');
        process.exit(1);
    }, 5000);
    await client.end();
    clearTimeout(timeout);
  }
}
run();

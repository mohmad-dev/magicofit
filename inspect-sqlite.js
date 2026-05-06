const Database = require('better-sqlite3');
const path = require('path');

function inspect() {
  const dbPath = path.join(__dirname, 'backend', 'apps', 'backend', 'data', 'medusa-db.sqlite');
  
  try {
    const db = new Database(dbPath);
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    
    console.log('--- LOCAL SQLITE TABLES ---');
    if (tables.length === 0) {
      console.log('No tables found.');
    } else {
      console.log(tables.map(t => t.name).sort().join('\n'));
    }
    db.close();
  } catch (err) {
    console.error('SQLite Error:', err.message);
  }
}

inspect();

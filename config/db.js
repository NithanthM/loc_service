const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost', 
  user: 'root', 
  password: 'root',
  database: 'rideally_stage',
  connectionLimit: 5
});

async function connectDatabase() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Connected to MariaDB!');
    
    // Example query
    //const rows = await conn.query('SELECT * FROM location_master');
    //console.log(rows);
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) conn.end(); // Close the connection
  }
}

connectDatabase();

module.exports = pool;
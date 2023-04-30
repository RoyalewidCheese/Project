const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mysqlpass',
    database: 'labstock',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  
  
  
  getUsers()
  
  async function getUsers() {
    let connection;
    try {
      // get a connection from the pool
      connection = await pool.getConnection();
  
      // execute the query
      const [rows, fields] = await connection.execute('SELECT * FROM users');
  
      // log the results
      console.log(rows);
      console.log(fields);
    } catch (err) {
      console.error(err);
    } finally {
      // release the connection back to the pool
      if (connection) {
        connection.release();
      }
    }
  }
  
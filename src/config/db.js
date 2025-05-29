const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, // Use port from .env
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection and log success or error
pool.promise().getConnection()
  .then(connection => {
    console.log('Successfully connected to Railway MySQL!');
    connection.release();
  })
  .catch(err => {
    console.error('Unable to connect to Railway MySQL:', err.message);
  });

module.exports = pool.promise();

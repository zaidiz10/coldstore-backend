const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, // Add port from .env
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

module.exports = db;

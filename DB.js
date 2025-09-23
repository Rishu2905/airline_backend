const mysql = require('mysql2');
require('dotenv').config(); // Load .env here too, if not loaded globally

const connection = mysql.createConnection({
  host: process.env.DB_HOST,      // from .env
  user: process.env.DB_USER,      // from .env
  password: process.env.DB_PASS,  // from .env
  database: process.env.DB_NAME,   // from .env
  port: process.env.PORT_NO
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err.message);
    return;
  }
  console.log('✅ Connected to MySQL database');
});

module.exports = connection;

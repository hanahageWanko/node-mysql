const mysql = require('mysql');
require('dotenv').config()

const DB = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

module.exports = DB;
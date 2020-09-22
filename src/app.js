const express = require('express');
const port = require('./port');
const DB = require('./mysql');
const app = express();

DB.connect( err => {
  if(err) console.error(err);
  console.log('Connected');
  // データベース作成
  DB.query(`CREATE DATABASE ${process.env.DB_NAME}`, (err, result) => {
    if(err) {
      // console.error(err);
      return;
    };
  })

  // テーブルの作成
  const createTableSql = `CREATE TABLE IF NOT EXISTS ${process.env.TABLE_NAME} (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL)`;
  DB.query(createTableSql, (err, result) => {
    if(err) console.error(err);
  });
  
  // user
  console.log('Get table');
  const selectTableSql = `SELECT * from ${process.env.TABLE_NAME}`;
  DB.query(selectTableSql, (err, result, fields) => {
    if(err) console.error(err);
    console.log(result);
  });
});

app.get('/', (req,res) => res.send('Hello World!!!!!!'));


app.listen(port, () => console.log(`Ecample app lestening on port'${port}!`));
import express from 'express';
import * as mysql from 'mysql';
require('dotenv').config();

const port:number = 3000;
const app = express();

export interface DB {
  host: string,
  user: string,
  password: string,
  database: string
}
const DB = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

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
  const createTableSql = ` CREATE TABLE IF NOT EXISTS ${process.env.TABLE_NAME} 
                           (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                           name VARCHAR(255) NOT NULL,
                           email VARCHAR(255) NOT NULL)
                         `;
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


// テーブルの中身を表示
app.get('/', (request, response) => {
  const sql = `select * from ${process.env.TABLE_NAME}`
  DB.query(sql, (err, result, fields) => {
    if(err) console.error(err);
    response.send(result);
    // res.send(fields);
  });
});
// データの挿入
// const insertSql = `INSERT INTO users(name, email) VALUES(?, ?)`;
// let insertData:object = ['max', 'qqq@qqq.jp']
// DB.query(insertSql, insertData, (err, result, fields) => {
//   if(err) console.error(err);
//   console.log(result);
// });


app.listen(port, () => console.log(`Ecample app lestening on port'${port}!`));
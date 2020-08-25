import express from 'express';
import path from 'path';
import mysql from 'mysql';
import bodyParser from 'body-parser';
require('dotenv').config();

/*********************************************
      グローバル定数の定義
*********************************************/
const port:number = 3000;
const app = express();


/*********************************************
      使用するDBを定義
*********************************************/
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

/*********************************************
      DB作成
*********************************************/
const dbCreate: () => void = () => {
  DB.query(`CREATE DATABASE ${process.env.DB_NAME}`, (err, result) => {
    if(err) return;
  })
};

/*********************************************
      テーブル作成
*********************************************/

const tableCreate: () => void = () => {
    // テーブルの作成
    const createTableSql = ` CREATE TABLE IF NOT EXISTS ${process.env.TABLE_NAME} 
                              (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                              name VARCHAR(255) NOT NULL,
                              email VARCHAR(255) NOT NULL)
                            `;
    DB.query(createTableSql, (err, result) => {
      if(err) console.error(err);
    });
}


/*********************************************
      テーブル内容取得
*********************************************/

const selectTable: () => void = () => {
  const selectTableSql = `SELECT * from ${process.env.TABLE_NAME}`;
  DB.query(selectTableSql, (err, result, fields) => {
    if(err) console.error(err);
  });
}


/*********************************************
      DBに接続
*********************************************/

DB.connect( err => {
  if(err) console.error(err); 
  dbCreate();
  tableCreate();
  selectTable();
});


/*********************************************
      ルート'/'に設定するファイルを設定
*********************************************/

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'html/index.html')));



/*********************************************
      フォームのボディをパースするミドルウェアを設定し、結果を配列で返す
*********************************************/

app.use(bodyParser.urlencoded({ extended: true }));

// テーブルの中身を表示
// app.get('/', (request, response) => {
//   const sql = `select * from ${process.env.TABLE_NAME}`
//   DB.query(sql, (err, result, fields) => {
//     if(err) console.error(err);
//     response.send(result);
//     // res.send(fields);
//   });
// });


// データの挿入
// const insertSql = `INSERT INTO users(name, email) VALUES(?, ?)`;
// let insertData:object = ['max', 'qqq@qqq.jp']
// DB.query(insertSql, insertData, (err, result, fields) => {
//   if(err) console.error(err);
//   console.log(result);
// });

/*********************************************
      指定したポートに結果を渡す
*********************************************/
app.listen(port, () => console.log(`Ecample app lestening on port'${port}!`));
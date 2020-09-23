import * as express from 'express';
import * as port from './port';
import * as DB from './mysql';
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
app.get('/', (req,res) => {
  const sql = `select * from ${process.env.TABLE_NAME}`
  DB.query(sql, (err, result, fields) => {
    if(err) console.error(err);
    res.send(result);
    // res.send(fields);
  });
});

// データの挿入


app.listen(port, () => console.log(`Ecample app lestening on port'${port}!`));
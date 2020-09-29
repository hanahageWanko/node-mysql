import express from 'express';
import path from 'path';
import mysql from 'mysql';
import bodyParser from 'body-parser';
const router = require('./router.ts');
require('dotenv').config();
// mysql.server start
// mysql -u root
/*********************************************
      グローバル定数の定義
*********************************************/
const port:number = 3000;
const app = express();


/*********************************************
      ejsの定義
*********************************************/
app.set('view engine', 'ejs');
app.use('/css', express.static('css'));
app.use("/", router);
// 指定したポートに結果を渡す
app.listen(port);


/*********************************************
      ルート'/'に設定するファイルを設定
*********************************************/

app.get('/list', (req, res) => {
  const sql = 'select * from users';
  DB.query(sql, (err, result, fields) => {
    if(err) {
      console.error(err);
      return;
    }
    res.render('list', {result});
  });
});

app.get('/edit/:id', (req, res) => {
  const sql = 'select * from users WHERE id = ?';
  DB.query(sql, [req.params.id], (err, result, fields) => {
    if(err) {
      console.error(err);
      return;
    }
    res.render('edit', {result});
  })
})



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
      フォームのボディをパースするミドルウェアを設定し、結果を配列で返す
*********************************************/

app.use(bodyParser.urlencoded({ extended: true }));


/*********************************************
      任意テーブルの任意カラムに任意のデータが存在するかをチェック
*********************************************/

const searchDB = (table: string, column: string, name: string, callback:any):void => {

  const searchSql = `SELECT EXISTS( SELECT * FROM ${table} WHERE ${column}='${name}')`;
  DB.query(searchSql, (err, result, fields) => {
    if(err) return callback(err);

    if(Object.values(result[0])[0] == 1) {
      callback(false,null);
    } else {
      callback(null,true);
    }
  });

}


/*********************************************
       POSTされた値をDBヘ挿入 & 表示
*********************************************/
app.post('/', (req, res) => {
  searchDB('users', 'name', `${req.body.name}`,function(err:any, result:any){
    if(result) {
      const insertSql:string = `INSERT INTO users(name,email) 
                          SELECT * FROM (select ?, ?) as tmp 
                          WHERE NOT EXISTS 
                          ( SELECT * FROM users WHERE name='${req.body.name}')`;
      DB.query(insertSql, [req.body.name, req.body.email], (err, result, fields) => {
        if(err) console.error(err);
        res.send("登録できました。");
      });
    } else {
      res.send("既に同じ名前が登録されています。別の名前を設定してください。");
    }
  });
});


app.post('/update/:id', (req, res) => {
  const sql = `UPDATE users SET ? WHERE id = ${req.params.id}`;
  console.log(sql);
  DB.query(sql, [req.body], (err, result, fields) => {
    console.log([req.body.name, req.body.email]);
    if(err) return;
    res.redirect('/');
  });
});


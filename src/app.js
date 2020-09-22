const express = require('express');
const port = require('./port');
const DB = require('./mysql');
const app = express();
const mysql = require('mysql')

DB.connect( err => {
  if(err) throw err;
  console.log('Connected');
  DB.query('CREATE DATABASE express_db', (err, result) => {
    if(err) throw err;
    console.log('database created');
  })
});

app.get('/', (req,res) => res.send('Hello World!!!!!!'));


app.listen(port, () => console.log(`Ecample app lestening on port'${port}!`));
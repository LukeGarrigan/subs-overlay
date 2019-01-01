const express = require('express');
const sql = require('mssql');

var app = express();
app.use(express.static('public'));

var server = app.listen(9999);



console.log("starting");

var config = {
  server: 'localhost',
  database: 'todone',
  user: 'programmer',
  password: 'test',
};
connect();



async function connect() {
  try {
    console.log("Connecting to db");
    await sql.connect(config);
    let value = 1;
    const result = await sql.query`select * from task where id = ${value}`
    console.dir(result)
  } catch (err) {
    // ... error checks
    console.log(err);
  }
}
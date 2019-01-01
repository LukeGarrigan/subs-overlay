const express = require('express');
const sql = require('mssql');
const socket = require('socket.io');

let app = express();
app.use(express.static('public'));

let server = app.listen(9999);


let io = socket(server);

io.sockets.on('connection', connectionMade);

console.log("starting");

var config = {
  server: 'localhost',
  database: 'suboverlay',
  user: 'programmer',
  password: 'test',
};


function connectionMade(socket) {
  console.log("Connected to client: " + socket);
  socket.on('updateSubs', updateSubs);

}



function updateSubs(subs) {
  console.log("Updating subs");

  for (let sub of subs) {

    let query = `select * from subs where username = '${sub.name}'`;
    let output = sql.query(query);

    output.then(result => {
      if (result.recordset[0] !== undefined) {
        console.log(sub.name);
      } else {
        createNewSub(sub);
      }

    }).catch(err => {
       console.log("errored for " + sub.name);
    });


  }


}


function createNewSub(sub) {
  console.log("Creating new sub " + sub.name);

  let query = `begin 
      if not exists (select * from subs
                      where username = '${sub.name}')
      begin
            insert into subs (username, experience, lvl) 
            values ('${sub.name}',0,1)            
      end
  end`;

  let output = sql.query(query);

  output.then(result => {
    console.log("succesfully added " + sub.name);
  }).catch(err => {
    console.log(err);
    console.log("error adding " + sub.name);
  });
}

sql.connect(config).then(() => {
  console.log("Connected to database");
});
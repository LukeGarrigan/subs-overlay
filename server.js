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
        let persistedSub = result.recordset[0];
        if (persistedSub.experience > sub.xp) {
          updateClientWithPersistedSub(persistedSub);
        } else {

          updatePersistedSub(sub);
        }
      } else {
        createNewSub(sub);
      }

    }).catch(err => {
       console.log("errored for " + sub.name);
    });

  }

}



function updateClientWithPersistedSub(persistedSub) {
  let returnSub = {
    name: persistedSub.username,
    xp: persistedSub.experience
  }
  console.log("Emmitting to client " + persistedSub.username);
  io.sockets.emit('getSub', returnSub);
}


function updatePersistedSub(sub) {
  let query = `update subs set experience = '${sub.xp}' where username = '${sub.name}'`;

  let result = sql.query(query);

  result.then(data => {

  }).catch(err => {
  });
}

function createNewSub(sub) {

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
  }).catch(err => {
    console.log(err);
    console.log("error adding " + sub.name);
  });
}

sql.connect(config).then(() => {
  console.log("Connected to database");
});
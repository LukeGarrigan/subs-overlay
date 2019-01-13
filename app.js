const twitchHandler = require('./twitchHandler.js')
const express = require('express');
const sql = require('mssql');
const socket = require('socket.io');

let app = express();
app.use(express.static('public'));

let server = app.listen(9999);
let subscribers = [];

let io = socket(server);
twitchHandler.setupTwitchHandler(subscribers, io, sql);


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
  subscribers = subs;
  twitchHandler.updateSubsForTwitchHandler(subscribers);
  for (let sub of subs) {


    let query = `select * from subs where username = '${sub.name}'`;
    let output = sql.query(query);

    output.then(result => {
      if (result.recordset[0] !== undefined) {
        let persistedSub = result.recordset[0];
        if (persistedSub.experience > sub.xp) {
          updateClientWithPersistedSub(persistedSub);
        } else if (sub.xp > persistedSub.experience) {
          twitchHandler.updatePersistedSub(sub, sql);
        }
      } else {
        twitchHandler.createNewSub(sub, sql);
      }

    }).catch(err => {
       console.log(err);
    });

  }

}

function updateClientWithPersistedSub(persistedSub) {
  let returnSub = {
    name: persistedSub.username,
    xp: persistedSub.experience,
    badge: persistedSub.time_subscribed,
    r: persistedSub.r,
    g: persistedSub.g,
    b: persistedSub.b,
  }
  console.log("Emmitting to client " + persistedSub.username);
  io.sockets.emit('getSub', returnSub);
}


sql.connect(config).then(() => {
  console.log("Connected to database");
});


function getLevel(exp) {
  return Math.ceil(0.04*Math.sqrt(exp));
}






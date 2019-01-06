const express = require('express');
const sql = require('mssql');
const socket = require('socket.io');
const tmi = require('tmi.js');
const myOptions = require('./api-options');

let app = express();
app.use(express.static('public'));

let server = app.listen(9999);
let subscribers = [];

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

  var client = new tmi.client(myOptions);
  client.connect();


  client.on("chat", function (channel, userstate, message, self) {

    if (message === "!flame blue"  || message === "!flame orange") {
      let username = userstate.username;
      let chosenColour = message.split(" ")[1];
      if (isSub(username)) {
        let colourChange =  {
          name: username,
          colour: chosenColour
        };
        socket.emit("changeFlame", colourChange);
      }

      client.whisper(username, "You have chosen a " + chosenColour + " flame");
    } else if (message === "!lvl" || message === "!level" || message === "!xp" || message === "!experience") {
      if (isSub(userstate.username)) {
        let sub = getSub(userstate.username);

        let output = "@" +userstate.username + " you are level " + getLevel(sub.xp) + " (" + sub.xp + "xp)" ;
        client.action("codeheir",output);
      }
    } else if (message === "!leaderboard") {
      subscribers.sort(function(first, second) {
        return second.xp - first.xp
      });

      let output = "1. " + subscribers[1].name + "\n"
                  + "2. " + subscribers[2].name + "\n"
                  + "3. " + subscribers[3].name + "\n";

      let username = userstate.username;
      if (isSub(username)) {
        for (let i = 4; i < subscribers.length; i++) {

          if (subscribers[i].name === username) {
            output += " (You are position " + i + ")";
          }
        }
      }
      client.say("codeheir", output)
    } else if (message.includes("!lvl") || message.includes("!xp") || message.includes("!level") || message.includes("!experience")) {
      let name = message.split(" ")[1];
      if (isSub(name)) {
        let sub = getSub(name);
        let output = sub.name + " is level " + getLevel(sub.xp) + " ("+sub.xp+")";
        client.say("codeheir", output);
      }
    }
  });
}

function isSub(username) {
  for (let sub of subscribers) {
    if (sub.name === username) {
      return true;
    }
  }
}


function getSub(username) {
  for (let sub of subscribers) {
    if (sub.name === username) {
      return sub;
    }
  }
}

function updateSubs(subs) {
  console.log("Updating subs");

  subscribers = subs;
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


function getLevel(exp) {
  return Math.ceil(0.04*Math.sqrt(exp));
}



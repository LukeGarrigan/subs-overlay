const myOptions = require('./api-options');
const tmi = require('tmi.js');

let subs = [];
exports.updateSubsForTwitchHandler = function (subscribers) {
  subs = subscribers;
}

exports.setupTwitchHandler = function(subscribers, io, sql) {
  subs = subscribers;
  let client = new tmi.client(myOptions);
  client.connect();

  client.on("chat", function (channel, userstate, message, self) {


    extractSubBadge(userstate, io, sql);






    if (message === "!flame blue" || message === "!flame orange") {
      let username = userstate.username;
      let chosenColour = message.split(" ")[1];
      if (isSub(username, subs)) {
        let colourChange = {
          name: username,
          colour: chosenColour
        };
        io.sockets.emit("changeFlame", colourChange);
      }
    } else if (message === "!lvl" || message === "!level" || message === "!xp" || message === "!experience") {
      if (isSub(userstate.username, subs)) {
        let sub = getSub(userstate.username, subs);

        let currentLevel = getLevel(sub.xp);
        let output = "@" + userstate.username + " you are level " + currentLevel + " (" + sub.xp + "/" +getXpOfNextLevel(currentLevel+1) +"xp)";
        client.action("codeheir", output);
      }
    } else if (message === "!leaderboard") {
      subs.sort(function (first, second) {
        return second.xp - first.xp
      });

      let output = "1. " + subs[1].name + "\n"
        + "2. " + subs[2].name + "\n"
        + "3. " + subs[3].name + "\n";

      let username = userstate.username;
      if (isSub(username, subs)) {
        for (let i = 4; i < subs.length; i++) {

          if (subs[i].name === username) {
            output += " (You are position " + i + ")";
          }
        }
      }
      client.say("codeheir", output)
    } else if (message.includes("!lvl") || message.includes("!xp") || message.includes("!level") || message.includes("!experience")) {
      let name = message.split(" ")[1];
      if (isSub(name, subs)) {
        let sub = getSub(name, subs);
        let currentLevel = getLevel(sub.xp);
        let output = sub.name + " is level " + currentLevel + " (" + sub.xp + "/" + getXpOfNextLevel(currentLevel+1) +")";
        client.say("codeheir", output);
      }
    }
  });
};


function extractSubBadge(userstate, io, sql) {

  let username = userstate.username;

  if (isSub(username,subs)) {
    let subscriberBadge = userstate.badges.subscriber;

    let dto = {
      username: username,
      badge: subscriberBadge
    }
    io.sockets.emit("updateSubscriberBadge", dto);


    let query = `update subs set time_subscribed = '${subscriberBadge}' where username = '${username}'`;
    let result = sql.query(query);


    result.then(data => {
      console.log("successfully updated players badge");
    }).catch(err => {

      console.log(err);
    });
  }
}

function isSub(username) {
  for (let sub of subs) {
    if (sub.name === username) {
      return true;
    }
  }
}


function getSub(username, subs) {
  for (let sub of subs) {
    if (sub.name === username) {
      return sub;
    }
  }
}


function getLevel(exp) {
  return Math.ceil(0.04*Math.sqrt(exp));
}

function getXpOfNextLevel(lvl) {
  return Math.pow(lvl /0.04, 2);
}


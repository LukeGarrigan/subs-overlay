const myOptions = require('./api-options');
const tmi = require('tmi.js');

let subs = [];
exports.updateSubsForTwitchHandler = function (subscribers) {
  subs = subscribers;
}

exports.setupTwitchHandler = function(subscribers) {
  subs = subscribers;
  let client = new tmi.client(myOptions);
  client.connect();

  client.on("chat", function (channel, userstate, message, self) {

    if (message === "!flame blue" || message === "!flame orange") {
      let username = userstate.username;
      let chosenColour = message.split(" ")[1];
      if (isSub(username, subs)) {
        let colourChange = {
          name: username,
          colour: chosenColour
        };
        socket.emit("changeFlame", colourChange);
      }

      client.whisper(username, "You have chosen a " + chosenColour + " flame");
    } else if (message === "!lvl" || message === "!level" || message === "!xp" || message === "!experience") {
      if (isSub(userstate.username, subs)) {
        let sub = getSub(userstate.username, subs);

        let output = "@" + userstate.username + " you are level " + getLevel(sub.xp) + " (" + sub.xp + "xp)";
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
        let output = sub.name + " is level " + getLevel(sub.xp) + " (" + sub.xp + ")";
        client.say("codeheir", output);
      }
    }
  });
};


function isSub(username, subs) {
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


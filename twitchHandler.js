const myOptions = require('./api-options');
const tmi = require('tmi.js');
const subModel = require('./models/sub.js')

let subs = [];
exports.updateSubsForTwitchHandler = function (subscribers) {
  subs = subscribers;
}

exports.setupTwitchHandler = function (subscribers, io, sql) {
  subs = subscribers;
  let client = new tmi.client(myOptions);
  client.connect();


  client.on("chat", function (channel, userstate, message, self) {
    extractSubBadge(userstate, io, sql);
    if (message === "!flame blue" || message === "!flame orange") {
      processFlameChange(userstate, message, io);
    } else if (message === "!lvl" || message === "!level" || message === "!xp" || message === "!experience") {
      if (isSub(userstate.username, subs)) {
        processRetrievePlayersLevel(userstate, client);
      }
    } else if (message === "!leaderboard") {
      outputLeaderboard(userstate, client);
    } else if (message.includes("!lvl") || message.includes("!xp") || message.includes("!level") || message.includes("!experience")) {
      let name = message.split(" ")[1];
      if (isSub(name, subs)) {
        getOtherPlayersLvl(name, client);
      }
    } else if (message.includes("!rank")) {
      processGettingOtherPlayersRank(message, client);
    } else if (message.includes("!compare")) {
      processComparingTwoPlayers(message, client, userstate.username);
    } else if (message.includes("!flame")) {
      processChangingPlayersFlame(message, client, userstate.username, io, sql);
    }
  });
};


function extractSubBadge(userstate, io, sql) {

  let username = userstate.username;

  if (isSub(username, subs)) {
    let subscriberBadge = userstate.badges.subscriber;

    let subscriberBadgeDto = {
      username: username,
      badge: subscriberBadge
    }
    io.sockets.emit("updateSubscriberBadge", subscriberBadgeDto);
    subModel.updateSubscriberBadgeByName(sql, subscriberBadgeDto);
  }
}

function processFlameChange(userstate, message, io) {
  let username = userstate.username;
  let chosenColour = message.split(" ")[1];
  if (isSub(username, subs)) {
    let colourChange = {
      name: username,
      colour: chosenColour
    };
    io.sockets.emit("changeFlame", colourChange);
  }
}


function processRetrievePlayersLevel(userstate, client) {
  let sub = getSub(userstate.username, subs);
  let currentLevel = getLevel(sub.xp);
  client.action("codeheir", `@ ${userstate.username} you are level ${currentLevel} (${sub.xp}/${getXpOfNextLevel(currentLevel + 1)} xp)`);
}



function outputLeaderboard(userstate, client) {
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
}



function getOtherPlayersLvl(name, client) {
  let sub = getSub(name, subs);
  let currentLevel = getLevel(sub.xp);
  let output = `${sub.name} is level ${currentLevel} (${sub.xp}/${getXpOfNextLevel(currentLevel + 1)})`;
  client.say("codeheir", output);
}


function processGettingOtherPlayersRank(message, client) {
  let name = message.split(" ")[1];
  if (isSub(name, subs)) {
    subs.sort(function (first, second) {
      return second.xp - first.xp
    });

    for (let i = 1; i < subs.length; i++) {
      if (subs[i].name === name) {
        client.say("codeheir", `${name} is rank ${i}`);
      }
    }
  }
}


function processComparingTwoPlayers(message, client, sayerName) {
  let name = message.split(" ")[1];
  name = name.toLowerCase();

  if (isSub(name) && isSub(sayerName)) {

    let sayersXp = getSub(sayerName).xp;
    let othersXp = getSub(name).xp;

    if (othersXp > sayersXp) {
      let difference = othersXp - sayersXp;

      client.say("codeheir", `@${sayerName}: ${name} has ${difference} more xp than you`);
    } else {

      let difference = sayersXp - othersXp;
      client.say("codeheir", `@${sayerName}: ${name} has ${difference} less xp than you`);
    }
  }


}

function isSub(username) {
  for (let sub of subs) {
    if (sub.name === username) {
      return true;
    }
  }
}


function processChangingPlayersFlame(message, client, username, io, sql) {
  if (isSub(username)) {
    let input = message.split(" ");
    let red = input[1];
    let green = input[2];
    let blue = input[3];

    let redNumber = parseInt(red);
    let greenNumber = parseInt(green);
    let blueNumber = parseInt(blue);

    if (!isNaN(redNumber) && !isNaN(greenNumber) && !isNaN(blueNumber)) {

      if (areValidColours(redNumber, greenNumber, blueNumber)) {
        let rgb = {
          r: redNumber,
          g: greenNumber,
          b: blueNumber,
          name: username
        }
        io.sockets.emit("changeFlameRGB", rgb);

        persistNewFlameColour(rgb, sql);


      }
    }
  }
}


exports.createNewSub = function(sub, sql) {
  subModel.createNewSub(sub, sql)
}

exports.updatePersistedSub = function(sub, sql) {
  subModel.updatePersistedSub(sub, sql);
}



function areValidColours(redNumber, greenNumber, blueNumber) {
  return redNumber >= 0 && redNumber <= 255 && greenNumber >= 0 && greenNumber <= 255 && blueNumber >= 0 && blueNumber <= 255;
}

function persistNewFlameColour(rgb, sql) {
  let query = `update subs set r=${rgb.r}, g=${rgb.g}, b=${rgb.b} where username ='${rgb.name}'`;

  let result = sql.query(query);

  result.then(data => {
    console.log("successfully updated players badge");
  }).catch(err => {
    console.log(err);
  });

}



function getSub(username) {
  for (let sub of subs) {
    if (sub.name === username) {
      return sub;
    }
  }
}


function getLevel(exp) {
  return Math.ceil(0.04 * Math.sqrt(exp));
}

function getXpOfNextLevel(lvl) {
  return Math.pow(lvl / 0.04, 2);
}



const STREAM_NAME = "codeheir";

function isSubCurrentlyActive(name, viewers) {
  for (let viewer of viewers) {
    if (name.toLowerCase() === viewer.toLowerCase()) {
      return true;
    }
  }
  return false;
}

function getCurrentViewersUrl() {
  return "https://cors.io/?http://tmi.twitch.tv/group/user/" + STREAM_NAME + "/chatters";
}


function updateCurrentViewers(json) {
  console.log("Successfully made get viewers api call");
  let viewers = json.chatters.viewers;
  viewers = viewers.concat(json.chatters.moderators);
  viewers = viewers.concat(json.chatters.vips);
  setMultiplier();

  let subs = [];
  for (let spaceship of spaceships) {
    if (!isSubCurrentlyActive(spaceship.name, viewers)) {
      spaceship.active = false;
    }
    let sub = {
      name: spaceship.name,
      xp : spaceship.xp,
      active: spaceship.active
    };
    subs.push(sub);
  }
  numberOfSubsViewing = spaceships.filter(ship => ship.active).length;

  socket.emit('updateSubs', subs);
}


function setMultiplier() {
  if (numberOfSubsViewing > 5) {
    multiplier = 3;
  } else if (numberOfSubsViewing > 3) {
    multiplier = 2;
  } else if (numberOfSubsViewing > 1) {
    multiplier = 1.5
  } else {
    multiplier = 1;
  }
}

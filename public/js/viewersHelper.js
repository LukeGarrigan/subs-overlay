
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

  numberOfViewers = viewers.length;
  let subs = [];
  for (let spaceship of spaceships) {
    if (isSubCurrentlyActive(spaceship.name, viewers)) {
      if (!spaceship.active) {
        console.log(spaceship.name +" is now watching!");
        spaceship.active = true;
      }
    } else {
      spaceship.active = false;
    }

    let sub = {
      name: spaceship.name,
      xp : spaceship.xp
    };

    subs.push(sub);
  }

  socket.emit('updateSubs', subs);
}


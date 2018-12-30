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
  return "https://tmi.twitch.tv/group/user/" + STREAM_NAME + "/chatters";
}

function updateCurrentViewers(json) {
  let viewers = json.chatters.viewers;
  viewers = viewers.concat(json.chatters.moderators);

  for (let spaceship of spaceships) {
    if (isSubCurrentlyActive(spaceship.name, viewers)) {
      spaceship.active = true;
    } else {
      spaceship.active = false;
    }
  }
}
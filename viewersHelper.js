const STREAM_NAME = "codeheir";

function isSubCurrentlyActive(name, viewers) {
  for (let viewer of viewers) {
    if (name === viewer) {
      return true;
    }
  }
  return false;
}

function getCurrentViewersUrl() {
  return "https://tmi.twitch.tv/group/user/" + STREAM_NAME + "/chatters";
}
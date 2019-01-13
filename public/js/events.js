function updateSubs(data) {
  for (let spaceship of spaceships) {
    if (data.name === spaceship.name) {
      spaceship.xp = data.xp;
      spaceship.ship = data.badge;

      if (data.r !== -1 || data.g !== -1 || data.b !== -1) {
        spaceship.r = data.r;
        spaceship.g = data.g;
        spaceship.b = data.b;
        spaceship.defaultColour = false;
      }
    }
  }
}

function changeFlame(data) {
  let name = data.name;
  let colour = data.colour;

  for (let spaceship of spaceships) {
    if (spaceship.name === name) {
      spaceship.changeFlame(colour);
      spaceship.defaultColour = true;
    }
  }
}

function updateSubscriberBadge(subscriberDto) {
  for (let spaceship of spaceships) {
    if (spaceship.name === subscriberDto.username) {
      spaceship.changeShip(subscriberDto.badge);
    }
  }

}

function changeFlameRGB(rgb) {
  for (let spaceship of spaceships) {
    if (spaceship.name === rgb.name) {

      spaceship.r = rgb.r;
      spaceship.g = rgb.g;
      spaceship.b = rgb.b;
      spaceship.defaultColour = false;
    }
  }
}
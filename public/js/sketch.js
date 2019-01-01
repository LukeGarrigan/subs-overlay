let spaceships = [];

const MAP_WIDTH = 700;
const MAP_HEIGHT = 700;
const NUM_SNOW_FLAKES = 200;

let subs = [];
let snows = [];
let apiViewersCount = 0;
function preload() {
  subs = loadStrings("subscribers.txt");
}

function setup() {
  createCanvas(370, 700);
  background(0);

  let bronzeSpaceship = loadImage("images/Bronze_ship.png");
  let silverSpaceship = loadImage("images/Silver_ship.png");
  let goldSpaceship = loadImage("images/Gold_ship.png");
  let diamondSpaceship = loadImage("images/Diamond_ship.png");
  for (let sub of subs) {
    let subscriberInfo = sub.split(',');
    let name = subscriberInfo[0];
    let dateSubbed = subscriberInfo[1];
    let date = Date.parse(dateSubbed);
    let spaceship;
    if (name === 'codeheir') {
      spaceship = new Spaceship(name, diamondSpaceship);
    } else if (Date.now() - date > (7776000000 * 2)) {
      spaceship = new Spaceship(name, goldSpaceship);
    } else if (Date.now() - date > 7776000000) {
      spaceship = new Spaceship(name, silverSpaceship);
    } else {
      spaceship = new Spaceship(name, bronzeSpaceship);
    }
    spaceships.push(spaceship);
  }
}

function draw() {
  background(0);
  apiViewersCount++;
  if (apiViewersCount % 200 === 0) {
    loadJSON(getCurrentViewersUrl(), updateCurrentViewers)
  }

  //clear();
  if (snows.length < NUM_SNOW_FLAKES) {
    if (random(1) < 0.25) {
      snows.push(new Snow());
    }
  }

  for (let ship of spaceships) {
    ship.update();
    ship.seperate(spaceships);
    ship.constrain();
    if (ship.isInViewOfScreen()) {
      ship.draw();
    }
  }

  for (let snow of snows) {
    snow.update();
    snow.draw();
  }
  displayMembersCount();
}







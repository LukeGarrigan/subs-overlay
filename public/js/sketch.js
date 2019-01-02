let spaceships = [];

const LEVEL_TWO = 1000;
const LEVEL_THREE = 3000;
const LEVEL_FOUR = 6000;
const LEVEL_FIVE = 10000;


const MAP_WIDTH = 700;
const MAP_HEIGHT = 700;
const NUM_ORES = 100;

let subs = [];
let ores = [];
let apiViewersCount = 0;
let socket;
let numberOfViewers = 0;
function preload() {
  subs = loadStrings("subscribers.txt");
}

function setup() {
  createCanvas(370, 700);
  background(0);

  socket = io.connect("http://localhost:9999");
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

  socket.on('getSub', updateSubs);


  for (let i = 0; i < NUM_ORES; i++) {
    let ore = new Ore();
    ores.push(ore);
  }


}

function draw() {
  // background(0);
  clear();
  apiViewersCount++;
  if (apiViewersCount % 200 === 0) {
    loadJSON(getCurrentViewersUrl(), updateCurrentViewers)
  }


  for (let ship of spaceships) {
    ship.update();
    ship.seperate(spaceships);
    ship.constrain();
    if (ship.isInViewOfScreen()) {
      ship.draw();
    }
  }

  for (let ore of ores) {
    ore.display();
  }

  for (let ship of spaceships) {
    for (let ore of ores) {
      if (dist(ship.position.x, ship.position.y, ore.x, ore.y) < (ore.radius+20)) {
        ore.respawn();
        ship.mined();
      }
    }
  }
  displayMembersCount();
}

function updateSubs(data) {
  for (let spaceship of spaceships) {
    if (data.name === spaceship.name) {
      spaceship.xp = data.xp;
    }
  }
}






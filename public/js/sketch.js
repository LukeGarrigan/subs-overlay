let spaceships = [];



const MAP_WIDTH = 500;
const MAP_HEIGHT = 700;
const NUM_ORES = 100;

let subs = [];
let ores = [];
let apiViewersCount = 0;
let socket;
let numberOfSubsViewing = 0;
let multiplier = 1;
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

    spaceship = new Spaceship(name, bronzeSpaceship, silverSpaceship);
    spaceships.push(spaceship);
  }

  loadJSON(getCurrentViewersUrl(), updateCurrentViewers);
  socket.on('getSub', updateSubs);
  socket.on('changeFlame', changeFlame);
  socket.on('updateSubscriberBadge', updateSubscriberBadge);
  socket.on('changeFlameRGB', changeFlameRGB);
  socket.on('updateSubNowActive', updateSubNowActive);


  for (let i = 0; i < NUM_ORES; i++) {
    let ore = new Ore();
    ores.push(ore);
  }

}


function draw() {
  background(0);
  // clear();
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

    for (let ore of ores) {
      if (dist(ship.position.x, ship.position.y, ore.x, ore.y) < (ore.radius+20)) {
        ore.respawn();
        ship.mined();
      }
      ore.display();
    }
  }
  displayMembersCount();
  displayMultiplier();
}




function displayMultiplier() {
  push();
  textAlign(CENTER);
  fill(100, 255, 100);
  textSize(20);
  text(`x${multiplier} xp`, width-60, height-50);
  textSize(15);
  text(`(${numberOfSubsViewing} active subs)`,  width-60, height-20);
  pop();
}


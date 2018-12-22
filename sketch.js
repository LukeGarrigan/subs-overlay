let spaceships = [];

const MAP_WIDTH = 700;
const MAP_HEIGHT = 700;
let subs;
function preload() {
  subs = loadStrings("subscribers.txt");
}
function setup() {
  createCanvas(400, 400);
  background(200);
  let spaceshipImage = loadImage("images/spaceship.png");




  for (let i = 0; i < subs.length; i++) {
    let spaceship = new Spaceship(subs[i],spaceshipImage);
    spaceships.push(spaceship);
  }
}



function draw() {
  background(200);

  for (let ship of spaceships) {
    ship.update();
    ship.seperate(spaceships);
    ship.constrain();
    ship.draw();

  }

}





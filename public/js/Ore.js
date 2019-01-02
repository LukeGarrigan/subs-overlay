class Ore {

  constructor() {
    this.radius = 5;
    this.respawn();
  }


  display() {
    fill(100);
    ellipse(this.x, this.y, this.radius, this.radius);
  }


  respawn() {
    this.x = random(MAP_WIDTH);
    this.y = random(MAP_HEIGHT);
  }

}

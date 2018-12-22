function Spaceship(name, spaceship) {

  this.spaceshipImage = spaceship;
  this.name = name;
  this.x = random(MAP_WIDTH / 2);
  this.y = random(MAP_HEIGHT / 2);

  this.acceleration = createVector(0, 0);
  this.velocity = p5.Vector.random2D();
  this.position = createVector(this.x, this.y);

  this.padding = 50;

  this.update = function () {
    this.velocity.limit(1);
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
  };


  this.draw = function () {
    fill(0);
    noStroke();
    imageMode(CENTER);
    fill(0);

    push();
    translate(this.position.x, this.position.y);
    let radians = atan2(this.velocity.y, this.velocity.x);
    rotate(radians-PI);
    image(this.spaceshipImage,0, 0, this.spaceshipImage.width*0.8, this.spaceshipImage.height*0.8);
    pop();



    push();
    stroke(100);
    beginShape();
    noFill();
    vertex(this.position.x-8, this.position.y-37);
    vertex(this.position.x, this.position.y-50);
    vertex(this.position.x+40, this.position.y-50);
    endShape();
    pop();

    text(this.name, this.position.x + 45, this.position.y-47);
  };



  this.constrain = function () {
    if (this.position.x < -this.padding) {
      this.position.x = MAP_WIDTH;
    } else if (this.position.x > MAP_WIDTH + this.padding) {
      this.position.x = 0;
    }
    if (this.position.y < -this.padding) {
      this.position.y = MAP_HEIGHT;
    } else if (this.position.y > MAP_HEIGHT + this.padding) {
      this.position.y = 0;
    }
  };


  this.seperate = function (ships) {
    let steer = createVector(0,0);
    let numberOfCloseShips = 0;
    for (let ship of ships) {
      if (ship !== this) {
        let distanceToOtherShip = dist(this.position.x, this.position.y, ship.position.x, ship.position.y);
        if (distanceToOtherShip < 60) {
          numberOfCloseShips++;
          let difference = p5.Vector.sub(this.position, ship.position);
          difference.normalize();
          difference.div(distanceToOtherShip);
          steer.add(difference);
        }
      }
    }

    if (numberOfCloseShips > 0) {
      steer.div(numberOfCloseShips);
    }

    if (steer.mag() > 0) {
      steer.normalize();
      steer.sub(this.velocity);
      steer.limit(0.001);
      this.acceleration.add(steer);
    }

  }



}
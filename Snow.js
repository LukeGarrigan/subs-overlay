class Snow {
  constructor() {

    this.x = random(width);
    this.y = random(-100, -90);

    this.velocity = createVector();
    this.acceleration = createVector(0, 0.005);
    this.position = createVector(this.x, this.y);

    this.radius = random(0, 7);

    this.xOffset = random(-0.1, 0.1);
    this.alpha = random(100, 255);


  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.radius*2);
    this.position.add(this.velocity);

    this.position.x += this.xOffset;
    if (this.position.y > height + this.radius || this.position.x > width + this.radius || this.position.x < 0 - this.radius) {
      this.reset();
    }

  }

  reset() {
    this.x = random(width);
    this.y = random(-100, -90);
    this.position = createVector(this.x, this.y);
    this.velocity = createVector();
  }

  draw() {
    push();
    fill(255, this.alpha);
    ellipse(this.position.x, this.position.y, this.radius, this.radius);
    pop();
  }
}
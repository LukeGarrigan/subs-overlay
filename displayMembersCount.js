function displayMembersCount() {
  push();
  fill(255);
  textAlign(CENTER);
  textSize(15);
  text(subs.length +" current members", width/2 , height-20);
  pop();
}
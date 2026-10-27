let prevX = 400;
let prevY = 400;
let posX = 0;
let posY = 0;
let time = 0;
let lines = [];
let goalOrigin = 0;
let goalTopLeft = 0;
let goalBottomRight = 0;
let goalTopRight = 0;
let circlePosition;
let circleVelocity;
let circleAcceleration;
let gravity = 0.1;
let drag = 0.9985;
let goals = [];
let goalColor = 0;
let colorStart;
let fadeProgress = 0;
let fail = 0;
let linesDrawn = 0;
let streak = 0;

function setup() {
  createCanvas(800, 800);
  resetGame();
}

function draw() {
  background(64, 85, 222);

  if (fail != 1 && fadeProgress < 1) {
    background(64, 85, 222);
    time += 1;
    // Ai was used from here
    push();
    noStroke();
    fill(0);
    text("Lines: " + linesDrawn, 10, 15);
    text("Streak: " + streak, 10, 30);
    pop();
    // to here mostly becuase of the pop and push things
    strokeWeight(4);

    if (lines.length > 12) {
      lines = lines.slice(4);
    }

    if (
      circlePosition.x < goalOrigin.x &&
      circlePosition.x > goalBottomRight.x &&
      circlePosition.y < goalOrigin.y &&
      circlePosition.y > goalTopLeft.y
    ) {
      fadeProgress = constrain(fadeProgress, 0, 1);
      fadeProgress += 0.01;
      if (fadeProgress >= 1) {
        streak += 1;
      }
      colorStart = color(64, 85, 222);
      let colorEnd = color("#128726");
      goalColor = lerpColor(colorStart, colorEnd, fadeProgress);
      console.log("detect");
      console.log(fadeProgress);
    } else {
      goalColor = color(64, 85, 222);
      fadeProgress = 0;
    }

    strokeWeight(0);
    fill(goalColor);
    rect(goalTopRight.x, goalTopRight.y - 2, 60, 30);
    fill(64, 85, 222);
    strokeWeight(4);

    circleVelocity.add(circleAcceleration);
    circleVelocity.mult(drag);
    circleVelocity.limit(9);
    circlePosition.add(circleVelocity);
    circle(circlePosition.x, circlePosition.y, 20);

    for (let t = 0; t < goals.length; t += 4) {
      line(goals[t], goals[t + 1], goals[t + 2], goals[t + 3]);
      let p3 = createVector(goals[t], goals[t + 1]);
      let p4 = createVector(goals[t + 2], goals[t + 3]);
      collideLine(p3, p4);
    }

    for (let l = 0; l < lines.length; l += 4) {
      line(lines[l], lines[l + 1], lines[l + 2], lines[l + 3]);
      let p1 = createVector(lines[l], lines[l + 1]);
      let p2 = createVector(lines[l + 2], lines[l + 3]);
      collideLine(p1, p2);
    }

    if (
      circlePosition.y > 800 ||
      circlePosition.x > 800 ||
      circlePosition.x < 0
    ) {
      circlePosition.y = 0;
      circlePosition.x = random(20, 780);
      circleVelocity.set(0, 0);
      fail = 1;
    }

    if (mouseIsPressed === true && dist(posX, posY, mouseX, mouseY) >= 5) {
      line(posX, posY, mouseX, mouseY);
      let p1 = createVector(posX, posY);
      let p2 = createVector(mouseX, mouseY);
      collideLine(p1, p2);
    }
  } else if (fail === 1) {
    fill(0);
    background(222, 61, 61);
    text("Game Over", 350, 350);
    text("Lines drawn: " + linesDrawn, 350, 390);
    text("Streak: 0", 350, 410);
    text("Click to Restart", 350, 450);
  } else if (fadeProgress >= 1) {
    fill(0);
    background(64, 209, 157);
    text("You Win! Click to Restart", 330, 370);
    text("Lines drawn: " + linesDrawn, 330, 400);
    text("Streak: " + streak, 330, 420);
  }
}

function mousePressed() {
  posX = round(mouseX);
  posY = round(mouseY);
}

function mouseReleased() {
  prevX = round(mouseX);
  prevY = round(mouseY);

  if (fail === 1 || fadeProgress >= 1) {
    resetGame();
    // I used ai for the return function
    return;
  }

  if (dist(posX, posY, prevX, prevY) < 5) {
    return;
  }

  lines.push(posX, posY, prevX, prevY);
  linesDrawn += 1;
  posX = mouseX;
  posY = mouseY;
}

function collideLine(p1, p2) {
  let wall = p5.Vector.sub(p2, p1);
  // I used ai for below line
  if (wall.magSq() === 0) return;

  let toCircle = p5.Vector.sub(circlePosition, p1);

  let distanceTo = toCircle.dot(wall) / wall.dot(wall);
  distanceTo = constrain(distanceTo, 0, 1);

  let closest = p5.Vector.add(p1, p5.Vector.mult(wall, distanceTo));

  if (p5.Vector.dist(circlePosition, closest) < 10) {
    let normalVec = p5.Vector.sub(circlePosition, closest);
    normalVec.normalize();

    circleVelocity.reflect(normalVec);
    circlePosition = p5.Vector.add(closest, p5.Vector.mult(normalVec, 10));
  }
}
function createGoal() {
  goalOrigin = createVector(round(random(80, 720)), 700);
  goalTopLeft = createVector(goalOrigin.x, goalOrigin.y - 30);
  goalBottomRight = createVector(goalOrigin.x - 60, goalOrigin.y);
  goalTopRight = createVector(goalOrigin.x - 60, goalOrigin.y - 30);

  line(goalOrigin.x, goalOrigin.y, goalTopLeft.x, goalTopLeft.y);
  line(goalOrigin.x, goalOrigin.y, goalBottomRight.x, goalBottomRight.y);
  line(goalBottomRight.x, goalBottomRight.y, goalTopRight.x, goalTopRight.y);

  goals.push(goalOrigin.x, goalOrigin.y, goalTopLeft.x, goalTopLeft.y);
  goals.push(goalOrigin.x, goalOrigin.y, goalBottomRight.x, goalBottomRight.y);
  goals.push(
    goalBottomRight.x,
    goalBottomRight.y,
    goalTopRight.x,
    goalTopRight.y
  );
}

function resetGame() {
  time = 0;
  lines = [];
  goals = [];
  fadeProgress = 0;
  fail = 0;
  goalColor = color("#ffffff");
  linesDrawn = 0;

  createGoal();

  circlePosition = createVector(random(30, 770), 0);
  circleVelocity = createVector(0, 0);
  circleAcceleration = createVector(0, gravity);
}

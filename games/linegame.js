// DISCLAIMER
// AI was used in this sketch, I think I said so whenever it was though
// This code is not perfect, I know of multiple errors at the moment that would be more work
// to fix than the times that they actually appear. There might be some that could be fixed with
// like 2 lines of code or are redundant, so look out.
// sometimes (the collision logic) AI did not write the code, just helped me understand the concept, so im not counting it :)

let posX = 0;
let posY = 0;
let lines = [];
let goalOrigin = 0;
let goalTopLeft = 0;
let goalBottomRight = 0;
let goalTopRight = 0;
let circlePosition;
let circleVelocity;
let circleAcceleration;
let gravity = 0.45;
let drag = 0.999998;
let goals = [];
let goalColor = 0;
let colorStart;
let fadeProgress = 0;
let fail = 0;
let linesDrawn = 0;
let streak = 0;
let selectScreen = 1;
let dotted = 1;

function setup() {
  createCanvas(800, 800);
  textSize(15);
  resetGame();
}

function draw() {
  if (selectScreen === 1) {
    fill(0);
    
// level selection screen
    
    background("#004080");
    text("Choose mode", 350, 350);
    text("Easy mode: w", 350, 390);
    text("Hard mode: d", 350, 410);
    text("Impossible: a", 350, 450);

    if (keyIsDown("w")) {
      gravity = 0.35;
      drag = 0.998;
      selectScreen = 0;
      dotted = 1;
      resetGame();
    }

    if (keyIsDown("d")) {
      gravity = 0.45;
      drag = 0.999998;
      selectScreen = 0;
      resetGame();
      dotted = 0;
    }

    if (keyIsDown("a")) {
      gravity = 0.55;
      drag = 1;
      selectScreen = 0;
      resetGame()
      dotted = 2;
    }
  }

  // Triggers every time the win or fail detection is not running
  if (fail != 1 && fadeProgress < 1 && selectScreen != 1) {
    background(64, 85, 222);
    // Ai was used from here
    push();
    noStroke();
    fill(0);
    text("Lines: " + linesDrawn, 10, 15);
    text("Streak: " + streak, 10, 30);
    pop();
    // to here mostly becuase of the pop and push things
    strokeWeight(4);

    // makes sure that there is only 1 line at a time to make the game harder

    if (lines.length > 1) {
      lines = lines.slice(1);
    }

    // collision detection for the rectangle, which lives in the goal

    if (
      circlePosition.x < goalOrigin.x &&
      circlePosition.x > goalBottomRight.x &&
      circlePosition.y < goalOrigin.y &&
      circlePosition.y > goalTopLeft.y
    ) {
      fadeProgress += 0.01;
      if (fadeProgress >= 1) {
        streak += 1;
      }
      colorStart = color(64, 85, 222);
      let colorEnd = color("#128726");
      // makes the color slowly change to green when the ball is in the goal
      goalColor = lerpColor(colorStart, colorEnd, fadeProgress);
    } else {
      goalColor = color(64, 85, 222);
      // resets the color change if the ball leaves the goal
      fadeProgress = 0;
    }

    // actually draws the rectangle that colors the goal, I used to have it in the above code but was redundant

    strokeWeight(0);
    fill(goalColor);
    rect(goalTopRight.x, goalTopRight.y - 2, 60, 30);
    fill(64, 85, 222);
    strokeWeight(4);

    // ball gravity and movement logic

    circleVelocity.add(circleAcceleration);
    circleVelocity.mult(drag);
    circleVelocity.limit(9);
    circlePosition.add(circleVelocity);
    circle(circlePosition.x, circlePosition.y, 20);

    // code for drawing the goal, I just used the same as the lines becuase it works fine

    for (let t = 0; t < goals.length; t += 4) {
      line(goals[t], goals[t + 1], goals[t + 2], goals[t + 3]);
      let p3 = createVector(goals[t], goals[t + 1]);
      let p4 = createVector(goals[t + 2], goals[t + 3]);
      collideLine(p3, p4);
    }

    // code for drawing the lines, this used to be needed because I had multiple lines at a time, but now there can only be 2 and this only ever draws one of them. I know that some people will think it is to hard and want more lines so just left this

    for (let l = 0; l < lines.length; l ++) {
      line(lines[l][0], lines[l][1], lines[l][2], lines[l][3]);
      let p1 = createVector(lines[l][0], lines[l][1]);
      let p2 = createVector(lines[l][2], lines[l][3]);
      collideLine(p1, p2);
    }

    // resets the ball's pos and velocity if it goes off the screen and triggers the fail detection.

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

    // makes a line while the mouse is pressed and does collision. I removed this becuase I wanted a dotted line instead but this is the code that I wrote

    if(dotted === 1){
    if (mouseIsPressed === true && dist(posX, posY, mouseX, mouseY) >= 5) {
      line(posX, posY, mouseX, mouseY);
      let p1 = createVector(posX, posY);
      let p2 = createVector(mouseX, mouseY);
      collideLine(p1, p2);
    }
    }
    // THIS WAS WRITTEN BY AN LLM
    // I just wanted a quick solution for the dotted line cuz I didn't have much time. probly could have made it on my own anyway tho
  if(dotted === 0){
    if (mouseIsPressed === true && dist(posX, posY, mouseX, mouseY) >= 5) {
      drawingContext.setLineDash([8, 8]); // 8px on, 8px off
      line(posX, posY, mouseX, mouseY);
      drawingContext.setLineDash([]); // back to solid for everything else
      let p1 = createVector(posX, posY);
      let p2 = createVector(mouseX, mouseY);
    }
  }
    // end of LLM

    // what happens when ball moves off of the screen meaning fail
  } else if (fail === 1) {
    fill(0);
    background(222, 61, 61);
    text("Game Over", 350, 350);
    text("Lines drawn: " + linesDrawn, 350, 390);
    text("Streak: 0", 350, 410);
    text("Click to Restart", 350, 450);
    text("r to select level", 350, 370)
    streak = 0;

// resets everything and back to level selection screen
    
    if(keyIsDown('r')){
      gravity = 0;
      drag = 0;
      selectScreen = 1;
      dotted = 1;
    }

    // triggers when the ball stays in the goal for long enough to win
  } else if (fadeProgress >= 1) {
    fill(0);
    text("You Win! Click to Restart", 330, 370);
    text("Lines drawn: " + linesDrawn, 330, 400);
    text("Streak: " + streak, 330, 420);
  }
}

// sets the first pos for the line(s) to be pushed to lines[]

function mousePressed() {
  posX = round(mouseX);
  posY = round(mouseY);
}

// sets the second pos and pushes, overiden when the line is a dot or pretty small cuz it draws errors and, like I said at the top, the fix was wayy to complex so not worth it. also resets the game when you click

function mouseReleased() {
  let prevX = round(mouseX);
  let prevY = round(mouseY);

  if (fail === 1 || fadeProgress >= 1) {
    resetGame();
    // I used ai for the below return functions because I had no idea how to do return
    return;
  }

  if (dist(posX, posY, prevX, prevY) < 5) {
    return;
  }

  if(dotted === 2){
     if (abs(prevY - posY) < 20) {
      return;
    }
  }
  // pushes line to the array

  lines.push([posX, posY, prevX, prevY]);
  linesDrawn += 1;
}

// collision logic, this took me wayyy to long

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

// makes a random goal and pushes the lines to an array to be drawn later

function createGoal() {
  goalOrigin = createVector(round(random(80, 720)), 700);
  goalTopLeft = createVector(goalOrigin.x, goalOrigin.y - 30);
  goalBottomRight = createVector(goalOrigin.x - 60, goalOrigin.y);
  goalTopRight = createVector(goalOrigin.x - 60, goalOrigin.y - 30);

  goals.push(goalOrigin.x, goalOrigin.y, goalTopLeft.x, goalTopLeft.y);
  goals.push(goalOrigin.x, goalOrigin.y, goalBottomRight.x, goalBottomRight.y);
  goals.push(
    goalBottomRight.x,
    goalBottomRight.y,
    goalTopRight.x,
    goalTopRight.y
  );
}

// pretty self explanitory, called like 4 times so I couldn't be bothered to write it up there and just made it a function

function resetGame() {
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

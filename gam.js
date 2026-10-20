let rectLeft = 0;
let rectRight = 0;
let rectY = 0;
let ballX = 400;
let ballY = 0;
let score = 0;
let health = 3;
let speedX = 5;

let highScore = localStorage.getItem("highScore", 0);

function setup() {
  createCanvas(800, 800);
}

function draw() {
  background(75, 62, 217);

  if (score > highScore){
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }

  if (health >= 1) {
    ballY += speedX;
    stroke("aliceblue");
    strokeWeight(3);
    fill(212, 72, 22);
    circle(ballX, ballY, 50);

    if (ballY < 780 && ballY > 673 && ballX < rectLeft && ballX > rectRight) {
      ballY -= ballY;
      score += 1;
      speedX += 0.3;
      ballX = random(50, 750);
    }

    if (ballY > 800) {
      ballY -= ballY;
      ballX = random(50, 750);
      health -= 1;
    }

    fill(0);
    rect(mouseX - 50, 700, 100, 30);

    strokeWeight(0);
    textSize(20);

    text("Score: " + str(score), 20, 20);
    text("Health: " + str(health), 20, 45);
    text("High Score: " + str(highScore), 20, 70);
    rectRight = mouseX - 80;
    rectLeft = mouseX + 70;

    if (ballY > 800) {
      ballY -= 800;
    }

    if (speedX > 30) {
      speedX = 40;
    }
  } else {
    background(75, 62, 217);
    text("Game Over", 350, 350);
    text(("High Score: ") + str(highScore), 350, 390)
    text("Click to Restart", 350, 430)
    score -= score;
    if (mouseIsPressed === true) {
      health = 3;
      speedX = 4;
    }
  }
}

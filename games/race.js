let racerXs = [30, 30, 30, 67, 20];
let startY = 50;
let yStep = 60;
let finishX = 560;
let leading = 0;
let restart = 0;

function setup() {
  createCanvas(600, startY + yStep * racerXs.length);
}

function draw() {

    if(restart === 0) {
        background(240);
            leading = leadingPos(racerXs)
            for (let i = 0; i < racerXs.length; i++) {
            if (racerXs[i] === leading) {
            leading = i + 1;
            }
        }
        text("leading racer: racer " + leading, 10, 10);
        line(finishX, 0, finishX, height);
        for (let i = 0; i < racerXs.length; i++) {
            let y = startY + yStep * i;
            if (racerXs[i] < finishX) {
            racerXs[i] += random(1, 3);
            }
            circle(racerXs[i], y, 24);
        }

        if(mouseIsPressed) {
        restart = 1;
        }
    }
    else if (restart === 1) {
        for (let i = 0; i < racerXs.length; i++) {
        racerXs[i] = random(30, 50);
     }
        restart = 0;
    }
}

function leadingPos(xList) {
    let first = 0;
    for(let i = 0; i < xList.length; i++){
    if(xList[i] > first) {
       first = xList[i]
    }
  }
  return first
}
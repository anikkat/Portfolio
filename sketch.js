window.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    e.preventDefault();
  }
});

let userArray = [];
let newCanvas;
let canvas;
let hasInteracted = false;
let lastTap = 0;
const isMobile = /Mobi|Android/i.test(navigator.userAgent);

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.parent(document.body);
  canvas.style("position", "fixed");
  canvas.style("top", "0");
  canvas.style("left", "0");
  canvas.style("z-index", "9999");
  canvas.style("pointer-events", "auto");

  newCanvas = createGraphics(width, height);
  initializeNewCanvas();
}

function initializeNewCanvas() {
  newCanvas.clear();

  newCanvas.push();
  newCanvas.noStroke();
  newCanvas.fill(0, 0, 255);
  newCanvas.rect(0, 0, width, height);
  newCanvas.pop();

  newCanvas.push();
  newCanvas.noFill();
  newCanvas.stroke(255);
  newCanvas.strokeWeight(1);
  newCanvas.rect(50, 50, width - 100, height - 100);
  newCanvas.line(50, 50, width - 50, height - 50);
  newCanvas.line(width - 50, 50, 50, height - 50);
  newCanvas.pop();

  let mobile = isMobile;

  let instruction;
  if (mobile) {
    instruction =
      '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8"/>\n<meta name="viewport" content="width=device-width,\ninitial-scale=1.0"/>\n<title>Katarina Anik</title>\n<link rel="stylesheet" href="styles.css"/>\n</head>\n<body>\n<h1>Freelance graphic designer captivated by motion,\nwith an evolving curiosity for creative coding.</h1>\n</body>\n</html>\n\nTouch and drag to dissolve this layer,\ndouble tap for full interactivity.';
  } else {
    instruction =
      '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8"/>\n<meta name="viewport" content="width=device-width,\ninitial-scale=1.0"/>\n<title>Katarina Anik</title>\n<link rel="stylesheet" href="styles.css"/>\n</head>\n<body>\n<h1>Freelance graphic designer captivated by motion,\nwith an evolving curiosity for creative coding.</h1>\n</body>\n</html>\n\nClick and drag to dissolve this layer,\ndouble click for full interactivity.';
  }

  // Text properties.
  newCanvas.textFont("Hanken Grotesk");
  newCanvas.textSize(12);
  newCanvas.textStyle(NORMAL);

  let lines = instruction.split("\n");
  let maxLineWidth = 0;
  for (let i = 0; i < lines.length; i++) {
    let w = newCanvas.textWidth(lines[i]);
    if (w > maxLineWidth) {
      maxLineWidth = w;
    }
  }
  let lineHeight = newCanvas.textAscent() + newCanvas.textDescent();
  let totalHeight = lines.length * lineHeight;
  let padding = 10;
  let rectW = maxLineWidth + 2 * padding;
  let rectH = totalHeight + 2 * padding;
  let rectX = width / 2 - rectW / 2;
  let rectY = height / 2 - rectH / 2;

  newCanvas.push();
  newCanvas.fill(0, 0, 255);
  newCanvas.stroke(255);
  newCanvas.strokeWeight(1);
  newCanvas.rect(rectX, rectY, rectW, rectH);
  newCanvas.pop();

  newCanvas.push();
  newCanvas.fill(255);
  newCanvas.noStroke();
  newCanvas.textAlign(LEFT, TOP);
  for (let i = 0; i < lines.length; i++) {
    newCanvas.text(lines[i], rectX + padding, rectY + padding + i * lineHeight);
  }
  newCanvas.pop();
}

function draw() {
  clear();

  if (hasInteracted) {
    if (mouseIsPressed) {
      for (let i = 0; i < userArray.length; i++) {
        userArray[i].x += random(-12, 12);
        userArray[i].y += random(-12, 12);
        newCanvas.push();
        newCanvas.erase();
        newCanvas.noStroke();
        newCanvas.rect(userArray[i].x, userArray[i].y, 9, 9);
        newCanvas.noErase();
        newCanvas.pop();
      }
    } else {
      newCanvas.push();
      newCanvas.erase();
      newCanvas.noStroke();
      newCanvas.rect(mouseX, mouseY, 9, 9);
      newCanvas.noErase();
      newCanvas.pop();
    }
  }

  image(newCanvas, 0, 0);
}

function mouseMoved() {
  if (!hasInteracted) {
    hasInteracted = true;
  }
  userArray.push({ x: mouseX, y: mouseY });
}

function doubleClicked() {
  newCanvas.clear();
  userArray = [];
  hasInteracted = false;
  if (isMobile) {
    canvas.hide();
  } else {
    canvas.elt.style.pointerEvents = "none";
  }
}

function touchEnded(event) {
  const now = millis();
  if (now - lastTap < 300) {
    doubleClicked();
  }
  lastTap = now;
  if (!isMobile) {
    event.preventDefault();
    return false;
  }
}

function touchStarted() {
  if (isMobile && canvas.elt.style.display === "none") return;
  hasInteracted = true;
  userArray.push({ x: mouseX, y: mouseY });
  return false;
}

function touchMoved() {
  if (isMobile && canvas.elt.style.display === "none") return;
  userArray.push({ x: mouseX, y: mouseY });
  return false;
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  newCanvas = createGraphics(width, height);
  initializeNewCanvas();
  userArray = [];
}

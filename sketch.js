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
let hasCleared = false;
const isMobile = /Mobi|Android/i.test(navigator.userAgent);
const CLEAR_THRESHOLD_DESKTOP = 0.6;
const CLEAR_THRESHOLD_MOBILE = 0.95;

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.parent(document.body);
  canvas.style("position", "fixed");
  canvas.style("top", "0");
  canvas.style("left", "0");
  canvas.style("z-index", "9999");
  canvas.style("pointer-events", "auto");

  background(0);

  newCanvas = createGraphics(width, height);
  newCanvas.background(0);
  initializeNewCanvas();

  document.documentElement.classList.remove("block");
  document.body.classList.remove("block");
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
      '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8"/>\n<meta name="viewport" content="width=device-width,\ninitial-scale=1.0"/>\n<title>Katarina Anik</title>\n<link rel="stylesheet" href="styles.css"/>\n</head>\n<body>\n<h1>Freelance graphic designer captivated by motion,\nwith an evolving curiosity for creative coding.</h1>\n</body>\n</html>\n\nTouch and drag to dissolve and reveal.';
  } else {
    instruction =
      '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8"/>\n<meta name="viewport" content="width=device-width,\ninitial-scale=1.0"/>\n<title>Katarina Anik</title>\n<link rel="stylesheet" href="styles.css"/>\n</head>\n<body>\n<h1>Freelance graphic designer captivated by motion,\nwith an evolving curiosity for creative coding.</h1>\n</body>\n</html>\n\nClick and drag to dissolve and reveal.';
  }

  newCanvas.textFont("Hanken Grotesk");
  newCanvas.textSize(12);
  newCanvas.textStyle(NORMAL);

  let lines = instruction.split("\n");
  let maxLineWidth = 0;
  for (let i = 0; i < lines.length; i++) {
    let w = newCanvas.textWidth(lines[i]);
    if (w > maxLineWidth) maxLineWidth = w;
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
      for (let pt of userArray) {
        pt.x += random(-12, 12);
        pt.y += random(-12, 12);
        newCanvas.push();
        newCanvas.erase();
        newCanvas.noStroke();
        newCanvas.rect(pt.x, pt.y, 9, 9);
        newCanvas.noErase();
        newCanvas.pop();
      }
    } else if (isMobile) {
      newCanvas.push();
      newCanvas.erase();
      newCanvas.noStroke();
      newCanvas.rect(mouseX, mouseY, 9, 9);
      newCanvas.noErase();
      newCanvas.pop();
    }
  }

  image(newCanvas, 0, 0);

  if (!hasCleared) {
    newCanvas.loadPixels();
    const pix = newCanvas.pixels;
    const total = pix.length / 4;
    let erased = 0;
    for (let i = 3; i < pix.length; i += 4) {
      if (pix[i] === 0) erased++;
    }
    const threshold = isMobile
      ? CLEAR_THRESHOLD_MOBILE
      : CLEAR_THRESHOLD_DESKTOP;
    if (erased / total >= threshold) {
      hasCleared = true;
      canvas.elt.style.pointerEvents = "none";
    }
  }
}

function mouseMoved() {
  if (!isMobile) return;
  if (!hasInteracted) hasInteracted = true;
  userArray.push({ x: mouseX, y: mouseY });
}

function mouseDragged() {
  if (isMobile) return;
  if (!hasInteracted) hasInteracted = true;
  userArray.push({ x: mouseX, y: mouseY });
  return false;
}

function doubleClicked() {
  newCanvas.clear();
  userArray = [];
  hasInteracted = false;
  hasCleared = true;
  canvas.elt.style.pointerEvents = "none";
}

function touchEnded(event) {
  const now = millis();
  if (now - lastTap < 300) doubleClicked();
  lastTap = now;
  if (!isMobile) {
    event.preventDefault();
    return false;
  }
}

function touchStarted() {
  if (isMobile && !hasCleared) {
    hasInteracted = true;
    userArray.push({ x: mouseX, y: mouseY });
    return false;
  }
}

function touchMoved() {
  if (isMobile && !hasCleared) {
    userArray.push({ x: mouseX, y: mouseY });
    return false;
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  newCanvas.clear();
}
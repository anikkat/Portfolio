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
const CLEAR_THRESHOLD_DESKTOP = 0.7;
const CLEAR_THRESHOLD_MOBILE = 0.85;

let clickCount = 0;
let lastClickTimeDesktop = 0;
let tapCount = 0;
let lastTapTime = 0;

let dragDidMove = false;

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.parent(document.body);

  if (!isMobile) {
    canvas.elt.addEventListener("mousedown", () => {
      dragDidMove = false;
    });
  }

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

  const M = 35;
  newCanvas.push();
  newCanvas.noFill();
  newCanvas.stroke(255);
  newCanvas.strokeWeight(1);
  newCanvas.rect(M, M, width - 2 * M, height - 2 * M);
  newCanvas.line(M, M, width - M, height - M);
  newCanvas.line(width - M, M, M, height - M);
  newCanvas.pop();

  let mobile = isMobile;
  let instruction;
  if (mobile) {
    instruction =
      '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8"/>\n<meta name="viewport" content="width=device-width,\ninitial-scale=1.0"/>\n<title>Katarina Anik</title>\n<link rel="stylesheet" href="styles.css"/>\n</head>\n<body>\n<h1>Freelance graphic designer captivated by motion,\nwith an evolving curiosity for creative coding.</h1>\n</body>\n</html>\n\nTouch and drag to dissolve/reveal,\nor triple tap for immediate disappointment.';
  } else {
    instruction =
      '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8"/>\n<meta name="viewport" content="width=device-width,\ninitial-scale=1.0"/>\n<title>Katarina Anik</title>\n<link rel="stylesheet" href="styles.css"/>\n</head>\n<body>\n<h1>Freelance graphic designer captivated by motion,\nwith an evolving curiosity for creative coding.</h1>\n</body>\n</html>\n\nClick and drag to dissolve/reveal,\nor triple click for immediate disappointment.';
  }

  newCanvas.textFont("New Times Roman, serif");
  newCanvas.textSize(12);
  newCanvas.textStyle(NORMAL);

  let lines = instruction.split("\n");
  if (lines[lines.length - 1].trim() === "") {
    lines.pop();
  }

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
  // desktop drag detected
  dragDidMove = true;
  if (!hasInteracted) hasInteracted = true;
  userArray.push({ x: mouseX, y: mouseY });
  return false;
}

function mouseClicked() {
  // desktop: ignore clicks after a drag
  if (!isMobile && dragDidMove) {
    dragDidMove = false;
    return;
  }

  const now = millis();
  if (now - lastClickTimeDesktop < 300) {
    clickCount++;
  } else {
    clickCount = 1;
  }
  lastClickTimeDesktop = now;

  if (clickCount === 3) {
    newCanvas.clear();
    userArray = [];
    hasInteracted = false;
    hasCleared = true;
    canvas.elt.style.pointerEvents = "none";
    clickCount = 0;
  }
}

function touchEnded(event) {
  const now = millis();
  if (now - lastTapTime < 300) {
    tapCount++;
  } else {
    tapCount = 1;
  }
  lastTapTime = now;
  if (tapCount >= 3) {
    newCanvas.clear();
    userArray = [];
    hasInteracted = false;
    hasCleared = true;
    canvas.elt.style.pointerEvents = "none";
    tapCount = 0;
  }
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

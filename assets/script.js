"use-strict";

/*  Love Saroha
    lovesaroha1994@gmail.com (email address)
    https://www.lovesaroha.com (website)
    https://github.com/lovesaroha  (github)
*/

// Themes.
const themes = ["#5468e7", "#e94c2b"];

// Choose random color theme.
let colorTheme = themes[Math.floor(Math.random() * themes.length)];

// This function set random color theme.
function setTheme() {
  // Change css values.
  document.documentElement.style.setProperty("--primary", colorTheme);
}

// Set random theme.
setTheme();

// Get canvas info from DOM.
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// Score defined.
let score = 0;
let maxScore = 0;
let asteroids = [];
let missiles = [];

// Ship.
let ship = { x: 250, y: 250, angle: 0, rotate: 0, velocity: { x: 0, y: 0 }, move: false };

// This function show ship on canvas.
function showShip() {
  ctx.save();
  ctx.translate(ship.x, ship.y - 10);
  ctx.rotate(ship.angle * Math.PI / 180);
  ctx.translate(-(ship.x), -(ship.y - 10));
  ctx.fillStyle = colorTheme;
  ctx.textAlign = 'center';
  ctx.font = '400 46px "Font Awesome 5 Pro"';
  ctx.fillText("\uf2ec", ship.x, ship.y);
  ctx.restore();
}

// This function move ship.
function moveShip() {
  // Apply rotation.
  ship.angle += ship.rotate;
  if (ship.move) {
    // Find velocity in direction of rotation.
    ship.velocity.x = Math.cos((ship.angle - 90) * Math.PI / 180);
    ship.velocity.y = Math.sin((ship.angle - 90) * Math.PI / 180);
  }
  ship.x += (ship.velocity.x * 2);
  ship.y += (ship.velocity.y * 2);
  // Check if ship cross edges.
  if (ship.x > 500) {
    ship.x = 0;
  }
  if (ship.x < 0) {
    ship.x = 500;
  }
  if (ship.y > 500) {
    ship.y = 0;
  }
  if (ship.y < 0) {
    ship.y = 500;
  }
}

// Asteroids structure defined.
class AsteroidObject {
  constructor(x, y, size, velocity) {
    if (x && y && size && velocity) {
      // Set given values.
      this.x = x;
      this.y = y;
      this.velocity = velocity;
      this.size = size;
    } else {
      // Set random values.
      this.x = Math.floor(Math.random() * 800);
      this.y = Math.floor(Math.random() * 800);
      this.size = Math.floor(Math.random() * 60) + 30;
      this.velocity = {
        x: ((Math.random() * 2) - 1) * (Math.floor(Math.random() * 2) + 1), y: ((Math.random() * 2) - 1) * (Math.floor(Math.random() * 2) + 1)
      }
    }
  }

  // This function show asteroid on canvas.
  show() {
    ctx.font = `300 ${this.size}px "Font Awesome 5 Pro"`;
    ctx.fillStyle = colorTheme;
    ctx.textAlign = 'center';
    ctx.fillText("\uf335", this.x, this.y);
  }

  // This function move asteroids.
  move() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    // Check if asteroid cross edges.
    if (this.x > 500) {
      this.x = 0;
    }
    if (this.x < 0) {
      this.x = 500;
    }
    if (this.y > 500) {
      this.y = 0;
    }
    if (this.y < 0) {
      this.y = 500;
    }
  }
}

// This function create asteroids.
function createAsteroids() {
  for (let i = 0; i < 5; i++) {
    asteroids.push(new AsteroidObject());
  }
}
createAsteroids();

// Missile object defined.
class MissileObject {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    // Find velocity in direction of rotation.
    this.velocity = { x: Math.cos((angle - 90) * Math.PI / 180), y: Math.sin((angle - 90) * Math.PI / 180) };
  }

  // This function moves missile in given direction.
  move() {
    this.x += this.velocity.x * 20;
    this.y += this.velocity.y * 20;
  }

  // This function show missle in canvas.
  show() {
    ctx.beginPath();
    ctx.fillStyle = colorTheme;
    ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    ctx.fill();
  }
}

// This function show score.
function showScore() {
  document.getElementById("score_id").innerHTML = score;
  document.getElementById("maxScore_id").innerHTML = maxScore;
}

// This function reset game.
function resetGame() {
  ship = { x: 250, y: 250, angle: 0, rotate: 0, velocity: { x: 0, y: 0 }, move: false };
  asteroids = [];
  createAsteroids();
  score = 0;
  showScore();
  draw();
}

// Draw function defined.
function draw() {
  ctx.globalCompositeOperation = 'destination-over';
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move ship.
  moveShip();

  // Show ship on canvas.
  showShip();

  if (asteroids.length < 9) {
    // Add new asteroid.
    asteroids.push(new AsteroidObject());
  }

  // Move and show asteroids on canvas.
  for (let i = asteroids.length - 1; i >= 0; i--) {
    if (ship.x < asteroids[i].x + (asteroids[i].size / 2) && ship.x > asteroids[i].x - (asteroids[i].size / 2) && ship.y < asteroids[i].y + (asteroids[i].size / 2) && ship.y > asteroids[i].y - (asteroids[i].size / 2)) {
      // Ship hit asteroid.
      resetGame();
      return;
    }
    asteroids[i].show();
    asteroids[i].move();
  }

  // Move and show missiles on canvas.
  for (let i = missiles.length - 1; i >= 0; i--) {
    missiles[i].move();
    missiles[i].show();
    if (missiles[i].y < 0 || missiles[i].y > 500 || missiles[i].x < 0 || missiles[i].x > 500) {
      // Remove missile.
      missiles.splice(i, 1);
      break;
    }
    for (let j = asteroids.length - 1; j >= 0; j--) {
      let asteroid = { x: asteroids[j].x, y: asteroids[j].y, size: asteroids[j].size / 2, velocity: asteroids[j].velocity };
      if (missiles[i].x < asteroids[j].x + (asteroids[j].size / 2) && missiles[i].x > asteroids[j].x - (asteroids[j].size / 2) && missiles[i].y < asteroids[j].y + (asteroids[j].size / 2) && missiles[i].y > asteroids[j].y - (asteroids[j].size / 2)) {
        // Missile hit asteroid.
        asteroids.splice(j, 1);
        if (asteroid.size > 30) {
          // Split asteroid if size more than 30.
          asteroids.push(new AsteroidObject(asteroid.x, asteroid.y, asteroid.size, asteroid.velocity));
          asteroids.push(new AsteroidObject(asteroid.x, asteroid.y, asteroid.size, { x: asteroid.velocity.x * -1, y: asteroid.velocity.y }));
        } else {
          // Update and show score.
          score++;
          if (score > maxScore) {
            // Update new max score.
            maxScore = score;
          }
          showScore();
        }
        // Remove missile.
        missiles.splice(i, 1);
        break;
      }
    }
  }
  window.requestAnimationFrame(draw);
}

draw();

// Windows key down event.
window.addEventListener("keydown", function (e) {
  e.preventDefault();
  if (e.key == "ArrowLeft") {
    // Rotate ship left.
    ship.rotate = -5;
  }
  if (e.key == "ArrowRight") {
    // Rotate ship right.
    ship.rotate = 5;
  }
  if (e.key == "ArrowUp") {
    // Move ship.
    ship.move = true;
  }
  if (e.key == " ") {
    // Fire missile.
    missiles.push(new MissileObject(ship.x, ship.y, ship.angle));
  }
});

// Windows key up event.
window.addEventListener("keyup", function (e) {
  e.preventDefault();
  if (e.key == "ArrowLeft" || e.key == "ArrowRight") {
    // Stop rotation
    ship.rotate = 0;
  }
  if (e.key == "ArrowUp") {
    // Stop ship movement.
    ship.move = false;
    ship.velocity = { x: 0, y: 0 };
  }
});
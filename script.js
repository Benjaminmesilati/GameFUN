const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Pac-Man object with starting position and movement properties
let pacman = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 15,
  angle: 0,
  speed: 2,
  dx: 2,
  dy: 0
};

// Handle arrow key input to change direction
document.addEventListener('keydown', function(e) {
  switch(e.key) {
    case 'ArrowUp':
      pacman.dx = 0;
      pacman.dy = -pacman.speed;
      break;
    case 'ArrowDown':
      pacman.dx = 0;
      pacman.dy = pacman.speed;
      break;
    case 'ArrowLeft':
      pacman.dx = -pacman.speed;
      pacman.dy = 0;
      pacman.angle = Math.PI; // face left
      break;
    case 'ArrowRight':
      pacman.dx = pacman.speed;
      pacman.dy = 0;
      pacman.angle = 0; // face right
      break;
  }
});

// Draw Pac-Man with a simple mouth opening effect
function drawPacman() {
  const startAngle = pacman.angle + 0.25 * Math.PI;
  const endAngle = pacman.angle + 1.75 * Math.PI;
  ctx.beginPath();
  ctx.moveTo(pacman.x, pacman.y);
  ctx.arc(pacman.x, pacman.y, pacman.radius, startAngle, endAngle, false);
  ctx.fillStyle = 'yellow';
  ctx.fill();
  ctx.closePath();
}

// Update Pac-Man's position and wrap around the screen edges
function update() {
  pacman.x += pacman.dx;
  pacman.y += pacman.dy;
  
  // Wrap around horizontally
  if (pacman.x - pacman.radius > canvas.width) pacman.x = -pacman.radius;
  if (pacman.x + pacman.radius < 0) pacman.x = canvas.width + pacman.radius;
  
  // Wrap around vertically
  if (pacman.y - pacman.radius > canvas.height) pacman.y = -pacman.radius;
  if (pacman.y + pacman.radius < 0) pacman.y = canvas.height + pacman.radius;
}

// Main game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  drawPacman();
  requestAnimationFrame(gameLoop);
}

gameLoop();

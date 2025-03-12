// Get DOM elements
const menu = document.getElementById('menu');
const startBtn = document.getElementById('startGame');
const colorPicker = document.getElementById('playerColor');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let bird = {
  x: 50,
  y: canvas.height / 2,
  radius: 15,
  velocity: 0,
  gravity: 0.5,
  jumpStrength: -10,
  color: "#FFFF00" // default color: yellow
};

let pipes = [];
const pipeWidth = 50;
const pipeGap = 150; // gap between top and bottom pipes
const pipeSpeed = 2;
let frame = 0;
let animationFrameId = null;

// Listen for key press (space) to make the bird jump
document.addEventListener('keydown', function(e) {
  if (e.code === 'Space') {
    bird.velocity = bird.jumpStrength;
  }
});

// Create a new pair of pipes with a randomized gap position
function createPipe() {
  const minPipeHeight = 50;
  const maxPipeHeight = canvas.height - pipeGap - minPipeHeight;
  const topPipeHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;
  
  // Top pipe
  pipes.push({
    x: canvas.width,
    y: 0,
    width: pipeWidth,
    height: topPipeHeight
  });
  
  // Bottom pipe
  pipes.push({
    x: canvas.width,
    y: topPipeHeight + pipeGap,
    width: pipeWidth,
    height: canvas.height - (topPipeHeight + pipeGap)
  });
}

// Update game objects: bird movement and pipe positions
function update() {
  frame++;
  
  // Apply gravity to bird and update position
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;
  
  // Create new pipes every 90 frames
  if (frame % 90 === 0) {
    createPipe();
  }
  
  // Move pipes to the left and remove off-screen pipes
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].x -= pipeSpeed;
    if (pipes[i].x + pipeWidth < 0) {
      pipes.splice(i, 1);
    }
  }
}

// Check for collisions with pipes or canvas boundaries
function checkCollision() {
  // Collision with top or bottom boundaries
  if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
    return true;
  }
  
  // Collision with any pipe
  for (let pipe of pipes) {
    if (
      bird.x + bird.radius > pipe.x &&
      bird.x - bird.radius < pipe.x + pipe.width &&
      bird.y + bird.radius > pipe.y &&
      bird.y - bird.radius < pipe.y + pipe.height
    ) {
      return true;
    }
  }
  return false;
}

// Draw bird and pipes on the canvas
function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw the bird
  ctx.fillStyle = bird.color;
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw the pipes
  ctx.fillStyle = "green";
  for (let pipe of pipes) {
    ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
  }
}

// Main game loop
function gameLoop() {
  update();
  draw();
  
  if (checkCollision()) {
    cancelAnimationFrame(animationFrameId);
    alert("Game Over!");
    // Reset game state
    resetGame();
  } else {
    animationFrameId = requestAnimationFrame(gameLoop);
  }
}

// Reset game to initial state
function resetGame() {
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  pipes = [];
  frame = 0;
  // Show the menu again
  canvas.style.display = 'none';
  menu.style.display = 'block';
}

// Start game on button click
startBtn.addEventListener('click', () => {
  // Set bird color based on user selection
  bird.color = colorPicker.value;
  
  // Hide the menu and show the game canvas
  menu.style.display = 'none';
  canvas.style.display = 'block';
  
  // Reset game variables
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  pipes = [];
  frame = 0;
  
  // Start the game loop
  animationFrameId = requestAnimationFrame(gameLoop);
});

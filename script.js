const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Bird properties
let bird = {
  x: 50,
  y: canvas.height / 2,
  radius: 15,
  velocity: 0,
  gravity: 0.5,
  jumpStrength: -10,
};

// Pipe properties
let pipes = [];
const pipeWidth = 50;
const pipeGap = 150; // gap between the top and bottom pipes
const pipeSpeed = 2;
let frame = 0;

// Listen for the space key to trigger a jump
document.addEventListener('keydown', function(e) {
  if (e.code === 'Space') {
    bird.velocity = bird.jumpStrength;
  }
});

// Function to create a new pair of pipes
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

// Update game objects
function update() {
  frame++;
  
  // Apply gravity to bird and update its position
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;
  
  // Create new pipes at regular intervals
  if (frame % 90 === 0) {
    createPipe();
  }
  
  // Move pipes to the left and remove offscreen pipes
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].x -= pipeSpeed;
    if (pipes[i].x + pipeWidth < 0) {
      pipes.splice(i, 1);
    }
  }
}

// Check for collisions with pipes or the canvas boundaries
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

// Draw the bird and pipes on the canvas
function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw the bird
  ctx.fillStyle = "yellow";
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
    alert("Game Over!");
    // Reset game state
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    frame = 0;
  } else {
    requestAnimationFrame(gameLoop);
  }
}

gameLoop();

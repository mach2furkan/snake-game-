console.log("Let's Start The Snake Game... - Furkan Askin");

let snake = [{ top: 200, left: 200 }];
let direction = { key: "ArrowRight", dx: 20, dy: 0 };
let food = null;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0; // Retrieve high score from local storage or set it to 0
let speed = 500;

window.addEventListener("keydown", (e) => {
  const newDirection = getDirection(e.key);
  console.log("Key Pressed:", e.key);
  const allowedChange = Math.abs(direction.dx) !== Math.abs(newDirection.dx);
  if (allowedChange) direction = newDirection;
});

function getDirection(key) {
  switch (key) {
    case "ArrowUp":
    case "w":
      return { key, dx: 0, dy: -20 };
    case "ArrowDown":
    case "s":
      return { key, dx: 0, dy: 20 };
    case "ArrowLeft":
    case "a":
      return { key, dx: -20, dy: 0 };
    case "ArrowRight":
    case "d":
      return { key, dx: 20, dy: 0 };
    default:
      return direction;
  }
}

function moveSnake() {
  const head = { ...snake[0] };
  head.top += direction.dy;
  head.left += direction.dx;
  snake.unshift(head);

  // Wrap snake position to the other side if it goes out of bounds
  if (snake[0].top < 0) snake[0].top = 380;
  if (snake[0].left < 0) snake[0].left = 380;
  if (snake[0].top > 380) snake[0].top = 0;
  if (snake[0].left > 380) snake[0].left = 0;

  if (!eatFood()) snake.pop(); // Remove the tail if no food is eaten
}

function randomFood() {
  food = {
    top: Math.floor(Math.random() * 20) * 20,
    left: Math.floor(Math.random() * 20) * 20,
  };
}

function eatFood() {
  if (snake[0].top === food.top && snake[0].left === food.left) {
    food = null;
    return true;
  }
  return false;
}

function gameOver() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].top === snake[0].top && snake[i].left === snake[0].left) {
      return true;
    }
  }
  return false;
}

function updateScore() {
  document.getElementById("score").innerText = "Score: " + score;
  document.getElementById("high-score").innerText = "High Score: " + highScore;
}

function gameLoop() {
  if (gameOver()) {
    alert("Game over!");
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore); // Store the new high score in local storage
    }
    resetGame();
  }

  setTimeout(() => {
    document.getElementById("game-board").innerHTML = "";
    moveSnake();
    if (!food) {
      randomFood();
      score += 2;
      speed = Math.max(50, speed - 5); // Ensure speed doesn't go below 50ms
    }
    if (eatFood()) {
      document.getElementById("score").innerText = `Score: ${score}`;
    }
    updateScore();
    drawSnake();
    drawFood();
    gameLoop();
  }, speed);
}

function resetGame() {
  score = 0;
  speed = 500;
  snake = [{ top: 200, left: 200 }];
  direction = { key: "ArrowRight", dx: 20, dy: 0 };
  food = null;
  randomFood();
}

function drawSnake() {
  snake.forEach((segment, index) => {
    const snakeElement = document.createElement("div");
    snakeElement.style.top = `${segment.top}px`;
    snakeElement.style.left = `${segment.left}px`;
    snakeElement.classList.add("snake");
    if (index === 0) snakeElement.classList.add("head");
    document.getElementById("game-board").appendChild(snakeElement);
  });
}

function drawFood() {
  const foodElement = document.createElement("div");
  foodElement.style.top = `${food.top}px`;
  foodElement.style.left = `${food.left}px`;
  foodElement.classList.add("food");
  document.getElementById("game-board").appendChild(foodElement);
}

drawSnake();
randomFood();
gameLoop();

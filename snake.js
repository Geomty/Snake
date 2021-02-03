// Hey there, I actually decided to put comments in my code for once :)

// Creating the user changable variables
var grid = variables.grid;
var frameRate = variables.frameRate;
var snakeColor = variables.snakeColor;
var foodColor = variables.foodColor;

// Creating canvas and context variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Writing the start text
ctx.fillStyle = "white";
ctx.font = "30px Arial";
ctx.textAlign = "center";
ctx.fillText("Press the button below to begin!", canvas.width/2, canvas.height/2);

// Calculating the length of one square on the grid
var squareSize = canvas.width/grid;

// Pretty self explanatory, I don't like having to include ctx.fill() and ctx.stroke() every time I want to draw a square
function drawSquare(x, y, size, fillColor, strokeColor) {
    ctx.beginPath();
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.rect(x, y, size, size);
    ctx.fill();
    ctx.stroke();
}

// How much the snake's coordinates will be adding by each time, as well as the length
var snakeX = squareSize, snakeY = 0;
var snakeLength = 5;
// The direction the snake is going
var snakeDirection = "right";

var snakeArray = []; // This array stores the x and y positions of each unit square of the snake
// Creating the initial positions of the snake
for (i = 0; i < snakeLength; i++) {
    snakeArray[i] = {x: Math.floor(grid/2*squareSize) - (i*squareSize), y: Math.floor(grid/2*squareSize)};
}

// Creating the food at a random location
var food = {x: Math.round(Math.random()*(canvas.width-squareSize)/squareSize)*squareSize, y: Math.round(Math.random()*(canvas.height-squareSize)/squareSize)*squareSize};
// What to do in case the food is in the snake
for (i = 0; i < snakeArray.length; i++) {
    if (food.x == snakeArray[i].x && food.y == snakeArray[i].y) {
        // I set the coordinates to 0 and not another random position because there is a chance the food will randomly go in another part of the snake again
        food = {x: 0, y: 0};
    }
}

// Keeping track of the score
var score = 0;

// What to do in case a key is pressed
function keyDownHandler(event) {
    // Changing the snake's directions, only if the game loop is running
    if (isGameRunning) {
        if(event.keyCode == "37" && snakeDirection != "right") {
            snakeDirection = "left";
            snakeX = -(squareSize);
            snakeY = 0;
        } else if (event.keyCode == "38" && snakeDirection != "down") {
            snakeDirection = "up";
            snakeX = 0;
            snakeY = -(squareSize);
        } else if (event.keyCode == "39" && snakeDirection != "left") {
            snakeDirection = "right"
            snakeX = squareSize;
            snakeY = 0;
        } else if (event.keyCode == "40" && snakeDirection != "up") {
            snakeDirection = "down";
            snakeX = 0;
            snakeY = squareSize;
        }
    }
}

// This function draws each frame based on variables changed in the next function
function draw() {
    // Resetting the canvas and getting it ready for the next frame
    drawSquare(0, 0, canvas.width, "black", "black");

    // Actually drawing the snake on the canvas based on the positions stored in the snakeArray
    for (i = 0; i < snakeArray.length; i++) {
        drawSquare(snakeArray[i].x, snakeArray[i].y, squareSize, snakeColor, "black");
    }

    // Drawing the food
    drawSquare(food.x, food.y, squareSize, foodColor, "black");
}

// This function changes variables if needed for the next frame
function update() {
    // Creating the new snake's head
    const head = {x: snakeArray[0].x + snakeX, y: snakeArray[0].y + snakeY};
    // Adding the new head to the beginning of the snake
    snakeArray.unshift(head);
    snakeArray.pop();

    // Detecting if the snake has hit the edge
    if (snakeArray[0].x < 0 || snakeArray[0].y < 0 || snakeArray[0].x > canvas.width || snakeArray[0].y > canvas.height) {
        // Restarting the game
        stopGame();
    }

    // Detecting if the snake has hit itself
    for (i = 1; i < snakeArray.length; i++) {
        if (snakeArray[0].x == snakeArray[i].x && snakeArray[0].y == snakeArray[i].y) {
            stopGame();
        }
    }

    // Detecting if the snake has ate the food
    if (snakeArray[0].x == food.x && snakeArray[0].y == food.y) {
        // Resetting the food's position
        food = {x: Math.round(Math.random()*(canvas.width-squareSize)/squareSize)*squareSize, y: Math.round(Math.random()*(canvas.height-squareSize)/squareSize)*squareSize};
        for (i = 0; i < snakeArray.length; i++) {
            if (food.x == snakeArray[i].x && food.y == snakeArray[i].y) {
                food = {x: 0, y: 0};
            }
        }
        // Growing the snake
        snakeArray[snakeArray.length] = {x: snakeArray[snakeArray.length-1] + snakeX, y: snakeArray[snakeArray.length-1] + snakeY};
        // Updating the score
        score++;
        document.getElementById("scoretext").innerHTML = `Score: ${score}`;
    }
}

// The core game loop
function gameLoop() {
    draw();
    update();
}

// Creating the interval variable
var interval;
// Creating the variable that keeps track if the game is running
var isGameRunning;
// Starting the game
function startGame() {
    // Making the button dissapear
    document.getElementById("button").style += ";display:none";
    // Making the score appear
    document.getElementById("scoretext").innerHTML = `Score: ${score}`;
    // Setting the interval for the game loop
    interval = setInterval(gameLoop, 1000/frameRate);
    // Making the isGameRunning variable true, since the game is now running
    isGameRunning = true;
}

// Stopping the game
function stopGame() {
    // Resetting the snake's variables
    snakeX = squareSize, snakeY = 0;
    snakeDirection = "right";
    var currentLength = snakeArray.length;
    for (i = 0; i < currentLength; i++) {
        snakeArray[i] = {x: Math.floor(grid/2*squareSize) - (i*squareSize), y: Math.floor(grid/2*squareSize)};
    }
    snakeArray.splice(snakeLength, snakeArray.length);

    // Resetting the score
    score = 0;
    document.getElementById("scoretext").innerHTML = "";

    // Resetting the canvas
    drawSquare(0, 0, canvas.width, "black", "black");
    // For some reason the function only fills the square with green no matter what color I input so I have to set the fill color again here
    ctx.fillStyle = "black";
    ctx.fill();
    // Writing the text
    ctx.fillStyle = "red";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText("You died!", canvas.width/2, canvas.height/2);

    // Showing the button again
    document.getElementById("button").innerHTML = "Click here to restart";
    document.getElementById("button").style = "font-size:30px";

    isGameRunning = false;
    clearInterval(interval);
}

// The event listener
document.addEventListener("keydown", keyDownHandler);
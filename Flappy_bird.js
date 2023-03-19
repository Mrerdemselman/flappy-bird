const canvas = document.getElementById("game-canvas");
const context = canvas.getContext("2d");
const gameContainer = document.getElementById("game-container");    //we need the game container to make it blurry when the end menu is displayed

const flappyImg = new Image();
flappyImg.src = "Assets/Flappy_Bird.png";


//Game constants
const FLAP_SPEED = -5;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

//Bird variables
let birdX = 50;
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.1;

//Pipe variables
let pipeX = 400;
let pipeY = canvas.height - 200;

//Score and highscore variables
let scoreDiv = document.getElementById("score-display");
let score = 0;
let highScore = 0;
let scored = false; //Boolean to control when the bird passes a pipe


//Control the bird with space key
document.body.onkeyup = function(e) {
    if (e.code == 'Space') {
        birdVelocity =  FLAP_SPEED;
    }
}

//Restart button click funtion to restart the game
document.getElementById("restart-button").addEventListener("click", function() {
    hideEndMenu();
    resetGame();
    loop();
});

function increaseScore() {
    //Increase the score by 1 each time the bird passes a pipe
    if(birdX > pipeX + PIPE_WIDTH && 
            (birdY < pipeY + PIPE_GAP || 
                birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) &&
                    !scored) {
                    score++;
                    scoreDiv.innerHTML = score;
                    scored = true;
                }
    
    //Reset the boolean, after the bird passed a pipe
    if(birdX < pipeX + PIPE_WIDTH) {
        scored = false;
    }   

    console.log(score);
}

function collisionCheck() {
    //Creating bounding boxes for the bird
    const birdBox = {
        x: birdX,
        y: birdY,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT
    }

    //Creating bounding boxes for the pipes
    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: pipeY
    }

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
    }

    //Checking for collission with the top pipe
    if(birdBox.x + birdBox.width > topPipeBox.x &&
            birdBox.x < topPipeBox.x + topPipeBox.width &&
                birdBox.y < topPipeBox.y) {
                    return true;
        }
    
    //Checking for collission with the bottom pipe
    if(birdBox.x + birdBox.width > bottomPipeBox.x &&
        birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
            birdBox.y + birdBox.height > bottomPipeBox.y) {
                return true;
    }        

    //Checking if the bird hits the boundaries (-75 and +75 added to prevent instant ending when toucing to top and bottom boudaries)
    if(birdY < -75 || birdY + BIRD_HEIGHT > canvas.height +75) {
        return true;
    }

    return false;
}

function hideEndMenu() {
    document.getElementById("end-menu").style.display = "none";
    gameContainer.classList.remove("backdrop-blur");
}

function showEndMenu() {
    document.getElementById("end-menu").style.display = "block";
    gameContainer.classList.add("backdrop-blur");
    document.getElementById("end-score").innerHTML = score;

    //Update the highscore value if the current score is higher
    if(score > highScore) {
        highScore = score;
    }
    document.getElementById("best-score").innerHTML = highScore;
}

function resetGame() {
    birdX = 50;
    birdY = 50;
    birdVelocity = 0;
    birdAcceleration = 0.1;

    pipeX = 400;
    pipeY = canvas.height - 200;

    score = 0;
    scoreDiv.innerHTML = 0;
}


function endGame() {
    showEndMenu();
}


function loop() {
    //reset the context after every loop iteration
    context.clearRect(0, 0, canvas.width, canvas.height);    

    //Draw Flappy Bird
    context.drawImage(flappyImg, birdX, birdY);

    //Draw Pipes
    context.fillStyle = "#3f3f3f";
    context.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
    context.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

    //Moving the pipes
    pipeX -= 1.5;
    //If a pipe moves out of the frame, we need to reset the pipe
    if (pipeX < -50) {
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
    }

    //If the bird hits a pipe, end the game and display the end-menu
    if(collisionCheck()) {
        endGame();
        return;
    }

    //Apply gravity to the bird and let it move
    birdVelocity += birdAcceleration;
    birdY += birdVelocity;

    increaseScore();
    requestAnimationFrame(loop);
}

loop();
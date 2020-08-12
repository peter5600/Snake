var Snake = [
    [0, 0]
]; //just push [x,y]
var Apple = [0, 0];
var SnakeSize = 20;
var Score = 0;
var XV = 0,
    YV = 0;
var canvas;
var ctx; //make them global to access later
var IsPaused = false;
var IsDead = false;
var Game;

function OnLoad() {
    canvas = document.getElementById("canvas"); //get canvas
    ctx = canvas.getContext("2d"); //get context this is the variable i will use to interact with the canvas
}

function HandleKeyPress(e) {
    if (e.code === "KeyD") {
        XV = SnakeSize;
        YV = 0;
    } else if (e.code === "KeyS") {
        XV = 0;
        YV = SnakeSize;
    } else if (e.code === "KeyA") {
        XV = -SnakeSize;
        YV = 0;
    } else if (e.code === "KeyW") {
        XV = 0;
        YV = -SnakeSize;
    } else if (e.code === "KeyP") {
        IsPaused = !IsPaused;
    }
}

$(document).ready(function () {
    //alert("Hello");
    OnLoad(); //when the document is ready and therefore the canvas the onload func will load
    document.addEventListener('keypress', HandleKeyPress);
    GenApple();
    Game = window.setInterval(GameFunc, 33.33); //1000 / 30 = 33.3 so this will be about 30 fps
    //use clearInterval() to stop loop
});

function GenApple() {
    var RndNumX = Math.ceil(Math.floor(Math.random() * canvas.width) / SnakeSize) * SnakeSize; //so this generates a random number between the width and height
    var RndNumY = Math.ceil(Math.floor(Math.random() * canvas.height) / SnakeSize) * SnakeSize; // then rounds to nearest snakesize
    Apple = [RndNumX, RndNumY];
    for (i = 0; i < Snake.length; i++) {
        if (Snake[i] == Apple || (Apple[0] >= canvas.width || Apple[0] < 0) || (Apple[1] >= canvas.height || Apple[1] < 0)) {
            GenApple();
        }
    }
}

function GameFunc() {
    if (!IsDead) { //if not dead
        if (!IsPaused) { //if not paused
            ctx.clearRect(0, 0, canvas.width, canvas.height); //r3edraw screen
            if (Snake.length > 1) { //if the snake body is lobg enough to trail gop top the back and move it forward one to stop the snake swallowing itself
                //move the head last
                for (i = Snake.length - 1; i > 0; i--) {
                    Snake[i][0] = Snake[i - 1][0];
                    Snake[i][1] = Snake[i - 1][1];
                }
            }
            if (!((YV == -SnakeSize && Snake[0][1] + -SnakeSize < 0) || (YV == SnakeSize && Snake[0][1] + SnakeSize >= canvas.height))) { //works
                if (!((XV == -SnakeSize && Snake[0][0] + -SnakeSize < 0) || (XV == SnakeSize && Snake[0][0] + SnakeSize >= canvas.width))) {
                    Snake[0][0] += XV; //if not in the wall move the head
                    Snake[0][1] += YV;
                }
            }
            for (i = 0; i < Snake.length; i++) { //draw snake
                ctx.fillStyle = "#FF0000";
                ctx.fillRect(Snake[i][0], Snake[i][1], SnakeSize, SnakeSize);
            }
            ctx.fillStyle = "#7CFC00";
            ctx.fillRect(Apple[0], Apple[1], SnakeSize, SnakeSize);
            if (Apple[0] == Snake[0][0] && Apple[1] == Snake[0][1]) { //if caught apple
                Score += 1;
                GenApple();
                document.getElementById("ScoreTxt").innerHTML = "Score: " + Score;
                //when i get an apple push to snake array
                Snake.push([
                    Snake[Snake.length - 1][0] - XV, Snake[Snake.length - 1][1] - YV
                ]);
            }
            if (Snake.length > 1) {
                for (i = 1; i < Snake.length; i++) {
                    if (Snake[0][0] == Snake[i][0] && Snake[0][1] == Snake[i][1]) {
                        IsDead = true;
                    }
                }
            }
        }
    } else {
        alert("You have died");
        clearInterval(Game); //have to pass the interval to the clear interval func
        
    }
}

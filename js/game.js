var Snake = [
    [0, 0]
]; //just push [x,y]
var Apple = [0, 0];
var SnakeSize = 20;
var Score = 0;
var HighestScore = 0;
var XV = 0,
    YV = 0;
var canvas;
var ctx; //make them global to access later
var IsPaused = false;
var IsDead = false;
var Game;
var IgnoreKey = "";
var FPS = 45;//start where the slider starts at 45

function OnLoad() {
    canvas = document.getElementById("canvas"); //get canvas
    ctx = canvas.getContext("2d"); //get context this is the variable i will use to interact with the canvas
    $("#GameSpeedSlider").on("input change", function (e) {
        FPS = $(this).val();
        clearInterval(Game);
        Game = window.setInterval(GameFunc, FPS); //1000 / 30 = 33.3 so this will be about 30 fps
    });
}

$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
});




function HandleKeyPress(e) {
    if (e.code === "KeyD" && IgnoreKey != e.code) {
        XV = SnakeSize;
        YV = 0;
        IgnoreKey = "KeyA";
    } else if (e.code === "KeyS" && IgnoreKey != e.code) {
        XV = 0;
        YV = SnakeSize;
        IgnoreKey = "KeyW";
    } else if (e.code === "KeyA" && IgnoreKey != e.code) {
        XV = -SnakeSize;
        YV = 0;
        IgnoreKey = "KeyD";
    } else if (e.code === "KeyW" && IgnoreKey != e.code) {
        XV = 0;
        YV = -SnakeSize;
        IgnoreKey = "KeyS";
    } else if (e.code === "KeyP") {
        IsPaused = !IsPaused;
    }
}

$(document).ready(function () {
    //alert("Hello");
    OnLoad(); //when the document is ready and therefore the canvas the onload func will load
    document.addEventListener('keypress', HandleKeyPress);
    GenApple();
    Game = window.setInterval(GameFunc, FPS); //1000 / 30 = 33.3 so this will be about 30 fps
    //use clearInterval() to stop loop

});

function Restart() {
    if (Score > HighestScore) {
        HighestScore = Score;
        document.getElementById("HighestScoreTxt").innerHTML = "Highest Score: " + Score;
    }

    Score = 0;
    GenApple();
    Snake = [
        [0, 0]
    ];
    console.log("Hello");
    IsDead = false;
    XV = 0,
        YV = 0;
    document.getElementById("ScoreTxt").innerHTML = "Score: " + Score;


    Game = window.setInterval(GameFunc, FPS); //1000 / 30 = 33.3 so this will be about 30 fps
}


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
        IsDead = true;
        clearInterval(Game); //have to pass the interval to the clear interval func
        document.getElementById("score").innerHTML = Score;
        $('#myModal').modal('show');

    }
}
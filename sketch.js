const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
var ground, canon, zombie, canonBall;
var canonAngle = -90;
var balls = [];
var zombies = [];
var shots = 10;
const GameState = {
    intro: 1,
    home: 2,
    load: 3,
    play: 4
};
var w = 0;
var gameState = GameState.intro;
var tablet, logo;
var rotation = 0;
var play;
var form, zombieImg, spr;

function preload() {
    bg = loadImage("assets/BG.png");
    tablet = loadImage("assets/TABLET.png");
    menuBg = loadImage("assets/menubg.jpg")
    logoload = loadImage("assets/logo1.png");
    gameloading = loadImage("assets/loadingBg.jpg");
    zombieImg = loadAnimation("assets/wlk/(1).png", "assets/wlk/(2).png", "assets/wlk/(3).png", "assets/wlk/(4).png", "assets/wlk/(5).png", "assets/wlk/(6).png", "assets/wlk/(7).png", "assets/wlk/(8).png", "assets/wlk/(9).png", "assets/wlk/(10).png");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    form = new Form();

    engine = Engine.create();
    world = engine.world;
    ground = new Ground(windowWidth / 2, windowHeight * 9 / 10, windowWidth, windowHeight / 4);
    angleMode(RADIANS);
    canon = new Canon(windowWidth / 9, windowHeight - windowHeight / 3.5, 124, 124, -PI / 4);
    // canon = new Canon(400, 600, 124,124, -PI/4);

}

function draw() {
    // spr = createSprite(windowWidth / 2, windowHeight / 2, 80, 50);
    // console.log(spr.x, spr.y);
    intro(); //state--> -1
    home(); //state--> 0
    loadGame(); //state--> 1
    playGame(); //state--> 2
    // animation(zombieImg, spr.x, spr.y)
}

function intro() { // initial starting graphics
    if (gameState === GameState.intro) {
        background("black");
        push();
        translate(windowWidth / 2, windowHeight / 2);
        if (rotation < 6) {
            rotation = rotation + 0.1;
            rotate(rotation);
        }
        imageMode(CENTER);
        image(logoload, 0, 0, windowWidth / 3 + 10, windowWidth / 3 + 10);
        pop();

        setTimeout(() => {
            gameState = GameState.home;
        }, 5000);
    }
}

function home() {
    if (gameState === GameState.home) { // menu at home of the game
        background(menuBg);
        imageMode(CENTER);
        form.display();
    }
}

function loadGame() { //game's loding screen
    if (gameState === GameState.load) {
        background(gameloading);
        if (w < windowWidth) {
            w = w + 10;
        }
        fill("white");
        rect(0, windowHeight - 20, w, windowHeight / 20);

        if (w > windowWidth) {
            gameState = GameState.play;
        }
    }
}

function playGame() { // main state of game when playing
    if (gameState === GameState.play) {

        background(bg);
        Engine.update(engine);
        canon.display();
        ground.display();
        sendzombie();

        for (var i = 0; i < balls.length; i++) {
            ballDisplay(balls[i], i);
            console.log("canon ball display");
        }

        for (i = 0; i < zombies.length; i++) {
            zombies[i].display();
            zombies[i].move();
        }
        destroyBoth();
        gameOver();
        guiInGame();
    }
}


function keyPressed() { //shoots the ball on press of down arrow
    if (keyCode === DOWN_ARROW && shots !== 0) {
        canonBall = new CanonBall(canon.x, canon.y + 29);
        balls.push(canonBall);
        balls[balls.length - 1].shoot();
        shots = shots - 1;
    }
}

function sendzombie() { //send zombies with random spacing
    if (zombies.length === 0) {
        zombie = new Zombie(windowWidth + 10, 0, 100, 200);
        zombies.push(zombie);
        space = random(100, 500);
    }
    if (zombies[zombies.length - 1].body.position.x < width - space) {
        zombie2 = new Zombie(windowWidth + 10, 0, 100, 200);
        zombies.push(zombie2);
        space = random(100, 500);
    }

}

function ballDisplay(ball, index) { // display of ball only when ball is inside of canvas
    ball.display();
    if (ball.body.position.x > windowWidth || ball.body.position.y >= windowHeight - 200 || ball.body.speed < 1) {
        Matter.World.remove(world, ball.body);
        balls.splice(index, 1);
    }
}

function destroyBoth() { // destroys both balls and zombies when collided
    for (var i = 0; i < balls.length; i++) {
        for (var a = 0; a < zombies.length; a++) {
            var collision = Matter.SAT.collides(balls[i].body, zombies[a].body);
            if (collision.collided) {
                console.log("win 1");

                Matter.World.remove(world, zombies[a].body);
                zombies.splice(a, 1);

                Matter.World.remove(world, balls[i].body);
                balls.splice(i, 1);
            }
        }
    }
}

function gameOver() { // brings swal sweet alert when zombie touches the cannon
    if (zombies.length < 0) {
        for (var a = 0; a < zombies.length; a++) {
            if (zombies[a].body.position.x < canon.x) {

                swal({
                        title: `Game Over!!!`,
                        text: "Thanks for playing!!",
                        imageUrl: "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
                        imageSize: "150x150",
                        confirmButtonText: "Play Again"
                    },
                    function(isConfirm) {
                        if (isConfirm) {
                            location.reload();
                        }
                    }
                );
            }
        }
    }
}

function guiInGame() { // gui / options while playing the game
    strokeWeight(7);
    fill("white");
    textSize(30)
    text("Shots Left :" + shots, windowWidth / 15, windowHeight / 10);
}
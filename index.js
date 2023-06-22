
// Create the Canvas 
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 1000;
document.body.appendChild(canvas);

let gameOver = false;
let won = false;

let counter = 0;




// Create the chessBoard or Defining the Matrix
let chessBoard = [
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
];





// I. LOAD IMAGES ===============================================================================================
// Background image (bg)
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function() {
    bgReady = true;
};
bgImage.src = "images/background2.jpg";


// Hero image // Spaceship image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function() {
    heroReady = true;
};
heroImage.src = "images/spaceship2.png";


// Blackhole image (bh)
var bhReady = false;
var bhImage = new Image();
bhImage.onload = function() {
    bhReady = true;
};
bhImage.src = "images/blackhole.png";


// Monster image // SpaceStation image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function() {
    monsterReady = true;
};
monsterImage.src = "images/spaceStation.png";

// Done with load images =======================================================================================



// Load Sound object ==================================================================================
var soundGameOver = "sounds/losing.wav";
var soundCatchSpaceStation = "sounds/addingShip.wav";
var soundBackground = "sounds/backgroundMusic.wav";
var soundWinning = "sounds/winning.wav";

var soundEfx = document.getElementById("soundEfx");
var backgroundMusic = document.getElementById("backgroundSound");



// II. DEFINES OBJECTS AND VARIABLES ===========================================================================
// Game object
var hero = {
    speed: 150, // movement in pixels per second
    x: 0,
    y: 0
};

var monster = {
    x: 0,
    y: 0
};

var bh1 = {
    x: 100,
    y: 100
};

var bh2 = {
    x: 450,
    y: 700
};

var bh3 = {
    x: 700,
    y: 300
};
var monstersCaught = 0;

// New object when died
let died = false;


// Animation Spaceship
// Sprite geometry
var rows = 8;
var cols = 3;

// 2nd row & Right movement
var trackRight = 2;
// 3rd row & Left movement
var trackLeft = 5;
var trackUp = 0;
var trackDown = 7;


var spriteSheetWidth = 192;
var spriteSheetHeight = 512;
var width = spriteSheetWidth / cols;
var height = spriteSheetHeight / rows;

var curXFrame = 0;
var frameCount = 3;

var srcX = 0;
var srcY = 0;

var left = false;
var right = false;
var up = false;
var down = false;



// End define Objects and Variable we need ======================================================================




// III. KEYBOARD CONTROL ========================================================================================
// Handle keyboard controls
var keysDown = {}; 

// when press the up key
addEventListener("keydown", function(e) {
    
    keysDown[e.keyCode] = true;
}, false);

// when press the down key
addEventListener("keyup", function(e) {
    
    delete keysDown[e.keyCode];
}, false);
// End keyboard control =========================================================================================



// IV. DEFINES FUNCTION ==========================================================================================

// Update game objects
    // 1.Check keys and Move characters
var update = function (modifier) {
    
    ctx.clearRect(hero.x, hero.y, width, height);
    left = false;
    right = false;
    up = false;
    down= false;

    // check on keys
    if (38 in keysDown && hero.y > (32 + 4)) {  // Player holding UP
        hero.y -= hero.speed * modifier;
        up = true;
    }
    if (40 in keysDown && hero.y < canvas.height - (64 + 6)) { // Player holding DOWN
        hero.y += hero.speed * modifier;
        down = true;
    }
    if (37 in keysDown && hero.x > (32 + 0)) { // Player holding LEFT
        hero.x -= hero.speed * modifier;
        left = true;
    }
    if (39 in keysDown && hero.x < canvas.width - (64 + 0)) { // Player holding RIGHT
        hero.x += hero.speed * modifier;
        right = true;
    }


    // 2. Detect: Are they touching? // Hero&Monster // Spaceship&Spacestation       
    if (
        hero.x <= (bh1.x + 30)
        && bh1.x <= (hero.x + 30)
        && hero.y <= (bh1.y + 30)
        && bh1.y <= (hero.y + 30)
    ) {
        soundEfx.src = soundGameOver;
        soundEfx.play();
        gameOver = true;
        alert("!!!GAME OVER!!!");
    }
    if (
        hero.x <= (bh2.x + 30)
        && bh2.x <= (hero.x + 30)
        && hero.y <= (bh2.y + 30)
        && bh2.y <= (hero.y + 30)
    ) {
        soundEfx.src = soundGameOver;
        soundEfx.play();
        gameOver = true;
        alert("!!!GAME OVER!!!");
    }
    if (
        hero.x <= (bh3.x + 30)
        && bh3.x <= (hero.x + 30)
        && hero.y <= (bh3.y + 30)
        && bh3.y <= (hero.y + 30)
    ) {
        soundEfx.src = soundGameOver;
        soundEfx.play();
        gameOver = true;
        alert("!!!GAME OVER!!!");
    }

    
    // Touching the Spacestation (still monster)
    if (
        hero.x <= (monster.x + 90)
        && monster.x <= (hero.x + 40)
        && hero.y <= (monster.y + 40)
        && monster.y <= (hero.y + 45)
    ) {
        ++monstersCaught;     //update the score
        soundEfx.src = soundCatchSpaceStation;
        soundEfx.play();
        if (monstersCaught == 3) {
            gameOver = true;
            won = true;
            soundEfx.src = soundWinning;
            soundEfx.play();
        }
        reset();               //start a new cycle
    }


    curXFrame = ++curXFrame % frameCount;

    if (counter == 8) {
        curXFrame = ++curXFrame % frameCount;
        counter = 0;
    } else {
        counter++;
    }

    srcX = curXFrame * width;

    if (left) {
        srcY = trackLeft * height;
    }

    if (right) {
        srcY = trackRight * height;
    }

    if (up) {
        srcY = trackUp * height;
    }

    if (down) {
        srcY = trackDown * height;
    }

    if (left == false && right == false && up == false && down == false) {
        srcX = 1 * width;
        srcY = 0 * height;
    }

};

// Draw everything in the main render function
var render = function() {
    if (bgReady) {
        
        ctx.drawImage(bgImage, 0, 0);
    }
    if (heroReady) {
        ctx.drawImage(heroImage, srcX, srcY, width, height, hero.x, hero.y, width, height);
    }
    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }
    if (bhReady) {
        ctx.drawImage(bhImage, bh1.x, bh1.y);
        ctx.drawImage(bhImage, bh2.x, bh2.y);
        ctx.drawImage(bhImage, bh3.x, bh3.y);
    }

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "24px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("Space Station delivered: " + monstersCaught, 32, 32);
};



let placeItem = function (character) {
    
    let X = 5;
    let Y = 6;
    let success = false;
    while(!success) {
        X = Math.floor(Math.random() * 9);  // returns 0 thru 8

        Y = Math.floor(Math.random() * 9);  // return 0 thru 8

        if (chessBoard[X][Y] === 'x') {
            success = true;
        }
    }
    chessBoard[X][Y] = 'O';    // mark a square as taken
    character.x = (X*100) + 32;
    character.y = (Y*100) + 32;
}




// The main game loop
var main = function() {
    

    if (gameOver == false) {
        var now = Date.now();
        var delta = now - then;
        update(delta / 1000);
        render();
        then = now;
        // Request to do this again ASAP
        requestAnimationFrame(main);
    } else {
        if (won == true) {
            alert("You Won!");
        }
    }
    
};


// Reset the game when the player catches a monster
var reset = function() {
    backgroundMusic.src = soundBackground;
    backgroundMusic.play();
    backgroundMusic.loop = true;
    placeItem(hero);
    placeItem(monster);
    placeItem(bh1);
    placeItem(bh2);
    placeItem(bh3);
};


// End of define functions =====================================================================================


// Let's play this game =========================================================================================
var then = Date.now();
reset();
main(); // call the main game loop
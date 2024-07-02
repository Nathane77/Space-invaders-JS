//board
let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize * columns // 32*16
let boardHeight = tileSize * rows // 32*16
let context;

//ship
let shipWidth = tileSize*2;
let shipHeight = tileSize;
let shipX = tileSize * columns/2 - tileSize
let shipY = tileSize * rows - tileSize*2;

let ship = {
    x : shipX,
    y : shipY,
    width : shipWidth,
    height : shipHeight,
}

let shipImg
let shipVelocityX = tileSize; //ship move speed

//aliens
let alienArray = [];
let alienWidth = tileSize*2
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;

let alienRows = 2;
let alienColumns = 3;
let alienCount = 0;
let alienVelocityX = 1; //alien movespeed


//bullets
let bulletArray = [];
let bulletVelocityY = -10; //bulet move speed

let score = 0;
let gameOver = false;
let pause = false;

//random image picker
var rdmImg = ['/img/alien-cyan.png', '/img/alien-magenta.png', '/img/alien-yellow.png','/img/alien.png'];
var rdmImg = rdmImg[Math.floor(Math.random()*4)];
console.log(rdmImg)

function getRandomImage() {
    var num = Math.floor( Math.random() * 5);
    var img = rdmImg;
}

window.onload = function() {
    board = document.getElementById("board")
    board.width = boardWidth
    board.height = boardHeight
    context = board.getContext("2d") // used for drawing on the board

    //draw initial ship
    //context.fillStyle="green";
    //context.fillRect(ship.x, ship.y, shipWidth, shipHeight);
    
    //load images
    shipImg = new Image()
    shipImg.src = "/img/ship.png"
    shipImg.onload = function(){
        context.drawImage(shipImg, ship.x, ship.y, shipWidth, shipHeight);
    }
    
    alienImg = new Image()
    alienImg.src = [rdmImg];

    createAliens();

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);
}


function update(){
    requestAnimationFrame(update);

    if(gameOver == true){
        return;
    }
    context.clearRect(0, 0, board.width, board.height)

    //ship
    context.drawImage(shipImg, ship.x, ship.y, shipWidth, shipHeight);

    //aliens
    for (let i = 0; i < alienArray.length; i++){
        let alien = alienArray[i];
        if (alien.alive){
            alien.x += alienVelocityX;

            //if alien  touches the borders
            if(alien.x + alien.width >= boardWidth || alien.x <= 0){
                alienVelocityX *= -1; 
                alien.x += alienVelocityX*2;


                //move aliens down
                for (let j = 0; j < alienArray.length;  j++){
                    alienArray[j].y += alienHeight;
                }
            }
            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height)
            console.log(rdmImg)
        
            if(alien.y >= ship.y){
                gameOver = true;
            }
        }
    }

    //bullet
    for (let i = 0; i < bulletArray.length; i++) {
        let bullet = bulletArray[i];
        bullet.y += bulletVelocityY;
        context.fillStyle="white";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
        
        //bullet collisions with aliens
        for (let j = 0; j < alienArray.length; j++){
            let alien = alienArray[j];
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)){
                bullet.used = true;
                alien.alive = false;
                alienCount --;
                score += 100;
            }     
        }
    
    }   



    //clear bullets
    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
        bulletArray.shift();
    }
    //next lvl
    if (alienCount == 0){
        //increase the number of aliens by 1
        alienColumns = Math.min(alienColumns + 1, columns/2 -2); // cap at 16/8 -2 =6
        alienRows = Math.min(alienRows + 1, rows-4); //cap at 16-8 = 12
        alienVelocityX += 0.2; // increase alien movement speed
        alienArray = [];
        bulletArray = [];
        createAliens();
    }

    //score
    context.fillStyle="white";
    context.font="16px vcourier";
    context.fillText(score, 5, 20)    

}

function moveShip(e) {
    if(gameOver == true){
        return;
    }
    if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
        ship.x -= shipVelocityX; //move left
    }
    else if (e.code == "ArrowRight" && ship.x + shipVelocityX + shipWidth <= boardWidth) {
        ship.x += shipVelocityX; //move right
    }
}

function createAliens() {
    for (let c = 0; c < alienColumns; c++) {
        for (let r = 0; r < alienRows; r++) {
            let alien = {
                img :getRandomImage,
                x : alienX + c*alienWidth,
                y : alienY + r*alienHeight,
                width : alienWidth,
                height : alienHeight,
                alive : true
            }

            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}

function shoot(e) {
    if(gameOver == true){
        return;
    }
     if(e.code == "Space"){
        //shoot
        let bullet = {
            x : ship.x + shipWidth*15/32,
            y : ship.y, 
            width : tileSize/8,
            height : tileSize/2,
            used : false
        }
        bulletArray.push(bullet);
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x &&      //a's top right corner corner passes b's topleft corner
        a.y < b.y + b.height &&     //a's top left corner doesn't reach b's bottom left corner
        a.y + a.height > b.y;       // a's bottom left corner passes b's top left corner
}

/*window.onload = function() {
    document.getElementById("play").onclick = function() {
        pause = false;
    }
    document.getElementById("pause").onclick = function() {
        pause = true;
            let button = this; // 'this' refers to the clicked button
            if (button.textContent === "Pause") {
                button.textContent = "Resume";
            } else {
                button.textContent = "Pause";
            }
    }
}*/
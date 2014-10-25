var fps = 50;
var music = new Audio('sounds/music1.mp3');
music.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

var html5_audiotypes={
    "mp3": "audio/mpeg",
    "mp4": "audio/mp4",
    "ogg": "audio/ogg",
    "wav": "audio/wav"
}

function createsoundbite(sound){
    var html5audio=document.createElement('audio');
    $('#player').append(html5audio);
    html5audio.id = "html5audio";
    if (html5audio.canPlayType){
        for (var i=0; i<arguments.length; i++){
            var sourceel=document.createElement('source')
            sourceel.setAttribute('src', arguments[i])
            if (arguments[i].match(/\.(\w+)$/i))
                sourceel.setAttribute('type', html5_audiotypes[RegExp.$1])
            html5audio.appendChild(sourceel)
        }
        html5audio.load()
        html5audio.playclip=function(){
            html5audio.pause()
            html5audio.currentTime=0
            html5audio.play()
        }
        return html5audio
    }
    else{
        return {playclip:function(){throw new Error("Sorry brah, yo browser too ol' get Chrome or sumtin!")}}
    }
}

var wilhelm_scream = new createsoundbite('sounds/deathscream1.mp3');
wilhelm_scream.volume = 0.25;

var shot=createsoundbite("sounds/gunshot1.wav");
    shot.volume=0.05; // var alltof hátt
    //var crank=createsoundbite("crank.mp3", "crank.ogg")

var refreshRate = 1000/fps;



var imgChar = new Image();
//imgChar.src = "http://www.elfquest.com/social/file/pic/photo/2012/01/TrollHammer-ogre_500.png";
imgChar.src = "./images/trollhammer.png";
var xpos = 100;
var ypos = 100;
var width = 91;
var height = 125;
// sx, sy, swidth, sheight are all for cropping
var xstart = 4
var sx = xstart;
var sy = 0;
var swidth = width;
var sheight = height;

var countShotBirds = 0;
var countAmmunition = 50;
var birdsize = 20;
var birdxpos = 100;
var birdypos = 100;
var speed = 100/fps;
var updown = "up";
var leftright="left";
var birdcolor = "rgb(255,0,0)";


var gameLoopCounter = 0;
var chardirection = "down";
var charMoving = false;
var direction_arr = {"down": 0, "left": 1, "right": 2, "up": 3};


var layer1;
var layer2;
var layer3;
var layer4;
var ctx1;
var ctx2;
var ctx3;
var ctx4;

$(document).ready(function() {

	


   layer1 = document.getElementById("layer1");
    layer1.width = $('.canvas-container').width();
    layer1.height = 600;
    ctx1 = layer1.getContext("2d");
    layer2 = document.getElementById("layer2");
    layer2.width = $('.canvas-container').width();
    layer2.height = 600;
    ctx2 = layer2.getContext("2d");
    layer3 = document.getElementById("layer3");
    layer3.width = $('.canvas-container').width();
    layer3.height = 600;
    ctx3 = layer3.getContext("2d");
    layer4 = document.getElementById("layer4");
    layer4.width = $('.canvas-container').width();
    layer4.height = 600;
    ctx4 = layer4.getContext("2d");
    
    canvaswidth = $('.canvas-container').width();
    canvasheight = 600;

	music.play();

    var t=setInterval("gameLoop()",refreshRate); 
	
    initiateGame();
    
});

function initiateGame() {




birdsize = 20;
birdcolor = "rgb(255,0,0)";
updown = "up";
leftright="left";

speed = 100/fps;
countShotBirds = 0;
countAmmunition = 50;

 
    
    
    
    $('.canvas-container').mousedown(function myDown(e) {
        countAmmunition--;
        shot.playclip();
        var position = $(layer1).offset(); // hér var $(example).position() sem var ekki lengur rétt
        var x = e.pageX-position.left;
        var y = e.pageY-position.top;
        drawGunshot(x,y);
        // Hitti fuglinn eða ekki .. 
        // Þetta fyrir neðan notar kassa, þurfum pythagorean distance fyrir hringinn
        if( (birdxpos-birdsize/2)<x && x<(birdxpos+birdsize/2) 
        && (birdypos-birdsize/2)<y && y<(birdypos+birdsize/2) 
        && countAmmunition > 0) {
            // some winning condition
            wilhelm_scream.playclip();
            countShotBirds++;
            var random = Math.floor(Math.random()*canvaswidth);
            birdxpos=random;
            random = Math.floor(Math.random()*canvasheight);
            birdypos=random;
            var random1 = Math.floor(Math.random()*150)+50; 
            var random2 = Math.floor(Math.random()*150)+50; 
            var random3 = Math.floor(Math.random()*150)+50; 
            birdcolor = "rgb("+random1+","+random2+","+random3+")";
        }
    });

}


function writeGameState() {    
    ctx3.fillStyle = '#000';
    ctx3.font = '30px verdana';
    ctx3.textBaseline = 'top';
    ctx3.fillText('You have '+countAmmunition+' shots left',30,0);
    ctx3.fillText('You have shot '+countShotBirds+' balloons.',30,30);
}

function writeGameOver() {    
    ctx3.fillStyle = '#000';
    ctx3.font = '50px verdana';
    ctx3.textBaseline = 'top';
    ctx3.fillText('Game over! You got '+countShotBirds+' balloons',30,0);
    ctx3.font = '30px verdana';
    ctx3.fillText('To play again, hit refresh!',30,50);
    exit();
}

function clearGameState() {
    ctx3.fillStyle = "rgb(255,255,255)";
    ctx3.fillRect(0,0,500,100);  
}

function gameLoop() {
    // draw entire background??
    clearGameState();
    if (countAmmunition > 0) writeGameState();
    else writeGameOver();
    clearBird();
    moveBird();
    collisionWithWalls();
    drawBird();
	
	// imgChar.onload = function() { drawCharacter(); }
	clearCharacter();
	moveCharacter();
	drawCharacter();
}

function drawCharacter() {
	if(charMoving) {
		gameLoopCounter++;
	    if(gameLoopCounter == 10) {
			if (sx >= 3*swidth) {
				sx = xstart;
			}
			else {
				sx += swidth;
			}
			gameLoopCounter = 0;
		}
	}
	
	sy = direction_arr[chardirection] * sheight;
    ctx4.drawImage(imgChar, sx, sy, swidth, sheight, xpos, ypos, width, height);
}

function clearCharacter() {
	ctx4.clearRect(xpos,ypos,width,height);
}

function moveCharacter() {
	if(keydown.left || keydown.a) {
        xpos -= 2;
		chardirection = "left";
    }	
	if(keydown.right || keydown.d) {
        xpos += 2;
		chardirection = "right";
    }
	if(keydown.down || keydown.s) {
        ypos += 2;
		chardirection = "down";
    }
	if(keydown.up || keydown.w) {
        ypos -= 2;
		chardirection = "up";
    }
	if (keydown.left || keydown.right || keydown.down || keydown.up || keydown.a || keydown.s || keydown.d || keydown.w) {
		charMoving = true;
	}
	else charMoving = false;
}

function drawGunshot(x, y) {
    ctx2.fillStyle = "rgb(80,80,80)";
    ctx2.beginPath();
    ctx2.arc(x, y, 4, 12, Math.PI*2, true); 
    ctx2.closePath();
    ctx2.fill();  
    ctx2.fillStyle = "rgb(0,0,0)";
    ctx2.beginPath();
    ctx2.arc(x, y, 4, 9, Math.PI*2, true); 
    ctx2.closePath();
    ctx2.fill();        
}

function drawBird() {
    ctx2.fillStyle = birdcolor;
    ctx2.beginPath();
    var radius = birdsize/2;
    ctx2.arc(birdxpos, birdypos, radius, 13, Math.PI*2, true); 
    ctx2.closePath();
    ctx2.fill();
}

function clearBird() {
    ctx2.fillStyle = "rgb(255,255,255)";
    ctx2.beginPath();
    var radius = birdsize/2;
    ctx2.arc(birdxpos, birdypos, radius, 13, Math.PI*2, true); 
    ctx2.closePath();
    ctx2.fill(); 
}

function moveBird() {    
    var random =Math.floor(Math.random()*45);
    if(random == 5) updown = "up";
    if(random == 6) updown = "down";
    if(updown =="up") birdypos -= speed;
    else birdypos += speed;

    if(leftright =="right") birdxpos += speed;
    else birdxpos -= speed;
}

function collisionWithWalls() {
    if(birdxpos < birdsize/2) leftright="right";
    if(birdxpos > (canvaswidth-birdsize/2) ) leftright="left";
    
    if(birdypos < birdsize/2) updown="down";
    if(birdypos > (canvasheight-birdsize/2)) updown="up";
}

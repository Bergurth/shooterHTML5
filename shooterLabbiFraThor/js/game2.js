var fps = 50;
var music = new Audio('sounds/music1.mp3');
var wilhelm_scream = new Audio('sounds/deathscream1.mp3');
wilhelm_scream.volume = 0.25;
var example;
var context;
var canvaswidth;
var canvasheight;
var birdxpos = 100;
var birdypos = 100;
var birdsize = 20;
var birdcolor = "rgb(255,0,0)";
var updown = "up";
var leftright="left";
var refreshRate = 1000/fps;
var speed = 100/fps;
var countShotBirds = 0;
var countAmmunition = 50;

var html5_audiotypes={
	"mp3": "audio/mpeg",
	"mp4": "audio/mp4",
	"ogg": "audio/ogg",
	"wav": "audio/wav"
}

var trImg = new Image();
//trImg.src = "../images/img.png"

trImg.src = "http://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png";

var imgChar = new Image();
//imgChar.src = "http://www.elfquest.com/social/file/pic/photo/2012/01/TrollHammer-ogre_500.png";
imgChar.src = "../images/fig07.png";
var xpos = 100;
var ypos = 100;
var width = 155;
var height = 220;
// sx, sy, swidth, sheight are all for cropping
var xstart = 0
var sx = xstart;
var sy = 0;
var swidth = width;
var sheight = height;

var gameLoopCounter = 0;
var gameLoopCounter2 = 0;

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

$(document).ready(function() {


	
	var shot=createsoundbite("sounds/gunshot1.wav");
	shot.volume=0.05; // var alltof hátt
	//var crank=createsoundbite("crank.mp3", "crank.ogg")
	
	music.play();
    example = document.getElementById('example'); // ná canvas!
    example.width = $('.canvas-container').width();
	example.height = 600;
    
	
	
    canvaswidth = example.width;
    canvasheight = example.height;
    context = example.getContext('2d');
	
	trImg.onload = function() {
   context.drawImage(trImg,250,300);
	};
	
    var t=setInterval("gameLoop()",refreshRate); 
    
    $(example).mousedown(function myDown(e) {
        countAmmunition--;
		shot.playclip();
        var position = $(example).offset(); // hér var $(example).position() sem var ekki lengur rétt
        var x = e.pageX-position.left;
        var y = e.pageY-position.top;
        drawGunshot(x,y);
        // Hitti fuglinn eða ekki .. 
        // Þetta fyrir neðan notar kassa, þurfum pythagorean distance fyrir hringinn
        if( (birdxpos-birdsize/2)<x && x<(birdxpos+birdsize/2) 
        && (birdypos-birdsize/2)<y && y<(birdypos+birdsize/2) 
        && countAmmunition > 0) {
            // some winning condition
			wilhelm_scream.play();
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
    
});

function writeGameState() {    
    context.fillStyle = '#000';
    context.font = '30px verdana';
    context.textBaseline = 'top';
    context.fillText('You have '+countAmmunition+' shots left',30,0);
    context.fillText('You have shot '+countShotBirds+' balloons.',30,30);
}

function writeGameOver() {    
    context.fillStyle = '#000';
    context.font = '50px verdana';
    context.textBaseline = 'top';
    context.fillText('Game over! You got '+countShotBirds+' balloons',30,0);
    context.font = '30px verdana';
    context.fillText('To play again, hit refresh!',30,50);
    exit();
}

function clearGameState() {
    context.fillStyle = "rgb(255,255,255)";
    context.fillRect(0,0,500,100);  
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
	imgChar.onload = function() { drawCharacter(); }
	drawCharacter();
}

function drawCharacter() {
	gameLoopCounter++;
	gameLoopCounter2++;
    if(gameLoopCounter == 10) {
		if (sx >= 3*swidth) {
			sx = xstart;
		}
		else {
			sx += swidth;
		}
		gameLoopCounter = 0;
	}
	
	if (gameLoopCounter2 == 120) {
		if (sy >= sheight) {
			sy = 0;
		}
		else {
			sy += sheight;
		}
		
		gameLoopCounter2 = 0;
	}

    context.drawImage(imgChar, sx, sy, swidth, sheight, xpos, ypos, width, height);
    
}

function drawGunshot(x, y) {
    context.fillStyle = "rgb(80,80,80)";
    context.beginPath();
    context.arc(x, y, 4, 12, Math.PI*2, true); 
    context.closePath();
    context.fill();  
    context.fillStyle = "rgb(0,0,0)";
    context.beginPath();
    context.arc(x, y, 4, 9, Math.PI*2, true); 
    context.closePath();
    context.fill();        
}

function drawBird() {
    context.fillStyle = birdcolor;
    context.beginPath();
    var radius = birdsize/2;
    context.arc(birdxpos, birdypos, radius, 13, Math.PI*2, true); 
    context.closePath();
    context.fill();
}

function clearBird() {
    context.fillStyle = "rgb(255,255,255)";
    context.beginPath();
    var radius = birdsize/2;
    context.arc(birdxpos, birdypos, radius, 13, Math.PI*2, true); 
    context.closePath();
    context.fill(); 
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

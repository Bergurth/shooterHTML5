		


var example;
var context;
var canvaswidth;
var canvasheight;









$(document).ready(function() {

   
	music.play();
    example = document.getElementById('example'); // ná canvas!
	var t=setInterval("gameLoop()",refreshRate);
	
	    $(example).mousedown(function myDown(e) {
        countAmmunition--;
		shot.playclip();
        var position = $(example).position();
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
            createRandomBird();
        }
    });

    example.width = 900;
    example.height = 900;

    
    
    canvaswidth = example.width;
    canvasheight = example.height;
    context = example.getContext('2d');
    
    TIEwar.onload = function() {context.drawImage(TIEwar,0,0,canvaswidth,canvasheight);};

	
	initiateGame(example);
    
	
});




function initiateGame(example) {



fps = 50;
context;
canvaswidth;
 canvasheight;
 birdxpos = 100;
 birdypos = 100;
 birdsize = 20;
 birdcolor = "rgb(255,0,0)";
 updown = "up";
 leftright="left";
 refreshRate = 1000/fps;
 speed = 100/fps;
 countShotBirds = 0;
 countAmmunition = 100;


    example.width = 900;
    example.height = 900;

    
    
    canvaswidth = example.width;
    canvasheight = example.height;
    context = example.getContext('2d');
    
    context.drawImage(TIEwar,0,0,canvaswidth,canvasheight);
    
}


function createRandomBird() {
			var type = Math.random()<0.5;
			if (type){
				birdKind = "horiz";
			}
			else {
				birdKind = "vertical";
			}
			var random = Math.floor(Math.random()*canvaswidth);
            birdxpos=random;
            random = Math.floor(Math.random()*canvasheight);
            birdypos=random;
            var random1 = Math.floor(Math.random()*150)+50; 
            var random2 = Math.floor(Math.random()*150)+50; 
            var random3 = Math.floor(Math.random()*150)+50; 
            birdcolor = "rgb("+random1+","+random2+","+random3+")";
}

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
    context.fillText('To play again, hit New Game!',30,50);
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
    context.drawImage(TIE1,birdxpos-radius*0.8,birdypos-radius*0.8);
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
	if(birdKind=="horiz"){
    
    if(random == 5) updown = "up";
    if(random == 6) updown = "down";
    if(updown =="up") birdypos -= speed;
    else birdypos += speed;

    if(leftright =="right") birdxpos += speed;
    else birdxpos -= speed;
	}
	else {
   
    if(random == 5) leftright = "up";
    if(random == 6) leftright = "down";
    if(updown =="up") birdypos -= speed;
    else birdypos += speed;

    if(leftright =="right") birdxpos += speed;
    else birdxpos -= speed;
	}
}

function collisionWithWalls() {
    if(birdxpos < birdsize/2) leftright="right";
    if(birdxpos > (canvaswidth-birdsize/2) ) leftright="left";
    
    if(birdypos < birdsize/2) updown="down";
    if(birdypos > (canvasheight-birdsize/2)) updown="up";
}

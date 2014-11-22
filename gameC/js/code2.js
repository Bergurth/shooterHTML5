		


var layer1;
var ctx1;
var canvaswidth;
var canvasheight;


var gameLoopCounter = 0;
var chardirection = "down";
var charMoving = false;
var direction_arr = {"down": 0, "left": 1, "right": 2, "up": 3};


var sprite_offset_x = 46;
var sprite_offset_y = 20;

/*
// experemental sprite stuff
function sprite(imageName, swidth, sheight, xstart, widthNum){
    this.imageName = imageName;
    this.swidth = swidth;
    this.sheight = sheight;

    this.widthNum = widthNum;
    this.xstart = xstart;
    this.image = new Image();
    this.image.src = imageName;

    this.sx = xstart;
    this.sy = 0;
}

sprite.prototype = {
   
    drawSprite : function(xpos, ypos, width, height, layer) {
      

        gameLoopCounter++;
        if(gameLoopCounter == 10) {
            if (this.sx >= this.widthNum*width) {
                this.sx = this.xstart;

            }
            else {
                this.sx += width;
            }
            gameLoopCounter = 0;
        }
    
    
    this.sy = direction_arr[chardirection] * sheight;
    //layer.drawImage(this.image, this.sx, this.sy, swidth, sheight, xpos, ypos, width, height);
    }

}

var goblinSprite = Object.create(new sprite("../images/GoblinTemplate.png", 32, 32, 0, 2));

*/
$(document).ready(function() {

   
	music.play();
    layer1 = document.getElementById('layer1'); // ná canvas!
	var t=setInterval("gameLoop()",refreshRate);
	
	    $('.canvas-container').mousedown(function myDown(e) {
        countAmmunition--;
		//shot.playclip();
        laser.playclip();
        var position = $(layer1).offset(); // hér var $(example).position() sem var ekki lengur rétt
        var x = e.pageX-position.left;
        var y = e.pageY-position.top;
        drawGunshot(x,y);
        drawLaser(x,y);
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

  

   // layer1.width = $('.canvas-container').width();

    layer1.width = 900;   
    layer1.height = 900;
    
    canvaswidth = layer1.width;
    canvasheight = layer1.height;
    ctx1 = layer1.getContext('2d');

    //other layers
    layer2 = document.getElementById("layer2");
    layer2.width = 900;
    layer2.height = 900;
    ctx2 = layer2.getContext("2d");
    layer3 = document.getElementById("layer3");
    layer3.width = 900;
    layer3.height = 900;
    ctx3 = layer3.getContext("2d");
    layer4 = document.getElementById("layer4");
    layer4.width = 900;
    layer4.height = 900;
    ctx4 = layer4.getContext("2d");
    
    //TIEwar.onload = function() {ctx1.drawImage(TIEwar,0,0,canvaswidth,canvasheight);};

	



	initiateGame(layer1,layer2,layer3,layer4);
    
	
});




function initiateGame(layer1,Layer2,Layer3,Layer4) {




fps = 50;
ctx1;
ctx2;
ctx3;
ctx4;
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


    layer1.width = 900;
    layer1.height = 900;

    
    
    canvaswidth = layer1.width;
    canvasheight = layer1.height;
    ctx1 = layer1.getContext('2d');

    //other layers
    layer2.width = 900;
    layer2.height = 900;
    ctx2 = layer2.getContext("2d");
    layer3.width = 900;
    layer3.height = 900;
    ctx3 = layer3.getContext("2d");
    layer4.width = 900;
    layer4.height = 900;
    ctx4 = layer4.getContext("2d");

    
   // ctx1.drawImage(TIEwar,0,0,canvaswidth,canvasheight);
    
}

function clearCharacter() {
    ctx3.clearRect(xpos,ypos,width,height);
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
    ctx3.drawImage(imgChar, sx, sy, swidth, sheight, xpos, ypos, width, height);
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
    ctx3.fillText('To play again, hit New Game!',30,50);
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
    collisionWithPlayer();
    collisionWithWalls();
    drawBird();

    clearCharacter();
    moveCharacter();
    drawCharacter();
}

function drawGunshot(x, y) {
    ctx1.fillStyle = "rgb(80,80,80)";
    ctx1.beginPath();
    ctx1.arc(x, y, 4, 12, Math.PI*2, true); 
    ctx1.closePath();
    ctx1.fill();  
    ctx1.fillStyle = "rgb(0,0,0)";
    ctx1.beginPath();
    ctx1.arc(x, y, 4, 9, Math.PI*2, true); 
    ctx1.closePath();
    ctx1.fill();        
}
function drawLaser(x, y) {
    // xpos = char x pos
    ctx4.strokeStyle = "rgb(255,0,0)";
    ctx4.lineWidth=2;
    ctx4.beginPath();
    switch(chardirection) {
        case "down":
            ctx4.moveTo(xpos+sprite_offset_x-4, ypos+sprite_offset_y);
            break;
        case "up":
            ctx4.moveTo(xpos+sprite_offset_x-10, ypos+sprite_offset_y -20);
            break;
        case "left":
            ctx4.moveTo(xpos+sprite_offset_x-20, ypos+sprite_offset_y +5);
            break;
        case "right":
            ctx4.moveTo(xpos+sprite_offset_x+20, ypos+sprite_offset_y +5);
            break;
    }
    ctx4.lineTo(x, y);
    ctx4.stroke();
    ctx4.beginPath();
    switch(chardirection) {
        case "down":
            ctx4.moveTo(xpos+sprite_offset_x+4, ypos+sprite_offset_y);
            break;
        case "up":
            ctx4.moveTo(xpos+sprite_offset_x+4, ypos+sprite_offset_y -20);
            break;
        case "left":
            ctx4.moveTo(xpos+sprite_offset_x-26, ypos+sprite_offset_y);
            break;
        case "right":
            ctx4.moveTo(xpos+sprite_offset_x+26, ypos+sprite_offset_y);
            break;
    }
    ctx4.lineTo(x, y);
    ctx4.stroke();
    // setTimeout( clearLaser(xpos+sprite_offset_x, ypos+sprite_offset_y, x, y), 10000);
    setTimeout(function() {ctx4.clearRect(0, 0, 1000, 1000)}, 50);
}

function drawBird() {
    ctx2.fillStyle = birdcolor;
    ctx2.beginPath();
    var radius = birdsize/2;
    ctx2.arc(birdxpos, birdypos, radius, 13, Math.PI*2, true); 
    ctx2.closePath();
    ctx2.fill();
    //ctx2.drawImage(TIE1,birdxpos-radius*0.8,birdypos-radius*0.8);
    //goblinSprite.drawSprite(birdxpos-radius*0.8,birdypos-radius*0.8, ctx2);
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

function collisionWithPlayer() {
    var give_me_a_break = 15; // this is so you can barely escape with the knees 
    if( birdxpos > (xpos + give_me_a_break) 
    && birdxpos < (xpos + width - give_me_a_break) 
    && birdypos > (ypos + give_me_a_break) 
    && birdypos < (ypos + height - give_me_a_break) ) {
        annoyed1.play();
        console.log("ouch");
        // ogre dies? or loses life? so then in general we might have lots of life and scoring etc
        // listen to: http://www.thanatosrealms.com/war2/horde-sounds
    }
    
    // to see hitbox uncomment this:
   /* 
    ctx4.rect(xpos + give_me_a_break, 
    ypos + give_me_a_break,
    width - 2*give_me_a_break,
    height - 2*give_me_a_break);
    ctx4.stroke();
    */
}
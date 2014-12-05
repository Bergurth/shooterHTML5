var layer1;
var layer2;
var layer3;
var layer4;
var ctx1;
var ctx2;
var ctx3;
var ctx4;

var gameLoopCounter = 0;
var spriteCounter = 0;
var chardirection = "down";
var charMoving = false;
var direction_arr = {"down": 0, "left": 1, "right": 2, "up": 3};

var sprite_offset_x = 46;
var sprite_offset_y = 20;

var bullets = [];
var last_fired = Date.now();

var game_over = false;
var lastTime;

$(document).ready(function() {
	// music.play();
	
	// layer1.width = $('.canvas-container').width();
	layer1 = document.getElementById('layer1'); // ná canvas!
    layer1.width = canvaswidth;   
    layer1.height = canvasheight;
    ctx1 = layer1.getContext('2d');
    //other layers
    layer2 = document.getElementById("layer2");
    layer2.width = canvaswidth;
    layer2.height = canvasheight;
    ctx2 = layer2.getContext("2d");
    layer3 = document.getElementById("layer3");
    layer3.width = canvaswidth;
    layer3.height = canvasheight;
    ctx3 = layer3.getContext("2d");
    layer4 = document.getElementById("layer4");
    layer4.width = canvaswidth;
    layer4.height = canvasheight;
    ctx4 = layer4.getContext("2d");
	
	var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
	})();

	
	var t=setInterval("gameLoop()",refreshRate);
	
	$('.canvas-container').mousedown(function myDown(e) {
		var time_between_arrows = 170; // milliseconds
		if(last_fired + time_between_arrows < Date.now()) {
			last_fired = Date.now();
			// countAmmunition--; // endless ammunition is better
			laser.playclip();
			var position = $(layer1).offset(); // hér var $(example).position() sem var ekki lengur rétt
			var x = e.pageX-position.left; // mouse x
			var y = e.pageY-position.top;
			var bullet_startx = fix_xpos+sprite_offset_x+xpos; // weird
			var bullet_starty = fix_ypos+sprite_offset_y+ypos; // weird xpos sprite_X_OFFSET
			bullets.push({ start_pos: [bullet_startx, bullet_starty],
				curr_pos: [bullet_startx, bullet_starty],
				end_pos: [x+xpos, y+ypos],
				speed: 14,
				type: 'troll',
				i: 0 
			});		
		}
    });
	
	var enemy_fire_ms = 1000;
	var t = setInterval("goblinFire()", enemy_fire_ms); 
	
	initiateGame();
});

function initiateGame() {
	game_over = false;
	bullets = [];
	birdxpos = 100;
	birdypos = 100;
	birdsize = 20;
	birdcolor = "rgb(255,0,0)";
	updown = "up";
	leftright="left";
	countShotBirds = 0;
	countAmmunition = 100;
	spriteCounter = 0;
	setLife(100);
	ctx1.clearRect(0,0,canvaswidth,canvasheight);
	ctx2.clearRect(0,0,canvaswidth,canvasheight);
	ctx3.clearRect(0,0,canvaswidth,canvasheight);
	ctx4.clearRect(0,0,canvaswidth,canvasheight);
}

function gameLoop() {
	var now = Date.now();
    var dt = (now - lastTime) / 1000.0
	if(!game_over) {
		spriteCounter++;
		goblinSprite.update(spriteCounter);
		if(charMoving){
			playerSprite.update(dt);
		}
	   
		clearGameState();
		if (countAmmunition > 0) writeGameState();
		else writeGameOver();
		
		updateBullets();
		goblinCollisionWithPlayer();
		collisionWithWalls();
		
		clearGoblin();
		moveBird();
		drawBird();

		clearCharacter();
		moveCharacter();
		drawCharacter();
		
		redraw_background(background, -xpos, -ypos);
	}
	 lastTime = now;
}

// ==============================

function redraw_background(img, offset_x, offset_y){
	// create pattern
	var ptrn = ctx1.createPattern(img,'repeat');
	ctx1.fillStyle = ptrn;
	var fill_x = $('.canvas-container').width();; // could be canvas.width
	var fill_y = canvasheight; // could be canvas.height
	ctx1.translate(offset_x, offset_y); 
	ctx1.fillRect(-offset_x, -offset_y, fill_x, fill_y);
	ctx1.translate(-offset_x, -offset_y);
}

function writeGameState() {    
	var goblins_shot;
	if(countShotBirds == 1) {
		goblins_shot = countShotBirds+" goblin";
	}
	else {
		goblins_shot = countShotBirds+" goblins";
	}
	$('#goblin_count').html(goblins_shot);
	var xp = countShotBirds*10;
	$('#xp').html(xp);
	var lvl = Math.max(0, Math.floor(Math.log(xp)));
	$('#level').html(lvl);
	/*
    ctx3.fillStyle = '#000';
    ctx3.font = '30px verdana';
    ctx3.textBaseline = 'top';
    ctx3.fillText('You have '+countAmmunition+' shots left',30,0);
    ctx3.fillText('You have shot '+countShotBirds+' balloons.',30,30);
	*/
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
    /*
	ctx3.fillStyle = "rgb(255,255,255)";
    ctx3.fillRect(0,0,500,100);  
	*/
}

function collisionWithWalls() {
	// Fjarlægja þetta fall fyrst veggir eru ekki lengur til!!? 
	// Skipta um nafn og búa til nýtt fall
	// so enemies are generated near player!
    if(birdxpos < birdsize/2) leftright="right";
    if(birdxpos > (canvaswidth-birdsize/2) ) leftright="left";
    
    if(birdypos < birdsize/2) updown="down";
    if(birdypos > (canvasheight-birdsize/2)) updown="up";
}

function didCollideWithPlayer(x, y) {
	var give_me_a_break = 15; // this is so you can barely escape with the knees 
	if( (x-xpos) > (fix_xpos + give_me_a_break) 
	&& (x-xpos) < (fix_xpos + width - give_me_a_break) 
	&& (y-ypos) > (fix_ypos + give_me_a_break) 
	&& (y-ypos) < (fix_ypos + height - give_me_a_break) ) {
		return true;
	}
	else {
		return false;
	}
}

function goblinCollisionWithPlayer() {
    if( didCollideWithPlayer(birdxpos, birdypos)) {
		var life = getLife();
		var dmg = 20;
		if (life > dmg ) { // player still lives
			annoyed1.play();
			setLife( life - dmg);
			createRandomBird(); // create new bird
			// life -10
		}
		else { // player died
			setLife(0);
			// display score
		}
        // listen to: http://www.thanatosrealms.com/war2/horde-sounds
    }
}

function getLife() {
	return $('.progress-bar span').html();
}

function setLife (hp) {
	$('.progress-bar span').html(hp);
	$('.progress-bar').css('width',hp+'%')
	$('.progress-bar').attr('aria-valuenow', hp)
	if(hp > 60) {
		$('.progress-bar').attr('class', 'progress-bar progress-bar-success');
	}
	else if(hp == 0) {
		game_over = true;
		death.play();
	} else if (hp < 30 ) {
		$('.progress-bar').attr('class', 'progress-bar progress-bar-danger');
	}
	else { // 20 <= hp < 50
		$('.progress-bar').attr('class', 'progress-bar progress-bar-warning');
	}
}
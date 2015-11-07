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

sh_player.charMoving = false;

var sprite_offset_x = 46;
var sprite_offset_y = 20;

var bullets = [];
var last_fired = Date.now();

var game_over = false;
var lastTime;

$(document).ready(function() {
	music.play();
	
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
	spriteCounter = 0;
	sh_sidebar.setLife(100);
	sh_sidebar.writeGameState();
	$('#health').show();
	$('#death').hide();
	$('#loot').empty();
	ctx1.clearRect(0,0,canvaswidth,canvasheight);
	ctx2.clearRect(0,0,canvaswidth,canvasheight);
	ctx3.clearRect(0,0,canvaswidth,canvasheight);
	ctx4.clearRect(0,0,canvaswidth,canvasheight);
}

function gameLoop() {
	if(game_over) {
		sh_sidebar.gameOver();
	}
	else {
		var now = Date.now();
		var dt = (now - lastTime) / 1000.0
	
		spriteCounter++;
		//for( i=0; i < goblins.len ; i++)
		//{
		//	goblins[i].update(spriteCounter);
		//}
		//goblinSprite.update(spriteCounter);
		goblins[0].update(spriteCounter);
		if(sh_player.charMoving){
			playerSprite.update(dt);
		}
	   
		updateBullets();
		goblinCollisionWithPlayer();
		collisionWithWalls();
		
		clearGoblin();
		moveBird();
		drawBird();

		sh_player.clearCharacter();
		sh_player.moveCharacter();
		sh_player.drawCharacter();
		
		redraw_background(background, -xpos, -ypos);
	
		
		lastTime = now;
	}
}
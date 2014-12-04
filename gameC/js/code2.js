var layer1;
var layer2;
var layer3;
var layer4;
var ctx1;
var ctx2;
var ctx3;
var ctx4;

var canvaswidth = 900;
var canvasheight = 900;

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
	
	var t=setInterval("gameLoop()",refreshRate);
	
	$('.canvas-container').mousedown(function myDown(e) {
		var time_between_arrows = 170; // milliseconds
		if(last_fired + time_between_arrows < Date.now()) {
			last_fired = Date.now();
			countAmmunition--;
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
}

function gameLoop() {
	if(!game_over) {
		spriteCounter++;
		goblinSprite.update(spriteCounter);
	   
		clearGameState();
		if (countAmmunition > 0) writeGameState();
		else writeGameOver();
		
		updateBullets();
		collisionWithPlayer();
		collisionWithWalls();
		
		clearGoblin();
		moveBird();
		drawBird();

		clearCharacter();
		moveCharacter();
		drawCharacter();
		
		redraw_background(background, -xpos, -ypos);
	}
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

function goblinFire() {
	// Til að láta goblins skjóta
	bullets.push({ start_pos: [birdxpos, birdypos],
					curr_pos: [birdxpos, birdypos],
					end_pos: [xpos+fix_xpos+40, ypos+fix_ypos+40],
					speed: 4,
					type: 'goblin',
					i: 0
	});
}

function clearGoblin() {
    //if (spriteCounter%2 == 0){
        ctx2.clearRect(birdxpos-20-xpos, birdypos-20-ypos, 45, 45);
    //}
}

function clearCharacter() {
	ctx3.clearRect(fix_xpos,fix_ypos,width,height);
}
	
function moveCharacter() {
	var char_speed = 3;
	if(keydown.left || keydown.a) {
        xpos -= char_speed;
		chardirection = "left";
    }	
	if(keydown.right || keydown.d) {
        xpos += char_speed;
		chardirection = "right";
    }
	if(keydown.down || keydown.s) {
        ypos += char_speed;
		chardirection = "down";
    }
	if(keydown.up || keydown.w) {
        ypos -= char_speed;
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
	    if(gameLoopCounter == 7) {
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
    ctx3.drawImage(imgChar, sx, sy, swidth, sheight, fix_xpos, fix_ypos, width, height);
}

function updateBullets() {
	for(var i=0; i<bullets.length; i++) {
        var bullet = bullets[i];
		
		// clear Old bullet
		ctx4.clearRect(bullet.curr_pos[0]-xpos-30, bullet.curr_pos[1]-ypos-30, 60, 60);
		if( (bullet.i * bullet.speed) > 600) { // delete bullet
            bullets.splice(i, 1);
            i--;
			return;
        }
		
		var p1 = bullet.start_pos; 
		var p2 = bullet.end_pos;
		var angle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
		bullet.curr_pos = [p1[0]+bullet.speed*bullet.i*Math.cos(angle), p1[1]+bullet.speed*bullet.i*Math.sin(angle)];
		bullet.i += 1; // move bullet, increment its i value (not the same as the loop value
		
		var arrow_img_offset = 9*Math.PI/8+0.4;
		var bullet_img;
		switch(bullet.type) {
			case('troll'):
				bullet_img = rock_img;
				break;
			case('goblin'):
				bullet_img = arrow_img;
				break;
		}
		drawRotatedImage(bullet_img, bullet.curr_pos[0]-xpos, bullet.curr_pos[1]-ypos, angle+arrow_img_offset, ctx4);
		checkBulletsHit();
    }
}

function checkBulletsHit() {
	for(var i=0; i<bullets.length; i++) {
        var bullet = bullets[i];
		if ( bullet.type =='troll') { // we are shooting goblins
			var hitbox= 10;
			
			if( (birdxpos - hitbox) < bullet.curr_pos[0]
			&& (bullet.curr_pos[0] ) < (birdxpos + hitbox) 
			&& (birdypos - hitbox) < bullet.curr_pos[1]
			&& bullet.curr_pos[1] < (birdypos + hitbox) 
			&& countAmmunition > 0) {
				// some winning condition
				wilhelm_scream.play();
				countShotBirds++;
				createRandomBird();
			}
		}
		if (bullet.type =='goblin') {
			// colliding with guy
			var give_me_a_break = 15; // this is so you can barely escape with the knees 
			if( (bullet.curr_pos[0]-xpos) > (fix_xpos + give_me_a_break) 
			&& (bullet.curr_pos[0]-xpos) < (fix_xpos + width - give_me_a_break) 
			&& (bullet.curr_pos[1]-ypos) > (fix_ypos + give_me_a_break) 
			&& (bullet.curr_pos[1]-ypos) < (fix_ypos + height - give_me_a_break) ) {
				// some winning condition
				var life = getLife();
				var dmg = 10;
				if (life > dmg ) { // player still lives
					annoyed1.play();
					setLife( life - dmg);
				}
				else { // player died
					setLife(0);
					// ogre died game over
					// display score
				}
				// delete arrow
				bullets.splice(i, 1);
				i--;
			}
		}
	}
}

function drawRotatedImage(image, x, y, angle, context) { 
    // save the current co-ordinate system 
    // before we screw with it
    // move to the middle of where we want to draw our image
    // rotate around that point, converting our 
    // angle from degrees to radians 
    // draw it up and to the left by half the width
    // and height of the image 
    // and restore the co-ords to how they were when we began
	context.save(); 
	context.translate(x, y);
	context.rotate(angle);
	context.drawImage(image, -(image.width/2), -(image.height/2));
	context.restore(); 
}

function createRandomBird() {
	clearGoblin(); // clear old
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
	goblinSprite.location = [birdxpos-16-xpos,birdypos-16-ypos];
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
    //ctx2.fillStyle = birdcolor;
    //ctx2.beginPath();
    //var radius = birdsize/2;
    //ctx2.arc(birdxpos, birdypos, radius, 13, Math.PI*2, true); 
    //ctx2.closePath();
    //ctx2.fill();

    //ctx2.drawImage(TIE1,birdxpos-radius*0.8,birdypos-radius*0.8);
    //goblinSprite.drawSprite(birdxpos-radius*0.8,birdypos-radius*0.8, ctx2);
    
    //if (spriteCounter%3 == 0){
    //    clearGoblin();
    //}
   
    if(birdKind=="horiz"){
		if(leftright =="right") /* draw right goblin*/
			goblinSprite.dir = 'right';
		else /* draw left goblin */
			goblinSprite.dir = 'left';
    }
    else {
		if(updown =="up") /* draw up goblin */
			goblinSprite.dir = 'back';
		else /* draw down goblin*/
			goblinSprite.dir = 'front';
    }
	goblinSprite.render(ctx2);
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
	goblinSprite.location = [birdxpos-16-xpos,birdypos-16-ypos];
   
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

function collisionWithPlayer() {
    var give_me_a_break = 15; // this is so you can barely escape with the knees 
    if( (birdxpos-xpos) > (fix_xpos + give_me_a_break) 
	&& (birdxpos-xpos) < (fix_xpos + width - give_me_a_break) 
	&& (birdypos-ypos) > (fix_ypos + give_me_a_break) 
	&& (birdypos-ypos) < (fix_ypos + height - give_me_a_break) ) {
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
function goblinFire() {
	// Til að láta goblins skjóta
	
	
	/* rewrite this:
	xpos, ypos
	
	player = {
		fix_pos: {x : 1, y : 1 },
		world_pos: { x : 1, y : 1 }
	}
	
	xpos = player.world_pos.x
	fix_xpos = player.fix_pos.x // or player.canvas_pos.x
	
	// WORLD POSITION VS VIEW POSITION
	*/
	
	bullets.push({ start_pos: [goblins[0].location[0] + xpos + goblins[0].size[0]/2, goblins[0].location[1] + ypos],
					curr_pos: [goblins[0].location[0] + xpos + goblins[0].size[0]/2, goblins[0].location[1] + ypos],
					end_pos: [xpos+fix_xpos+40, ypos+fix_ypos+40],
					speed: 4,
					type: 'goblin',
					i: 0
	});
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
			
			if( (goblins[0].location[0] + xpos + goblins[0].size[0]/2 - hitbox) < bullet.curr_pos[0]
			&& (bullet.curr_pos[0] ) < (goblins[0].location[0] + xpos + goblins[0].size[0]/2 + hitbox) 
			&& (goblins[0].location[1] + ypos + goblins[0].size[1]/2 - hitbox) < bullet.curr_pos[1]
			&& bullet.curr_pos[1] < (goblins[0].location[1] + ypos + goblins[0].size[1]/2 + hitbox) 
			) {
				wilhelm_scream.play();
				$('#loot').append('<img src="../images/Icons34x34byAilsEnglish2013/E_Gold01.png"></img>');
				countShotBirds++;
				destroyGoblin(goblins[0]);
				sh_sidebar.writeGameState();
								
				createRandomBird();
			}
		}
		if (bullet.type =='goblin') {
			if( didCollideWithPlayer(bullet.curr_pos[0], bullet.curr_pos[1])) {
				var life = sh_sidebar.getLife();
				var dmg = 10;
				if (life > dmg ) { // player still lives
					annoyed1.play();
					sh_sidebar.setLife( life - dmg);
				}
				else { // player died
					sh_sidebar.setLife(0);
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
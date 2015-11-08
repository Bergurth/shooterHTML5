
function collisionWithWalls() {
	// Fjarlægja þetta fall fyrst veggir eru ekki lengur til!!? 
	// Skipta um nafn og búa til nýtt fall
	// so enemies are generated near player!
    if(goblins[0].location[0] + xpos + goblins[0].size[0]/2 < birdsize/2) leftright="right";
    if(goblins[0].location[0] + xpos + goblins[0].size[0]/2 > (canvaswidth-birdsize/2) ) leftright="left";
    
    if(goblins[0].location[1] + ypos + goblins[0].size[1]/2 < birdsize/2) updown="down";
    if(goblins[0].location[1] + ypos + goblins[0].size[1]/2 > (canvasheight-birdsize/2)) updown="up";
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
    if( didCollideWithPlayer(goblins[0].location[0] + xpos + goblins[0].size[0]/2, goblins[0].location[1] + ypos + goblins[0].size[1]/2)) {
		destroyGoblin(goblins[0], 0);
		var life = sh_sidebar.getLife();
		var dmg = 20;
		if (life > dmg ) { // player still lives
			annoyed1.play();
			sh_sidebar.setLife( life - dmg);
			createRandomBird(); // create new bird
			// life -10
		}
		else { // player died
			sh_sidebar.setLife(0);
			// display score
		}
        // listen to: http://www.thanatosrealms.com/war2/horde-sounds
    }
}
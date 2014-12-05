function collisionWithWalls() {
	// Fjarl�gja �etta fall fyrst veggir eru ekki lengur til!!? 
	// Skipta um nafn og b�a til n�tt fall
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
		destroyGoblin(goblins[0]);
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
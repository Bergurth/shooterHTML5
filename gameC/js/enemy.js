function clearGoblin() {
    //if (spriteCounter%2 == 0){
        //ctx2.clearRect(birdxpos-20-xpos, birdypos-20-ypos, 45, 45);
		for (i=0; i < goblins.length ; i++){
        ctx2.clearRect(goblins[i].location[0], goblins[i].location[1], 45, 45);
		}
    //}
}

function destroyGoblin(sprite) {
	ctx2.clearRect(sprite.location[0], sprite.location[1], 45, 45);
	goblins.pop();
}

function createRandomBird() {
	clearGoblin(); // clear old
	var type = Math.random()<0.5;
	if (type){
		birdKind = "vertical";
	}
	else {
		birdKind = "horiz";
	}
	var random = Math.floor(Math.random()*canvaswidth);
	birdxpos=random;
	random = Math.floor(Math.random()*canvasheight);
	birdypos=random;
	var random1 = Math.floor(Math.random()*150)+50; 
	var random2 = Math.floor(Math.random()*150)+50; 
	var random3 = Math.floor(Math.random()*150)+50; 
	birdcolor = "rgb("+random1+","+random2+","+random3+")";
	
	//original working
	//goblinSprite.location = [birdxpos-16-xpos,birdypos-16-ypos];
	
	//goblins.push( new Sprite([birdxpos-56-xpos,birdypos-56-ypos],'../images/a.png', [0, 0], [33, 33], 0.5, [0, 1, 2, 1], 'front') );
	//var gsprite = new Sprite([birdxpos+18-xpos,birdypos+18-ypos],'../images/a.png', [0, 0], [33, 33], 0.5, [0, 1, 2, 1], 'front');

	goblins.push( new GoblinSprite([birdxpos+18-xpos,birdypos+18-ypos],'../images/a.png', [0, 0], [33, 33], 0.5, [0, 1, 2, 1], 'front', undefined, birdKind, [birdxpos, birdypos]) );

	console.log(goblins);
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
	
	// for each goblin
	// goblinSprite = goblins[0];
    if(goblins[0].kind === "horiz"){
		if(leftright =="right") /* draw right goblin*/{
			//goblinSprite.dir = 'right';
			goblins[0].dir = 'right'
		}
		else /* draw left goblin */{
			//goblinSprite.dir = 'left';
			goblins[0].dir = 'left'
		}
    }
    else {
		if(updown =="up") /* draw up goblin */{
			goblins[0].dir = 'back'
			//goblinSprite.dir = 'back';
		}
		else /* draw down goblin*/{
			//goblinSprite.dir = 'front';
			goblins[0].dir = 'front'
		}
    }
	//goblinSprite.render(ctx2);
	goblins[0].render(ctx2);
}

function moveBird() {
	var random =Math.floor(Math.random()*45);
	if(goblins[0].kind === "horiz"){
    
		if(random == 5) updown = "up";
		if(random == 6) updown = "down";
		if(updown =="up") goblins[0].absloc[1] -= speed;
		else goblins[0].absloc[1] += speed;

		if(leftright =="right") goblins[0].absloc[0] += speed;
		else goblins[0].absloc[0] -= speed;
	}
	else {
		if(random == 5) leftright = "up";
		if(random == 6) leftright = "down";
		if(updown =="up") goblins[0].absloc[1] -= speed;
		else goblins[0].absloc[1] += speed;

		if(leftright =="right") goblins[0].absloc[0] += speed;
		else goblins[0].absloc[0] -= speed;
	}
	//goblinSprite.location = [goblins[0].absloc[0]-16-xpos,goblins[0].absloc[1]-16-ypos];
	goblins[0].location = [goblins[0].absloc[0]-goblins[0].size[0]/2-xpos,goblins[0].absloc[1]-goblins[0].size[1]/2-ypos];
}

// goblins[0].location[0] + xpos + goblins[0].size[0]/2  == birdxpos == goblins[0].absloc[0]
// goblins[0].location[1] + ypos + goblins[0].size[1]/2  == birdypos == goblins[0].absloc[1]
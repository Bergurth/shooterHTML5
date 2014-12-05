function clearGoblin() {
    //if (spriteCounter%2 == 0){
        ctx2.clearRect(birdxpos-20-xpos, birdypos-20-ypos, 45, 45);
		for (i=0; i < goblins.length ; i++){
        ctx2.clearRect(goblins[i].location[0], goblins[i].location[1], 45, 45);
		}
    //}
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
	goblins.push( new Sprite([birdxpos-56-xpos,birdypos-56-ypos],'../images/a.png', [0, 0], [33, 33], 0.5, [0, 1, 2, 1], 'front') );
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
	goblins[0].render(ctx2);
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
	goblins[0].location = [birdxpos-56-xpos,birdypos-56-ypos];
}
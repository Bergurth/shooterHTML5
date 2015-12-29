
var sh_player =( function () {

	var charMoving = false;

function clearCharacter() {
	ctx3.clearRect(fix_xpos,fix_ypos,width,height);
}
	
function moveCharacter() {
	var char_speed = 3;
	if(keydown.left || keydown.a || keydown.n) {
        xpos -= char_speed;
		playerSprite.dir = 'left';
    }	
	if(keydown.right || keydown.d || keydown.u) {
        xpos += char_speed;
		playerSprite.dir = 'right';
    }
	if(keydown.down || keydown.s || keydown.r) {
        ypos += char_speed;
		playerSprite.dir = 'front';
    }
	if(keydown.up || keydown.w || keydown.g) {
        ypos -= char_speed;
		playerSprite.dir = 'back';
    }
	if (keydown.left || keydown.right || keydown.down || keydown.up || keydown.a || keydown.s || keydown.d || keydown.w || keydown.n|| keydown.g|| keydown.r|| keydown.u ) {
		sh_player.charMoving = true;
	}
	else sh_player.charMoving = false;
}

function drawCharacter() {	
	playerSprite.render(ctx3);
}

return {
       	charMoving : charMoving,


        clearCharacter:  clearCharacter,
        moveCharacter:   moveCharacter,
        drawCharacter:   drawCharacter
    };

}());
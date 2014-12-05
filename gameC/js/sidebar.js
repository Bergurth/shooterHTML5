function writeGameState() {    
	// only call this when goblins are killed ... currently it's called again and again, useless!
	
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
	var lvl = Math.max(1, Math.floor(Math.log(xp)));
	$('#level').html(lvl);
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
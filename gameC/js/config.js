
// general settings
var fps = 50;
var refreshRate = 1000/fps;
var speed = 100/fps;
var countShotBirds = 0;
var countAmmunition = 100;

//initial bird situation
var birdxpos = 100;
var birdypos = 100;
var birdsize = 20;
var birdcolor = "rgb(255,0,0)";
var updown = "up";
var leftright="left";
birdKind = "horiz";

//audio
var html5_audiotypes={
	"mp3": "audio/mpeg",
	"mp4": "audio/mp4",
	"ogg": "audio/ogg",
	"wav": "audio/wav"
}

function createsoundbite(sound){
	var html5audio=document.createElement('audio');
	$('#player').append(html5audio);
  	html5audio.id = "html5audio";
	if (html5audio.canPlayType){
		for (var i=0; i<arguments.length; i++){
			var sourceel=document.createElement('source')
			sourceel.setAttribute('src', arguments[i])
			if (arguments[i].match(/\.(\w+)$/i))
				sourceel.setAttribute('type', html5_audiotypes[RegExp.$1])
			html5audio.appendChild(sourceel)
		}
		html5audio.load()
		html5audio.playclip=function(){
			html5audio.pause()
			html5audio.currentTime=0
			html5audio.play()
		}
		return html5audio
	}
	else{
		return {playclip:function(){throw new Error("Sorry brah, yo browser too ol' get Chrome or sumtin!")}}
	}
}


var music = new Audio('../sounds/bergur_music.mp3');
music.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

var shot=createsoundbite("../sounds/sniper_shot.wav");
	shot.volume=0.05;
var wilhelm_scream=createsoundbite('../sounds/wilhelm_scream.mp3');
	wilhelm_scream.volume = 0.25;


// Images
var imgChar = new Image();
//imgChar.src = "http://www.elfquest.com/social/file/pic/photo/2012/01/TrollHammer-ogre_500.png";
imgChar.src = "../images/trollhammer.png";

var arrow_img = new Image();
arrow_img.src = "../images/S_Bow01.png";
var rock_img = new Image();
rock_img.src = "../images/W_Fist003.png";
// http://stackoverflow.com/questions/7698949/moving-the-start-position-of-canvas-pattern
// create new image object to use as pattern
var background = new Image();
background.src = "../images/2.jpg";
//  img.onload = 


// This is camera coordinates:
var fix_xpos = 400;
var fix_ypos = 400;

// This is player coordinates: in the world. world coordinates:
var xpos = 100;
var ypos = 100;
var width = 91;
var height = 125;

var xstart = 4
var sx = xstart;
var sy = 0;
var swidth = width;
var sheight = height;

var gameLoopCounter = 0;
var chardirection = "down";
var charMoving = false;
var direction_arr = {"down": 0, "left": 1, "right": 2, "up": 3};

var annoyed1=new Audio("../sounds/annoyed1.wav");
var annoyed2=new Audio("../sounds/annoyed2.wav");
var death=new Audio("../sounds/death.wav");
var laser=createsoundbite("../sounds/death-coil.wav");
laser.volume=0.1; // var alltof hátt


function Sprite(location, url, pos, size, speed, frames, dir, once) {
    this.pos = pos;
    this.size = size;
    this.speed = typeof speed === 'number' ? speed : 0;
    this.frames = frames;
    this._index = 0;
    this.url = url;
    this.dir = dir || 'front';
    this.once = once;
	this.image = new Image();
	this.image.src = url;
	this.location = location;
};


Sprite.prototype.update = function(dt) {
    this._index += this.speed*dt;
}

Sprite.prototype.render = function(ctx) {
    var frame;

    if(this.speed > 0) {
        var max = this.frames.length;
        var idx = Math.floor(this._index);
        frame = this.frames[idx % max];

        if(this.once && idx >= max) {
            this.done = true;
            return;
        }
    }
    else {
        frame = 0;
    }


    var x = this.pos[0];
    var y = this.pos[1];

    if(this.dir == 'left') {
        y = this.size[1];
    }
	else if(this.dir == 'right') {
        y = this.size[1]*2;
    }
    else if(this.dir == 'back') {
        y = this.size[1]*3;
    }
	else if(this.dir == 'front') {
        y = 0;
    }
	
    x += frame * this.size[0];
    
	ctx.drawImage(this.image,
                  x, y,
                  this.size[0], this.size[1],
                  this.location[0], this.location[1],
                  this.size[0], this.size[1]);
}

goblinSprite = new Sprite([birdxpos-16,birdypos-16],'../images/a.png', [0, 0], [33, 33], 0.5, [0, 1, 2, 1], 'front');
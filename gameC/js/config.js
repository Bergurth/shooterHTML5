
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

var TIEwar = new Image();
TIEwar.src ='../images/tie-fighter-space-wars.jpg'; 

var TIE1 = new Image();
//TIE1.src ='../images/TIE2.jpg';
TIE1.src = "../images/280px-PNG_transparency_demonstration_1.png";

//var troll = new Image();
//troll.src ='../images/trollhammer.png';

// troll position
var imgChar = new Image();
//imgChar.src = "http://www.elfquest.com/social/file/pic/photo/2012/01/TrollHammer-ogre_500.png";
imgChar.src = "../images/trollhammer.png";
//imgChar.src = "../images/070-Goblin04.png";
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
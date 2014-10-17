
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


var music = new Audio('bergur_music.mp3');
music.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

var shot=createsoundbite("sniper_shot.wav");
	shot.volume=0.05;
var wilhelm_scream=createsoundbite('wilhelm_scream.mp3');
	wilhelm_scream.volume = 0.25;


// Images

var TIEwar = new Image();
TIEwar.src ='images/tie-fighter-space-wars.jpg'; 

var TIE1 = new Image();
TIE1.src ='images/TIE2.jpg';

var troll = new Image();
troll.src -'images/TrollHammer-ogre_500.png'

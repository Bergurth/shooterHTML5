
// general settings
var fps = 50;
var refreshRate = 1000/fps;
var speed = 100/fps;
var countShotBirds = 0;
var canvaswidth = 900; // we can use jquery to adjust this to user screen
var canvasheight = 900; // 

//initial bird situation
var birdxpos = 100;
var birdypos = 100;
var birdsize = 20;
var birdcolor = "rgb(255,0,0)";
var updown = "up";
var leftright="left";
birdKind = "horiz";

var music = new Audio('../sounds/bergur_music.mp3');
music.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

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

// player image size
/*
var player {
	width: 91,
	height: 125
}
*/
var width = 91;
var height = 125;

// coordinates of character on canvas / camera view
var fix_xpos = canvaswidth/2 - width/2;
var fix_ypos = canvasheight/2 - height/2;

// This is player coordinates: in the world. world coordinates:
var xpos = 100;
var ypos = 100;


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


goblinSprite = new Sprite([birdxpos-16,birdypos-16],'../images/a.png', [0, 0], [33, 33], 0.5, [0, 1, 2, 1], 'front');
goblinSprite2 = new Sprite([fix_xpos-116,fix_xpos-116],'../images/a.png', [0, 0], [33, 33], 0.5, [0, 1, 2, 1], 'front');
var goblins = [goblinSprite2]; 


playerSprite = new Sprite([fix_xpos,fix_ypos],'../images/trollhammer.png', [5, 0], [91, 125], 6, [0, 1, 2, 3, 2, 1], 'front');
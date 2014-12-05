function redraw_background(img, offset_x, offset_y){
	// create pattern
	var ptrn = ctx1.createPattern(img,'repeat');
	ctx1.fillStyle = ptrn;
	var fill_x = $('.canvas-container').width();; // could be canvas.width
	var fill_y = canvasheight; // could be canvas.height
	ctx1.translate(offset_x, offset_y); 
	ctx1.fillRect(-offset_x, -offset_y, fill_x, fill_y);
	ctx1.translate(-offset_x, -offset_y);
}

function drawRotatedImage(image, x, y, angle, context) { 
    // save the current co-ordinate system 
    // before we screw with it
    // move to the middle of where we want to draw our image
    // rotate around that point, converting our 
    // angle from degrees to radians 
    // draw it up and to the left by half the width
    // and height of the image 
    // and restore the co-ords to how they were when we began
	context.save(); 
	context.translate(x, y);
	context.rotate(angle);
	context.drawImage(image, -(image.width/2), -(image.height/2));
	context.restore(); 
}

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
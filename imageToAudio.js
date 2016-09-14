

var image = document.getElementById("img");
var canvas = document.getElementById("canvas");

canvas.height = image.height;
canvas.width = image.width;

var context = canvas.getContext("2d");

context.drawImage(image, 0, 0);


var idata = context.getImageData(0, 0, canvas.width, canvas.height);
var imageData = idata.data;

for(var i = 0; i < imageData.length; i += 4){
	if(imageData[i] < 128){
		imageData[i] = 255;
		imageData[i+1] = 255;
		imageData[i+2] = 255;
	} else {
		imageData[i] = 0;
		imageData[i+1] = 0;
		imageData[i+2] = 0;
	}
}

context.putImageData(idata, 0, 0);

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var buffer = audioCtx.createBuffer(1, ~~(imageData.length/4)*4, audioCtx.sampleRate);

var nowBuffering = buffer.getChannelData(0);
for(var i = 0; i < imageData.length; i += 4){
	//nowBuffering[~~(i/4)] = imageData[i]/255;

	if(imageData[i] > 128){
		nowBuffering[~~(i)] = (((i/4)%canvas.width)/canvas.width)-1;
		nowBuffering[~~(i)+1] = (((i/4)%canvas.width)/canvas.width)-1;
		nowBuffering[~~(i)+2] = (((i/4)%canvas.width)/canvas.width)-1;
		nowBuffering[~~(i)+3] = (((i/4)%canvas.width)/canvas.width)-1;
	} else {
		nowBuffering[~~(i)] = -1;
		nowBuffering[~~(i)+1] = -1;
		nowBuffering[~~(i)+2] = -1;
		nowBuffering[~~(i)+3] = -1;
	}
}

var x = 0;
var line = [];
for(var a in nowBuffering){
	if(nowBuffering[a] != -1){
		line.push(nowBuffering[a]);
	}
	x++;
	if(x == canvas.width-1){
		x = 0;
		console.log(line);
		line = [];
	}
}

var source = audioCtx.createBufferSource();
source.buffer = buffer;
source.connect(audioCtx.destination);


var button = document.getElementById("button");

button.onclick = function(){
	console.log(nowBuffering);
	source.loop = true;
	source.start();
}
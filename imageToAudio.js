

var image = document.getElementById("img");
var canvas = document.getElementById("canvas");

canvas.height = image.height;
canvas.width = image.width;

var context = canvas.getContext("2d");

context.drawImage(image, 0, 0);


var idata = context.getImageData(0, 0, canvas.width, canvas.height);
var imageData = idata.data;

var pixels = [];

for(var i = 0; i < imageData.length; i += 4){
	if(imageData[i] < 128){
		imageData[i] = 255;
		imageData[i+1] = 255;
		imageData[i+2] = 255;

		pixels.push([
			(((i/4)%canvas.width)/canvas.width)-1
			,0-(~~((i/4)/canvas.width)/canvas.height)
		]);
		
	} else {
		imageData[i] = 0;
		imageData[i+1] = 0;
		imageData[i+2] = 0;
	}
}

context.putImageData(idata, 0, 0);

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var buffer = audioCtx.createBuffer(2, pixels.length, audioCtx.sampleRate);

var ch0 = buffer.getChannelData(0);
var ch1 = buffer.getChannelData(1);

for(var i in pixels){
	//ch1[~~(i/4)] = imageData[i]/255;

	ch0[i] = pixels[i][0]
	ch1[i] = pixels[i][1]
}

var source = audioCtx.createBufferSource();
source.buffer = buffer;
source.connect(audioCtx.destination);


var button = document.getElementById("button");

button.onclick = function(){
	//console.log(ch1);
	source.loop = true;
	source.playbackRate.value = 0.7;
	source.start();
	//console.log(audioCtx.state);
	//setTimeout(function(){console.log(audioCtx.state);}, 200);
}

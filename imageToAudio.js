

var image = document.getElementById("img");
var canvas = document.getElementById("canvas");

image.onload = function(){
	buildAudioStream(image);
};

function buildAudioStream(image){

	var samplesPerPixel = 5;

	canvas.height = image.height;
	canvas.width = image.width;

	var context = canvas.getContext("2d");

	context.drawImage(image, 0, 0);


	var idata = context.getImageData(0, 0, canvas.width, canvas.height);
	var imageData = idata.data;

	var pixels = 0;
	var lines = [];

	for(var i = 0; i < imageData.length; i += 4){
		if(imageData[i] < 128){
			imageData[i] = 255;
			imageData[i+1] = 255;
			imageData[i+2] = 255;

			var line = ~~((i/4)/canvas.width);

			if(typeof lines[line] == "undefined"){
				lines[line] = [];
			}

			lines[line].push([
				(((i/4)%canvas.width)/canvas.width)-1
				,0-line/canvas.height
			]);
			pixels++;
			
		} else {
			imageData[i] = 0;
			imageData[i+1] = 0;
			imageData[i+2] = 0;
		}
	}

	context.putImageData(idata, 0, 0);

	var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	var buffer = audioCtx.createBuffer(2, pixels*samplesPerPixel, audioCtx.sampleRate);

	var ch0 = buffer.getChannelData(0);
	var ch1 = buffer.getChannelData(1);

	var interlace = 1;

	var passes = 0;
	var l = 0;
	var i = 0;
	
	while(true){
		var line = lines[l];
		for(var px in line){
			for(var a = 0; a < samplesPerPixel; a++){
				ch0[i*samplesPerPixel+a] = line[px][0];
				ch1[i*samplesPerPixel+a] = line[px][1];
			}
			i++;
		}
		l += interlace;
		
		if(l >= lines.length){
			passes++;
			if(passes < interlace){
				l = passes;
			} else {
				break;
			}
		}
	}

	var source = audioCtx.createBufferSource();
	source.buffer = buffer;

	var gainNode = audioCtx.createGain();

	source.connect(gainNode);

	gainNode.connect(audioCtx.destination);

	source.loop = true;
	source.playbackRate.value = document.getElementById("rate").value;

	var button = document.getElementById("button");

	var playing = false;

	button.onclick = function(){

		if(!playing){
			source.start();
			playing = true;
			button.innerHTML = "Stop";
		} else {
			source.stop();
			playing = false;
			button.innerHTML = "Play";
		}
		
	}

	document.getElementById("rate").oninput = function(){
		source.playbackRate.value = document.getElementById("rate").value;
		document.getElementById("rateValue").innerHTML = document.getElementById("rate").value;
	}

	document.getElementById("volume").oninput = function(){
		gainNode.gain.value = document.getElementById("volume").value;
		document.getElementById("volumeValue").innerHTML = document.getElementById("volume").value;
	}
}

document.getElementById("samples").oninput = function(){
	//buildAudioStream(image);
	document.getElementById("samplesValue").innerHTML = document.getElementById("samples").value;
}







































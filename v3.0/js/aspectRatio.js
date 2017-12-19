var w = 1920, h = 1080;
var ratio;

window.addEventListener('resize', resize, false);

function maintainAspectRatio() {
	ratio = window.innerWidth / w;
	if (h * ratio > innerHeight) {
	    ratio = innerHeight / h;
	}
	w *= ratio;
	h *= ratio;
	//stage.canvas.width = w;
	//stage.canvas.height = h;
	//stage.canvas.style.top = (Math.abs(innerHeight - h)/2) + "px";
}

function resize() { 
    maintainAspectRatio();
}
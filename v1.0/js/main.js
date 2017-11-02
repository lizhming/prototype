"use strict"
var canvas, stage;
var w = 1920, h = 1080;
var ratio;
var mouseTarget;	// the display object currently under the mouse, or being dragged
var dragStarted;	// indicates whether we are currently in a drag operation
var offset;
var update = true;

window.addEventListener('resize', resize, false);

function maintainAspectRatio() {
	ratio = window.innerWidth / w;
	if (h * ratio > innerHeight) {
	    ratio = innerHeight / h;
	}
	w *= ratio;
	h *= ratio;
	stage.canvas.width = w;
	stage.canvas.height = h;
}

function init() {
	// create stage and point it to the canvas:
	canvas = document.getElementById("testCanvas");
	stage = new createjs.Stage(canvas);

	// enable touch interactions if supported on the current device:
	stage.autoClear = true;
	createjs.Touch.enable(stage);
	stage.preventSelection = false;

	// enabled mouse over / out events
	stage.enableMouseOver(10);
	stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas

	// load the source image:
	var image = new Image();
	image.src = "../v1.0/images/sticky_note_cp.jpg";
	image.onload = handleImageLoad;
}

function resize() { 
    maintainAspectRatio();
}

function stop() {
	createjs.Ticker.removeEventListener("tick", tick);
}

function handleImageLoad(event) {
	var image = event.target;
	var bitmap;
	var container = new createjs.Container();
	stage.addChild(container);

	// create and populate the screen with random daisies:
	for (var i = 0; i < 7; i++) {
		bitmap = new createjs.Bitmap(image);
		container.addChild(bitmap);
		bitmap.x = (canvas.width*0.75) * Math.random() | 0;
		bitmap.y = (canvas.height*0.75) * Math.random() | 0;
		//bitmap.rotation = 360 * Math.random() | 0;
		bitmap.regX = bitmap.image.width / 2 | 0;
		bitmap.regY = bitmap.image.height / 2 | 0;
        bitmap.scale = bitmap.originalScale = Math.random() * 0.4 + 0.6;
        bitmap.name = "bmp_" + i;
		bitmap.cursor = "hand";

		// using "on" binds the listener to the scope of the currentTarget by default
		// in this case that means it executes in the scope of the button.
		bitmap.on("mousedown", function (evt) {
			this.parent.addChild(this);
			this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
		});

		// the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
		bitmap.on("pressmove", function (evt) {
			this.x = evt.stageX + this.offset.x;
			this.y = evt.stageY + this.offset.y;
			// indicate that the stage should be updated on the next tick:
			update = true;
		});

		bitmap.on("rollover", function (evt) {
			this.scale = this.originalScale * 1.2;
			update = true;
		});

		bitmap.on("rollout", function (evt) {
			this.scale = this.originalScale;
			update = true;
		});

	}

	createjs.Ticker.addEventListener("tick", tick);
}

function tick(event) {
	if (update) {
		update = false;
		stage.update(event);
	}
}

"use strict"
var canvas, stage;
var detailContainer, codebook, viz;

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

	resize();

	createjs.Ticker.addEventListener("tick", tick);

	detailContainer = makeDetailsArea();
	codebook = makeCodebookArea();
	viz = makeVizArea();
	
	// load the source image:
	var image = new Image();
	image.src = "../v2.0/images/note.png";
	image.onload = handleImageLoad;
}

function tick(event) {
	stage.update();
}

function handleImageLoad(event) {
	var image = event.target;
	var bitmap;
	var bounds = detailContainer.getBounds();

	// create and populate the screen with random daisies:
	for (var i = 0; i < 5; i++) {
		bitmap = new createjs.Bitmap(image);
		bitmap.x = bounds.width * Math.random() * 0.9;
		bitmap.y = bounds.height * Math.random() * 0.9;
		bitmap.regX = bitmap.image.width / 2;
		bitmap.regY = bitmap.image.height / 2;
        bitmap.scaleX = ratio*0.75;
        bitmap.scaleY = ratio*0.75;
        bitmap.name = "bmp_" + i;
		bitmap.cursor = "hand";

		// using "on" binds the listener to the scope of the currentTarget by default
		// in this case that means it executes in the scope of the button.
		bitmap.addEventListener("mousedown", function (evt) {
			// bump the target in front of its siblings:
			var o = evt.target;
			o.parent.addChild(o);
			o.offset = {x: o.x - evt.stageX, y: o.y - evt.stageY};
			evt.stopPropagation();
		});

		// the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
		bitmap.addEventListener("pressmove", function (evt) {
			var o = evt.target;
			o.x = evt.stageX + o.offset.x;
			o.y = evt.stageY + o.offset.y;
			evt.stopPropagation();
		});

		bitmap.addEventListener("rollover", function (evt) {
			var o = evt.target;
			o.scale = o.originalScale * 1.2;
		});

		bitmap.addEventListener("rollout", function (evt) {
			var o = evt.target;
			o.scale = o.originalScale;	
		});

		detailContainer.addChild(bitmap);
	}
}

function makeDetailsArea() {
	var dp = new createjs.DisplayObject();
	dp.hitArea = new createjs.Shape();
	dp.hitArea.graphics.f("#000").drawRect(0, 0, w/2, h);
	var detail = new createjs.Container();
	detail.setTransform(w/2, 0);
	detail.setBounds(0, 0, w/2, h);
	detail.addChild(dp);
	stage.addChild(detail);

	detail.addEventListener("click", clickDHandler);
	detail.addEventListener("mousedown", function(evt) {
		console.log("Down in D");
	});
	detail.addEventListener("pressup", function(evt) {
		console.log("Up in D");
	});
	return detail;
}

function clickDHandler(e) {
	console.log("D: "+ e.rawX +" "+ e.rawY);
}

function makeCodebookArea() {
	var dp = new createjs.DisplayObject();
	dp.hitArea = new createjs.Shape();
	dp.hitArea.graphics.f("#000").drawRect(0, 0, w/2, h/2);
	var detail = new createjs.Container();
	detail.setTransform(0, h/2);
	detail.setBounds(0, 0, w/2, h/2);
	detail.addChild(dp);
	stage.addChild(detail);

	detail.addEventListener("click", clickCHandler);
	detail.addEventListener("mousedown", function(evt) {
		console.log("Down in C");
	});
	detail.addEventListener("pressup", function(evt) {
		console.log("Up in C");
	});
	return detail;
}

function clickCHandler(e) {
	console.log("C: "+ e.rawX +" "+ e.rawY);
}


function makeVizArea() {
	var dp = new createjs.DisplayObject();
	dp.hitArea = new createjs.Shape();
	dp.hitArea.graphics.f("#000").drawRect(0, 0, w/2, h/2);
	var detail = new createjs.Container();
	detail.setTransform(0, 0);
	detail.setBounds(0, 0, w/2, h/2);
	detail.addChild(dp);
	stage.addChild(detail);

	detail.addEventListener("click", clickVHandler);
	detail.addEventListener("mousedown", function(evt) {
		console.log("Down in V");
	});
	detail.addEventListener("pressup", function(evt) {
		console.log("Up in V");
	});
	return detail;
}

function clickVHandler(e) {
	console.log("V: "+ e.rawX +" "+ e.rawY);
}
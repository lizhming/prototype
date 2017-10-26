"use strict"
var canvas, stage;

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

	makeContainers();
}

function tick(event) {
	stage.update();
}

function makeContainers() {
	var hitArea = new createjs.Shape();
	hitArea.graphics.f("#000").drawRect(0, 0, w, h);
	var detail = new createjs.Container();
	detail.setTransform(w/2, 0);
	detail.setBounds(0, 0, w, h);
	detail.hitArea = hitArea;
	stage.addChild(detail);

	detail.on("click", clickHandler);
}

function clickHandler(e) {
	console.log(e.rawX +" "+e.rawY);
}
"use strict"
var canvas, stage;

function init() {
	// create stage and point it to the canvas:
	canvas = document.getElementById("testCanvas");
	stage = new createjs.Stage(canvas);

	maintainAspectRatio();

	// enable touch interactions if supported on the current device:
	stage.autoClear = true;
	createjs.Touch.enable(stage);
	stage.preventSelection = false;

	// enabled mouse over / out events
	stage.enableMouseOver(10);
	stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas
}
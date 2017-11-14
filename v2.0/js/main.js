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

	codebook = makeCodebookArea();
	viz = makeVizArea();

	makeGraphs(viz);

	detailContainer = makeDetailsArea();

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
			o.scaleX = o.scaleX * 0.25;
			o.scaleY = o.scaleY * 0.25;
			o.parent.addChild(o);
			o.offset = {x: o.x - evt.stageX, y: o.y - evt.stageY};
			//evt.stopPropagation();
		});

		// the pressmove event is dispatched when the mouse moves after a mousedown on the 
		// target until the mouse is released.
		bitmap.addEventListener("pressmove", function (evt) {
			var o = evt.target;
			o.x = evt.stageX + o.offset.x;
			o.y = evt.stageY + o.offset.y;
			//evt.stopPropagation();
		});

		bitmap.addEventListener("pressup", function (evt) {
			// bump the target in front of its siblings:
			var o = evt.target;
			o.scaleX = o.scaleX / 0.25;
			o.scaleY = o.scaleY / 0.25;
			o.parent.addChild(o);
			o.offset = {x: o.x - evt.stageX, y: o.y - evt.stageY};
			//evt.stopPropagation();
		});

		bitmap.addEventListener("rollover", function (evt) {
			var o = evt.target;
			o.scaleX = o.scaleX * 1.2;
			o.scaleY = o.scaleY * 1.2;
		});

		bitmap.addEventListener("rollout", function (evt) {
			var o = evt.target;
			o.scaleX = o.scaleX / 1.2;
			o.scaleY = o.scaleY / 1.2;
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

	return detail;
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

	return detail;
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

	//detail.addEventListener("click", clickVHandler);
	
	return detail;
}

function clickVHandler(e) {
	console.log("V: "+ e.rawX +" "+ e.rawY);
}

function makeGraphs(vizContainer) {
	var graph = new BarGraph(vizContainer);
	graph.maxValue = 30000;
	graph.margin = 2;
	graph.colors = ["#49a0d8", "#d353a0", "#ffc527", "#df4c27", "#888888", "#12a0b0"];
	graph.xAxisLabelArr = ["0", "1", "2", "3", "4", "5"];
	graph.update([Math.random() * 30000, Math.random() * 30000, Math.random() * 30000, Math.random() * 30000,
		Math.random() * 30000, Math.random() * 30000]);
}
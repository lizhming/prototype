"use strict"
var canvas, stage;
var detailContainer, codebook, viz;
var graphs = [];
var pos = [{x:100, y:150}, {x:500, y:150}, {x:100, y:350}, {x:500, y:350}];

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

	for(var i=0; i<pos.length; i++) {
		graphs[i] = makeGraphs(viz, pos[i].x * ratio, pos[i].y * ratio);
	}

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
	for (var i = 0; i < 7; i++) {
		bitmap = new createjs.Bitmap(image);
		bitmap.x = (bounds.width * Math.random() * 0.7) + bounds.x;
		bitmap.y = (bounds.height * Math.random() * 0.7) + bounds.y;
		//bitmap.regX = bitmap.image.width / 2;
		//bitmap.regY = bitmap.image.height / 2;
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
			var intersectAt = check(o);
			if(intersectAt != -1) {
				console.log("viz-" + intersectAt);
			}
		});

		bitmap.addEventListener("pressup", function (evt) {
			// bump the target in front of its siblings:
			var o = evt.target;
			var intersectAt = check(o);
			if(intersectAt != -1) {
				console.log("Released at viz-" + intersectAt);
				//detailContainer.removeChild(o);
			}
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

//to check for intersection
function check(obj) {
	for(var i=0; i<graphs.length; i++) {
		if(intersect(obj, graphs[i])) {
			return i;
		}
	}
	return -1;
}

function intersect(obj1, obj2) {
	var objBounds1 = obj1.getBounds().clone();
	var objBounds2 = obj2.getBounds();

	var pt = obj1.globalToLocal(objBounds2.x, objBounds2.y);

	var h1 = -(objBounds1.height + objBounds2.height);
	var h2 = objBounds2.height + objBounds1.height;
	var w1 = -(objBounds1.width + objBounds2.width);
	var w2 = objBounds2.width + objBounds1.width;

	//console.log(h1 + " " + h2 + " " + w1 + " " + w2);
	//console.log(pt.x + " "  + pt.y);

	if(pt.x > w2 || pt.x < w1) return false;
	if(pt.y > h2 || pt.y < h1) return false;

	return true;
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
	detail.addChild(dp.hitArea);
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

function makeGraphs(vizContainer, x, y) {
	var graph = new BarGraph(vizContainer, x, y);
	graph.maxValue = 30;
	graph.margin = 2*ratio;
	graph.colors = ["#49a0d8", "#d353a0", "#ffc527", "#df4c27", "#888888", "#12a0b0"];
	graph.xAxisLabelArr = ["0", "1", "2", "3", "4", "5"];
	graph.update([Math.random() * 30, Math.random() * 30, Math.random() * 30, Math.random() * 30,
		Math.random() * 30, Math.random() * 30]);
	return graph;
}
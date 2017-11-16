"use strict"

/*
* Structure inspired from http://www.williammalone.com/articles/html5-canvas-javascript-bar-graph/
* Modified for creating a prototype compatible with createjs library
*/

function BarGraph(vizContainer, x, y) {

	// Private properties and methods

	var that = this;
	var startArr;
	var endArr;
	var looping = false;

	// Loop method adjusts the height of bar and redraws if neccessary
	var loop = function () {

		var delta;
		var animationComplete = true;

		// Boolean to prevent update function from looping if already looping
		looping = true;

		// For each bar
		for (var i = 0; i < endArr.length; i += 1) {
			// Change the current bar height toward its target height
			delta = (endArr[i] - startArr[i]) / that.animationSteps;
			that.curArr[i] += delta;
			// If any change is made then flip a switch
			if (delta) {
				animationComplete = false;
			}
		}
		// If no change was made to any bars then we are done
		if (animationComplete) {
			looping = false;
		} else {
			// Draw and call loop again
			draw(that.curArr);
			setTimeout(loop, that.animationInterval / that.animationSteps);
		}
	};

	// Draw method updates the canvas with the current display
	var draw = function (arr) {

		var numOfBars = arr.length;
		var barWidth;
		var barHeight;
		var border = 2;
		var ratio;
		var maxBarHeight;
		var gradient;
		var largestValue;
		var graphAreaX = 0;
		var graphAreaY = 0;
		var graphAreaWidth = that.width;
		var graphAreaHeight = that.height;
		var i;

		// Update the dimensions of the canvas only if they have changed
		/*if (vizContainer.getBounds().width/3 !== that.width || vizContainer.getBounds().height/3 !== that.height) {
			that.width = vizContainer.getBounds().width/3;
			that.height = vizContainer.getBounds().height/3;
		}*/

		// Draw the background color
		var bkg  = new createjs.Shape();
		bkg.graphics.beginFill(that.backgroundColor).drawRect(0, 0, that.width*that.ratio, that.height*that.ratio);
		bkg.setTransform(that.x, that.y);
		vizContainer.addChild(bkg);

		// If x axis labels exist then make room	
		if (that.xAxisLabelArr.length) {
			graphAreaHeight -= 40;
		}

		// Calculate dimensions of the bar
		barWidth = graphAreaWidth / numOfBars - that.margin * 2;
		maxBarHeight = graphAreaHeight - 25;

		// Determine the largest value in the bar array
		var largestValue = 0;
		for (i = 0; i < arr.length; i += 1) {
			if (arr[i] > largestValue) {
				largestValue = arr[i];	
			}
		}

		// For each bar
		for (i = 0; i < arr.length; i += 1) {
			// Set the ratio of current bar compared to the maximum
			if (that.maxValue) {
				ratio = arr[i] / that.maxValue;
			} else {
				ratio = arr[i] / largestValue;
			}

			barHeight = ratio * maxBarHeight;

			// Draw bar background
			var bg = new createjs.Shape();
			// Turn on shadow
			bg.shadow = new createjs.Shadow("#999", 2, 2, 2);
			bg.name = "bar-" + i;
			bg.graphics.beginFill("#222").drawRect(
				that.x + (that.margin + i * that.width / numOfBars)*that.ratio,
				that.y + (graphAreaHeight - barHeight)*that.ratio,
				barWidth*that.ratio,
				barHeight*that.ratio);

			// Turn off shadow
			bg.shadow = new createjs.Shadow("#999", 0, 0, 0);
			
			// Draw bar color if it is large enough to be visible
			if (barHeight > border * 2) {
				// Create gradient
				bg.graphics.beginLinearGradientFill([that.colors[i % that.colors.length], "#ffffff"],
					[1, 1-ratio], 0, 0, 0, (graphAreaHeight+that.y)*that.ratio);
				// Fill rectangle with gradient
				bg.graphics.drawRect(that.x + (that.margin + i * that.width / numOfBars + border)*that.ratio,
					that.y + (graphAreaHeight - barHeight + border)*that.ratio,
					(barWidth - border * 2)*that.ratio,
					(barHeight - border * 2)*that.ratio);
			}
			
			// Write bar value
			var text = new createjs.Text(parseInt(arr[i], 10), "bold 20px sans-serif", "#333");
			text.textBaseline = "alphabetic";
			text.textAlign = "center";
			// Use try / catch to stop IE 8 from going to error town
			try {
				text.x = that.x + (i * that.width / numOfBars + (that.width / numOfBars) / 2)*that.ratio;
				text.y = that.y + (graphAreaHeight - barHeight - 10)*that.ratio;
			} catch (ex) {}
			// Draw bar label if it exists
			if (that.xAxisLabelArr[i]) {					
				// Use try / catch to stop IE 8 from going to error town				
				var text = new createjs.Text(that.xAxisLabelArr[i], "bold 20px sans-serif", "#fff");
				text.textBaseline = "alphabetic";
				text.textAlign = "center";
				try{
					text.x = that.x + (i * that.width / numOfBars + (that.width / numOfBars) / 2)*that.ratio;
					text.y = that.y + (that.height - 10)*that.ratio;
				} catch (ex) {}

				text.addEventListener("rollover", function(evt) {
					evt.target.shadow = new createjs.Shadow("#fff", 0, 0, 10);
				});
				text.addEventListener("rollout", function(evt) {
					evt.target.shadow = new createjs.Shadow("#999", 0, 0, 0);
				});
			}

			vizContainer.addChild(text);
			vizContainer.addChild(bg);

			bg.addEventListener("rollover", function(evt) {
				console.log(evt);
				evt.target.shadow = new createjs.Shadow("#fff", 0, 0, 10);
			});
			bg.addEventListener("rollout", function(evt) {
				evt.target.shadow = new createjs.Shadow("#999", 0, 0, 0);
			});
		}
	};

	//to check for intersection
	var intersect = function (obj1, obj2){
		var objBounds1 = obj1.getBounds().clone();
		var objBounds2 = obj2.getBounds().clone();

		var pt = obj1.globalToLocal(objBounds2.x, objBounds2.y);

		var h1 = -(objBounds1.height / 2 + objBounds2.height);
		var h2 = objBounds2.width / 2;
		var w1 = -(objBounds1.width / 2 + objBounds2.width);
		var w2 = objBounds2.width / 2;


		if(pt.x > w2 || pt.x < w1) return false;
		if(pt.y > h2 || pt.y < h1) return false;

		return true;
	};

	// Public properties and methods

	this.width = vizContainer.getBounds().width/3;
	this.height = vizContainer.getBounds().height/3;
	this.x = x;
	this.y = y;
	this.ratio = ratio;	
	this.maxValue;
	this.margin = 5;
	this.colors = ["purple", "red", "green", "yellow"];
	this.curArr = [];
	this.backgroundColor = "green";
	this.xAxisLabelArr = [];
	this.yAxisLabelArr = [];
	this.animationInterval = 100;
	this.animationSteps = 10;

	// Update method sets the end bar array and starts the animation
	this.update = function (newArr) {

		// If length of target and current array is different 
		if (that.curArr.length !== newArr.length) {
			that.curArr = newArr;
			draw(newArr);
		} else {
			// Set the starting array to the current array
			startArr = that.curArr;
			// Set the target array to the new array
			endArr = newArr;
			// Animate from the start array to the end array
			if (!looping) {	
				loop();
			}
		}
	}; 
}
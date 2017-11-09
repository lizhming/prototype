"use strict"

/*
* Structure inspired from http://www.williammalone.com/articles/html5-canvas-javascript-bar-graph/
* Modified for creating a prototype compatible with createjs library
*/

function BarGraph(vizContainer) {

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
		if (vizContainer.getBounds().width !== that.width || vizContainer.getBounds().height !== that.height) {
			that.width = vizContainer.getBounds().width;
			that.height = vizContainer.getBounds().height;
		}

		// Draw the background color
		//ctx.fillStyle = that.backgroundColor;
		//ctx.fillRect(0, 0, that.width, that.height);

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
			bg.graphics.beginFill("#333").drawRect(
				(that.margin + i * that.width / numOfBars)*that.ratio,
				(graphAreaHeight - barHeight)*that.ratio,
				barWidth*that.ratio,
				barHeight*that.ratio);

			// Turn off shadow
			bg.shadow = new createjs.Shadow("#999", 0, 0, 0);
			
			// Draw bar color if it is large enough to be visible
			if (barHeight > border * 2) {
				// Create gradient
				bg.graphics.beginLinearGradientFill([that.colors[i % that.colors.length], "#ffffff"],
					[1-ratio, 1], 0, 0, 0, graphAreaHeight);
				// Fill rectangle with gradient
				bg.graphics.drawRect((that.margin + i * that.width / numOfBars + border)*that.ratio,
					(graphAreaHeight - barHeight + border)*that.ratio,
					(barWidth - border * 2)*that.ratio,
					(barHeight - border * 2)*that.ratio);
			}
			
			// Write bar value
			var text = new createjs.Text(parseInt(arr[i], 10), "bold 12px sans-serif", "#333");
			text.textBaseline = "alphabetic";
			text.textAlign = "center";
			// Use try / catch to stop IE 8 from going to error town
			try {
				text.x = (i * that.width / numOfBars + (that.width / numOfBars) / 2)*that.ratio;
				text.y = (graphAreaHeight - barHeight - 10)*that.ratio;
			} catch (ex) {}
			// Draw bar label if it exists
			if (that.xAxisLabelArr[i]) {					
				// Use try / catch to stop IE 8 from going to error town				
				var text = new createjs.Text(that.xAxisLabelArr[i], "bold 12px sans-serif", "#333");
				text.textBaseline = "alphabetic";
				text.textAlign = "center";
				try{
					text.x = (i * that.width / numOfBars + (that.width / numOfBars) / 20)*that.ratio;
					text.y = (that.height - 10)*that.ratio;
				} catch (ex) {}
			}
			stage.addChild(text);
			stage.addChild(bg);
		}
	};

	// Public properties and methods

	this.width = vizContainer.getBounds().width;
	this.height = vizContainer.getBounds().height;
	this.ratio = ratio;	
	this.maxValue;
	this.margin = 5;
	this.colors = ["purple", "red", "green", "yellow"];
	this.curArr = [];
	this.backgroundColor = "#0f0";
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
import React from 'react';
import * as d3 from 'd3';
import * as d3tip from 'd3-tip';
import file1 from './data/data.csv';
import file2 from './data/data2.csv';
import file3 from './data/data3.csv';

/**
 * Raters Agreement Component in the application
 */

class Rater extends React.Component {
	constructor(props) {
		super(props);
		this.prevFile = "";

		this.renderHeatMap = this.renderHeatMap.bind(this);
		this.getLocalAspectRatio = this.getLocalAspectRatio.bind(this);
	}

	getLocalAspectRatio(w, h, currW, currH) {
		let ratio = currH / h;
		if (w * ratio > currW) {
		    ratio = currW / w;
		}
		return ratio;
	}
  
	// rendering heatmap using d3 js
	renderHeatMap() {
	    var stdHeight = 324, 
	    	stdWidth = 637.98,
	    	currHeight = parseFloat(this.props.height),
	    	currWidth = 0.4 * window.innerWidth,	//40% of screen/parent
			itemSize = 60,
			cellSize = itemSize - 1,
			margin = {top: 40, right: 10, bottom: 10, left: 40};

		var ratio = this.getLocalAspectRatio(stdWidth, stdHeight, currWidth, currHeight);
	      
		var width = (350 - margin.right - margin.left) * ratio,
		  	height = (350 - margin.top - margin.bottom) * ratio;

		var range = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
		var colorRange = ["#fafafa", "#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"];
		var colors = d3.scaleQuantize().range(colorRange);

		var file = Math.floor(Date.now()) % 3 === 0 ? file2 : Math.floor(Date.now()) % 5 === 0 ? file3 : file1;
		if(this.prevFile !== "" && this.prevFile !== file) {
			document.getElementById("loader").style.display = "block";
		}
		
		window.setTimeout(function() {
			document.getElementById("loader").style.display = "none";
		}, 250);
		
		this.prevFile = file;

		itemSize *= ratio;
		cellSize *= ratio;

		d3.csv(file, function ( response ) {

		    var data = response.map(function( item ) {
		        var newItem = {};
		        newItem.country = item.x;
		        newItem.product = item.y;
		        newItem.value = item.value;

		        return newItem;
		    });

		    var x_elements = d3.set(data.map(function( item ) { return item.product; } )).values();
		        //y_elements = d3.set(data.map(function( item ) { return item.country; } )).values(),
		        //relation_values = d3.set(data.map(function( item ) { return item.value; })).values();

		    var r = (x_elements.length) * itemSize;

		    var xScale = d3.scaleOrdinal()
		        .domain([d3.max(data, function(d) {
		        	return d.values;
		        })])
		        .range([0, r/5, 2*r/5, 3*r/5, 4*r/5]);

		    var xAxis = d3.axisBottom()
		        .scale(xScale)
		        .tickFormat(function (d) {
		            return d;
		        });

		    var yScale = d3.scaleOrdinal()
		        .domain([d3.max(data, function(d) {
		        	return d.values;
		        })])
		        .range([0, r/5, 2*r/5, 3*r/5, 4*r/5]);

		    var yAxis = d3.axisLeft()
		        .scale(yScale)
		        .tickFormat(function (d) {
		            return d;
		        });

		    var colorScale = d3.scaleThreshold()
		        .domain(range)
		        .range(colors.range());

		    var svg = d3.select('.heatmap')
		    		.html("")
			        .append("svg")
			        .attr("width", width + margin.left + margin.right)
			        .attr("height", height + margin.top + margin.bottom)
			        .attr("transform", "translate(" + (100 - margin.right) * ratio + "," + (-55 * ratio) + ")")
			        .append("g")
			        .attr("transform", "translate(" + margin.left * ratio + "," + margin.top * ratio + ")");

		    var tip = d3tip()
						.attr('class', 'd3-tip')
						.style("visibility","visible")
						.offset([20 * ratio, 0 * ratio])
						.html(function(d) {
						return "<span style='color:white'> Value: </span><span style='color:red'>" + d.value + "</span>";
						});
			tip(svg.append("g"));

		    svg.selectAll('rect')
		        .data(data)
		        .enter().append('g').append('rect')
		        .attr('class', 'cell')
		        .attr('width', cellSize)
		        .attr('height', cellSize)
		        .attr('y', function(d) { return yScale(d.country); })
		        .attr('x', function(d) { return xScale(d.product); })
		        .attr('fill', function(d) { return colorScale(d.value); })
	          .on('mouseover', tip.show)
	          .on('mouseout', tip.hide);

		    svg.append("g")
		        .attr("class", "y axis")
		        .call(yAxis)
		        .selectAll('text')
		        .attr('font-weight', '900')
		        .attr("transform", function (d) {
		            return "translate(" + 0 * ratio + "," + 30 * ratio + ")";
		        });

		    svg.append("g")
		        .attr("class", "x axis")
		        .call(xAxis)
		        .selectAll('text')
		        .attr('font-weight', '900')
		        .style("text-anchor", "start")
		        .attr("dx", ".8em")
		        .attr("dy", ".5em")
		        .attr("transform", function (d) {
		            return "translate(" + 10 * ratio + "," + (-25 * ratio) + ")";
		        });

		    // adding the legen for the heatmap
		  	var legend = d3.select('.legend')
							.html("")
						    .append('ul')
						    .attr('class', 'list-inline');

				var keys = legend.selectAll('li.key').data(colors.range());

				keys.enter().append('li')
				    .attr('class', 'key')
				    .style('border-left-color', String)
				    .text(function(d) {
				        var r = colors.invertExtent(d);
				        return r[1];
				    });
	  	});
    }


	render() {
		this.renderHeatMap();
		return(
			<div className="container-fluid">
				<div className="legend"></div> 
        <div className="tag" id="low">LOW</div>
				<div className="tag" id="high">HIGH</div>
        <div className="heatmap"></div>
			</div>
			);
	}
}

export default Rater;
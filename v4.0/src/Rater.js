import React from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import file from './data/data.csv';

class Rater extends React.Component {
	constructor(props) {
		super(props);
		const ratio = this.props.ratio;
	}
  
  componentDidMount() {
    var itemSize = 100,
	      cellSize = itemSize - 1,
	      margin = {top: 40, right: 10, bottom: 10, left: 40};
      
	  var width = 450 - margin.right - margin.left,
	      height = 450 - margin.top - margin.bottom;

	  var colors = ["#f7882f", "#f7c331", "#66cc66"];

	  d3.csv(file, function ( response ) {

	    var data = response.map(function( item ) {
	        var newItem = {};
	        newItem.country = item.x;
	        newItem.product = item.y;
	        newItem.value = item.value;

	        return newItem;
	    })

	    var x_elements = d3.set(data.map(function( item ) { return item.product; } )).values(),
	        y_elements = d3.set(data.map(function( item ) { return item.country; } )).values(),
	        relation_values = d3.set(data.map(function( item ) { return item.value; })).values();
	    console.log(x_elements);
	    console.log(y_elements);
	    var r = (x_elements.length) * itemSize;

	    var xScale = d3.scaleOrdinal()
	        .domain([0, d3.max(data, function(d) {
	        	return d.value;
	        })])
	        .range([0, r/4, r/2, 3*r/4]);

	    var xAxis = d3.axisBottom()
	        .scale(xScale)
	        .tickFormat(function (d) {
	            return d;
	        });

	    var yScale = d3.scaleOrdinal()
	        .domain([0, d3.max(data, function(d) {
	        	return d.values;
	        })])
	        .range([0, r/4, r/2, 3*r/4]);

	    var yAxis = d3.axisLeft()
	        .scale(yScale)
	        .tickFormat(function (d) {
	            return d;
	        });

	    var colorScale = d3.scaleThreshold()
	        .domain([0.33, 0.67])
	        .range(colors);

	    var svg = d3.select('.heatmap')
	        .append("svg")
	        .attr("width", width + margin.left + margin.right)
	        .attr("height", height + margin.top + margin.bottom)
	        .append("g")
	        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	    var cells = svg.selectAll('rect')
	        .data(data)
	        .enter().append('g').append('rect')
	        .attr('class', 'cell')
	        .attr('width', cellSize)
	        .attr('height', cellSize)
	        .attr('y', function(d) { return yScale(d.country); })
	        .attr('x', function(d) { return xScale(d.product); })
	        .attr('fill', function(d) { return colorScale(d.value); });

	    svg.append("g")
	        .attr("class", "y axis")
	        .call(yAxis)
	        .selectAll('text')
	        .attr('font-weight', 'normal');

	    svg.append("g")
	        .attr("class", "x axis")
	        .call(xAxis)
	        .selectAll('text')
	        .attr('font-weight', 'normal')
	        .style("text-anchor", "start")
	        .attr("dx", ".8em")
	        .attr("dy", ".5em")
	        .attr("transform", function (d) {
	            return "rotate(-65)";
	        });

	    var legend = svg.selectAll(".legend")
    									.data(colorScale.domain());
    	/*var colorScale = d3.scaleLinear()
    													 .domain([0,1]);*/
    	var legendElementWidth = itemSize*2;
    	/*var dataLegend = [0, 0.33, 0.67, 1];
			var legend = svg.selectAll(".legend")
			    						.data(dataLegend);*/
			legend.enter().append("g")
              .attr("class", "legend");

			legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", 50)
            .attr("width", legendElementWidth)
            .attr("height", itemSize / 2)
            .style("fill", function(d, i) { return colors[i]; });

      legend.append("text")
            .attr("class", "mono")
            .text(function(d) { return "≥ " + Math.round(d); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", 50 + itemSize);

	  });
  }

	render() {
		return(
			<div className="container-fluid">
				<h2>Raters Agreement</h2>
        <div className="heatmap"></div>
        <div className="legend"></div>
			</div>
			);
	}
}

export default Rater;
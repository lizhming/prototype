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
    var itemSize = 75,
	      cellSize = itemSize - 1,
	      margin = {top: 40, right: 10, bottom: 10, left: 280};
      
	  var width = 650 - margin.right - margin.left,
	      height = 450 - margin.top - margin.bottom;

	  var colors = ["#000000", "#D3D3D3", "#696969"];

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

	    var r = (x_elements.length) * itemSize;

	    var xScale = d3.scaleOrdinal()
	        .domain([d3.max(data, function(d) {
	        	return d.values;
	        })])
	        .range([0, r/4, r/2, 3*r/4]);

	    var xAxis = d3.axisBottom()
	        .scale(xScale)
	        .tickFormat(function (d) {
	            return d;
	        });

	    var yScale = d3.scaleOrdinal()
	        .domain([d3.max(data, function(d) {
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
	        .attr('font-weight', 'normal')
	        .attr("transform", function (d) {
	            return "translate(0,35)";
	        });

	    svg.append("g")
	        .attr("class", "x axis")
	        .call(xAxis)
	        .selectAll('text')
	        .attr('font-weight', 'normal')
	        .style("text-anchor", "start")
	        .attr("dx", ".8em")
	        .attr("dy", ".5em")
	        .attr("transform", function (d) {
	            return "translate(15,-25)";
	        });
	  });
  }

	render() {
		return(
			<div className="container-fluid">
        <div className="heatmap"></div>
        <div className="legend"></div>
			</div>
			);
	}
}

export default Rater;
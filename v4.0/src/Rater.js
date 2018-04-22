import React from 'react';
import * as d3 from 'd3';
import * as d3tip from 'd3-tip';
import file from './data/data.csv';

class Rater extends React.Component {
	constructor(props) {
		super(props);
		const ratio = this.props.ratio;
	}
  
  componentDidMount() {
    var itemSize = 60,
	      cellSize = itemSize - 1,
	      margin = {top: 40, right: 10, bottom: 10, left: 40};
      
	  var width = 350 - margin.right - margin.left,
	      height = 350 - margin.top - margin.bottom;

	  var range = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
	  var colorRange = ["#fafafa", "#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"];
	  var colors = d3.scaleQuantize().range(colorRange);

	  d3.csv(file, function ( response ) {

	    var data = response.map(function( item ) {
	        var newItem = {};
	        newItem.country = item.x;
	        newItem.product = item.y;
	        newItem.value = item.value;

	        return newItem;
	    });

	    var x_elements = d3.set(data.map(function( item ) { return item.product; } )).values(),
	        y_elements = d3.set(data.map(function( item ) { return item.country; } )).values(),
	        relation_values = d3.set(data.map(function( item ) { return item.value; })).values();

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
	        .append("svg")
	        .attr("width", width + margin.left + margin.right)
	        .attr("height", height + margin.top + margin.bottom)
	        .attr("transform", "translate(100, -35)")
	        .append("g")
	        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	    var tip = d3tip()
          .attr('class', 'd3-tip')
          .style("visibility","visible")
          .offset([20, 0])
          .html(function(d) {
            return "<span style='color:white'> Value: </span><span style='color:red'>" + d.value + "</span>";
          });
			tip(svg.append("g"));

	    var cells = svg.selectAll('rect')
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
	            return "translate(0,30)";
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
	            return "translate(10,-25)";
	        });

	  	var legend = d3.select('.legend')
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
		return(
			<div className="container-fluid">
				<div className="legend"></div> 
        <div className="heatmap"></div>
			</div>
			);
	}
}

export default Rater;
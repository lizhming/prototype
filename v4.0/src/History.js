import React from 'react';
import './css/History.css';

class History extends React.Component {
	constructor(props) {
		super(props);
		this.size = 75;
		this.historyData = [];
		this.idx = [];
		this.prevIndex = 0;
		for(var i=0; i<props.count; ++i) {
			this.historyData.push([]);
			this.idx.push(0);
		}
		this.itemsizeData = this.itemsizeData.bind(this);
		this.updateScroll = this.updateScroll.bind(this);
		this.getHexCode = this.getHexCode.bind(this);
		this.showCancel = this.showCancel.bind(this);
		this.delete = this.delete.bind(this);
		this.back = this.back.bind(this);
	}

	getHexCode(rgb) {
		return '#' + rgb.substr(4, rgb.indexOf(')') - 4).split(',').map((color) => String("0" + parseInt(color).toString(16)).slice(-2)).join('');
	}

	updateScroll() {
    var element = document.getElementsByClassName("history-main")[0];
    element.scrollTop = element.scrollHeight;
	}

	showCancel(event) {
		// event.stopPropagation();
		// event.nativeEvent.stopImmediatePropagation();
		
		let index = event.target.id.split("_");
		document.getElementById("o_"+index[1]+"_"+index[2]).style.display = "block";
		//document.getElementById("hist"+index[1]).getElementsByClassName("cancel_overlay")[index[2]-1].style.display = "block";
	}

	back(event) {
		event.stopPropagation();
		event.nativeEvent.stopImmediatePropagation();
		
		let index = event.target.id.split("_");
		document.getElementById("o_"+index[1]+"_"+index[2]).style.display = "none";
		//document.getElementById("hist"+index[1]).getElementsByClassName("cancel_overlay")[index[2]-1].style.display = "none";
	}

	delete(event) {
		event.stopPropagation();
		event.nativeEvent.stopImmediatePropagation();
		
		let index = event.target.id.split("_");
		let value = this.historyData[index[1]][index[2]-1];

		this.historyData[index[1]] = this.historyData[index[1]].filter(function(item) { 
    	return item !== value;
		});

		let fromColor = document.getElementById("s_"+index[1]+"_"+index[2]).style.backgroundColor;
		let toColor = document.getElementById("e_"+index[1]+"_"+index[2]).style.backgroundColor;
		let cardName = document.getElementById("s_"+index[1]+"_"+index[2]).innerHTML;

		document.getElementById("h_"+index[1]+"_"+index[2]).style.display = "none";
		//document.getElementById("hist"+index[1]).getElementsByClassName("history-data")[index[2]-1].style.display = "none";
		this.props.deleteEvent(index, this.getHexCode(fromColor), this.getHexCode(toColor), cardName);
	}

	itemsizeData(bh, from, to) {
		++this.idx[this.props.activeIndex];
		let id = this.props.activeIndex + "_" + this.idx[this.props.activeIndex];

		const entry = (
				<div key={"key_"+id} id={"h_"+id} className="history-data" onClick={this.showCancel}>
					<div className="box hist" id={"s_"+id} style={{height: bh, width: bh, backgroundColor: from}}>
						{this.props.cardName}
					</div>
					<div className="dir" id={"di_"+id}></div>
					<div className="box hist" id={"e_"+id} style={{height: bh, width: bh, backgroundColor: to}}>
						{this.props.cardName}
					</div>
					<div className="cancel_overlay" id={"o_"+id}>
						<div className="back" id={"b_"+id} onClick={this.back}></div>
						<div className="delete" id={"d_"+id} onClick={this.delete}></div>
					</div>
				</div>
			);
		this.historyData[this.props.activeIndex].push(entry);
		this.updateScroll();
	}

	render() {
		const bh = this.size * this.props.ratio;
		const from = this.props.from;
		const to = this.props.to;
		
		if(from.localeCompare(to) !== 0 && this.prevIndex === this.props.activeIndex)
			this.itemsizeData(bh, from, to);

		this.prevIndex = this.props.activeIndex;

		return (
				<div className="history-wrapper">
					{this.historyData[this.props.activeIndex]}
				</div>
			);
	}
}

export default History;
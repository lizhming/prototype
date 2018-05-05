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
		
		let index = event.target.id.split("_").slice(1);
		document.getElementById("o_"+index.join("_")).style.display = "block";
		//document.getElementById("hist"+index[1]).getElementsByClassName("cancel_overlay")[index[2]-1].style.display = "block";
	}

	back(event) {
		event.stopPropagation();
		event.nativeEvent.stopImmediatePropagation();
		
		let index = event.target.id.split("_").slice(1);
		document.getElementById("o_"+index.join("_")).style.display = "none";
		//document.getElementById("hist"+index[1]).getElementsByClassName("cancel_overlay")[index[2]-1].style.display = "none";
	}

	delete(event) {
		event.stopPropagation();
		event.nativeEvent.stopImmediatePropagation();
		
		let index = event.target.id.split("_").slice(1);
		let value = this.historyData[index[0]][index[1]-1];

		this.historyData[index[0]] = this.historyData[index[0]].filter(function(item) { 
    	return item !== value;
		});

		// Uncomment these lines for UNDO functionality

		let fromColor = document.getElementById("s_"+index.join("_")).style.backgroundColor;
		let toColor = document.getElementById("e_"+index.join("_")).style.backgroundColor;
		let cardName = document.getElementById("s_"+index.join("_")).innerHTML;

		document.getElementById("h_"+index.join("_")).style.display = "none";
		this.props.deleteEvent(index, this.getHexCode(fromColor), this.getHexCode(toColor), cardName, index[2]);
	}

	itemsizeData(bh, from, to) {
		++this.idx[this.props.activeIndex];
		let id = "_" + this.props.activeIndex + "_" + this.idx[this.props.activeIndex] + "_" + this.props.cardID;
		let cls = (this.idx[this.props.activeIndex]%2 !== 0) ? "history-data" : "history-data right";
		const entry = (
				<div key={"key"+id} id={"h"+id} className={cls} onClick={this.showCancel}>
					<div className="box hist" id={"s"+id} style={{height: bh, width: bh, backgroundColor: from}}>
						{this.props.cardName}
					</div>
					<div className="dir" id={"di"+id}></div>
					<div className="box hist" id={"e"+id} style={{height: bh, width: bh, backgroundColor: to}}>
						{this.props.cardName}
					</div>
					<div className="cancel_overlay" id={"o"+id}>
						<div className="back" id={"b"+id} onClick={this.back}></div>
						<div className="delete" id={"d"+id} onClick={this.delete}></div>
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
			this.itemsizeData(bh, from, to, this.props.index);

		this.prevIndex = this.props.activeIndex;

		return (
				<div className="history-wrapper">
					{this.historyData[this.props.activeIndex]}
				</div>
			);
	}
}

export default History;
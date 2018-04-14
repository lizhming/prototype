import React from 'react';
import './css/History.css';

class History extends React.Component {
	constructor(props) {
		super(props);
		this.size = 75;
		this.historyData = [];
		this.idx = 0;
		this.itemsizeData = this.itemsizeData.bind(this);
		this.updateScroll = this.updateScroll.bind(this);
	}

	updateScroll() {
    var element = document.getElementById("history-wrapper");
    element.scrollTop = element.scrollHeight;
	}

	itemsizeData(bh, from, to) {
		++this.idx;
		this.historyData.push(
			<div key={this.idx} className="history-data">
				<div className="box hist" style={{height: bh, width: bh, backgroundColor: from}}>Start</div>
				<div className="dir"></div>
				<div className="box hist" style={{height: bh, width: bh, backgroundColor: to}}>End</div>
			</div>
		);
		this.updateScroll();
	}

	render() {
		const bh = this.size * this.props.ratio;
		const from = this.props.from;
		const to = this.props.to;

		if(from.localeCompare(to) !== 0)
			this.itemsizeData(bh, from, to);

		return (
				<div id="history-wrapper">
					{this.historyData}
				</div>
			);
	}
}

export default History;
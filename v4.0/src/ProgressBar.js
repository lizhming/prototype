import React from 'react';
import { Progress } from 'reactstrap';

class ProgressBar extends React.Component {
	render() {
    const qid = this.props.qid.substr(0, 25);
    let etc = "";
    if(this.props.qid.length > 25) {
      etc += "...";
    }
    let className = "progressbar";
    if(this.props.active) {
      className += " active-bar";
    } 

		return (
			<div className={className}> 
        <Progress multi>
        	<Progress bar color="warning" value={this.props.count[0]*100/this.props.cards}>{this.props.count[0]*100/this.props.cards}%</Progress>
          <Progress bar color="success" value={this.props.count[1]*100/this.props.cards}>{this.props.count[1]*100/this.props.cards}%</Progress>
          <Progress bar value={this.props.count[2]*100/this.props.cards}>{this.props.count[2]*100/this.props.cards}%</Progress>
          <Progress bar color="danger" value={this.props.count[3]*100/this.props.cards}>{this.props.count[3]*100/this.props.cards}%</Progress>
        </Progress>
        <div className="qid">
          {qid}{etc}
        </div>
      </div>
		);
	}
}

export default ProgressBar;
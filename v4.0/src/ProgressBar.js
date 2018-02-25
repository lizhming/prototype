import React from 'react';
import { Progress } from 'reactstrap';

class ProgressBar extends React.Component {
	render() {
		return (
			<div id="progress-bar"> 
        <Progress multi>
        	<Progress animated bar color="warning" value={this.props.count[0]*100/this.props.cards}>{this.props.count[0]*100/this.props.cards}%</Progress>
          <Progress animated bar color="success" value={this.props.count[1]*100/this.props.cards}>{this.props.count[1]*100/this.props.cards}%</Progress>
          <Progress animated bar color="danger" value={this.props.count[2]*100/this.props.cards}>{this.props.count[2]*100/this.props.cards}%</Progress>
          <Progress animated bar value={this.props.count[3]*100/this.props.cards}>{this.props.count[3]*100/this.props.cards}%</Progress>
        </Progress>
      </div>
		);
	}
}

export default ProgressBar;
import React from 'react';
import { Progress } from 'reactstrap';
import soundfile from './sounds/chipLay.wav';

class ProgressBar extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {
      audio: new Audio(soundfile)
    }
    this.console = this.console.bind(this);
    console.log("PG: ", props.cards)
  }

  console() {
    //console.log(this.props.qid);
    this.props.onSelectQuestion(this.props.qid)
    this.state.audio.play();
  }

	render() {
    let qname = this.props.qname.substr(0, 50);
    const multiplier = 100/this.props.cards;
    let etc = "";
    let className = "progressbar";
    
    if(this.props.qname.length > 50) {
      if(!this.props.isOne) {
        etc += "...";
      } else {
        qname = this.props.qname;
      }
    }
    if(this.props.active) {
      className += " active-bar";
    }
    if(this.props.isOne) {
      className += " active-bar-black";
    }

		return (
			<div className={className} onClick={this.console}> 
        <Progress multi>
        	<Progress bar color="warning" value={(this.props.count[0]-this.props.factor)*multiplier}>
            {Math.round((this.props.count[0]-this.props.factor)*multiplier*100)/100}%
          </Progress>
          <Progress bar color="success" value={this.props.count[1]*multiplier}>
            {Math.round(this.props.count[1]*multiplier*100)/100}%
          </Progress>
          <Progress bar value={this.props.count[2]*multiplier}>
            {Math.round(this.props.count[2]*multiplier*100)/100}%
          </Progress>
          <Progress bar color="danger" value={this.props.count[3]*multiplier}>
            {Math.round(this.props.count[3]*multiplier*100)/100}%
          </Progress>
        </Progress>
        <div className="qname">
          {qname}{etc}
        </div>
      </div>
		);
	}
}

export default ProgressBar;
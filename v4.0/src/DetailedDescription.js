import React from 'react';
import Draggable from 'react-draggable';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';

/**
 * Detailed Description for a card content
 */
 
class DetailedDescription extends React.Component {
	constructor(props) {
    super(props);

    this.id = props.id;
    this.px = props.px;
    this.py = props.py;
    this.bh = props.bh;
    this.dragHandlers = props.dragHandlers;

    this.toggle = this.toggle.bind(this);
    this.state = {
      popoverOpen: false
    };
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  render() {
    return (
    	<div className="mainFocused" style={{height: this.props.height}}>
    		<Draggable key={this.id+"_"} defaultPosition={{x: this.px, y: this.py}} bounds="parent" {...this.dragHandlers}>
            <div id={this.id} className="box" onClick={this.toggle} style={{height: this.bh, width: this.bh, backgroundColor: this.props.color}}>
            	{this.props.card}
            </div>
        </Draggable>
        <Popover placement="auto" 
                 isOpen={this.state.popoverOpen} 
                 target={this.props.id} 
                 toggle={this.toggle}>
          <PopoverHeader>{this.props.card}</PopoverHeader>
          <PopoverBody>
          	{this.props.desc}
          </PopoverBody>
        </Popover>
        </div>
    );
  }
}

export default DetailedDescription;
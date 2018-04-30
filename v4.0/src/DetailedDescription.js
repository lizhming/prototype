import React from 'react';
import Draggable from 'react-draggable';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';

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
          	Lorem ipsum dolor sit amet, consectetur <mark>adipiscing elit.</mark> Integer ut ante eu mauris maximus vestibulum sed at arcu. 
          	Vivamus ac dui leo. Aliquam eget faucibus nunc, ac eleifend dolor. Nunc aliquam, ex id imperdiet pellentesque, 
          	massa tellus pretium lorem, at sollicitudin felis velit id ipsum. Ut sollicitudin arcu erat, vel vulputate nisl 
          	lacinia nec. Mauris aliquam ex nec volutpat pellentesque. Donec hendrerit tincidunt lacus, sit amet commodo urna placerat sit amet. 
          	Aenean ac bibendum dui. Fusce non hendrerit elit, et auctor velit. Nam tincidunt ex in eros tristique facilisis. Donec 
          	tincidunt mauris ac commodo elementum. Cras bibendum, ex sit amet facilisis interdum, neque massa fringilla orci, et rhoncus ante mi non nibh.
          	<br/><br/>
						Duis sit amet sapien vitae magna cursus aliquam sit amet a mi. <mark>Etiam nulla purus, suscipit vehicula quam sed, egestas 
						dignissim neque.</mark> Cras tristique varius justo mollis finibus. Etiam eget odio nisi. Sed quis nibh at tortor posuere 
						elementum sit amet quis mi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. 
						Integer pellentesque tristique aliquam. Suspendisse bibendum interdum leo rhoncus gravida. Fusce nec diam in enim fringilla 
						fringilla in nec metus. Vestibulum viverra non nulla eget posuere. Aenean sodales imperdiet velit, at dictum lorem viverra ac. 
						Morbi sed finibus orci.
          </PopoverBody>
        </Popover>
        </div>
    );
  }
}

export default DetailedDescription;
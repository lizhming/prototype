import React from 'react';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';

/**
 * Small popover section thats displayed on tapping some components in the application.
 */

class PopoverItem extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      popoverOpen: this.props.show
    };
  }

  toggle() {
    this.setState({
      popoverOpen: this.props.show
    });
  }

  render() {
    return (
      <div>
        <h2 className="heading">{this.props.title}</h2>
        <div className={this.props.className} 
             id={this.props.id} 
             style={{height:this.props.height}}>
          {this.props.elements}
        </div>
        <Popover placement={this.props.placement} 
                 isOpen={this.props.show} 
                 target={this.props.id} 
                 toggle={this.toggle}>
          <PopoverHeader>{this.props.title}</PopoverHeader>
          <PopoverBody>{this.props.description}</PopoverBody>
        </Popover>
      </div>
    );
  }
}

export default PopoverItem;
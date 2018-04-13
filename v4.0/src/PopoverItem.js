import React from 'react';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';

class PopoverItem extends React.Component {
  constructor(props) {
    super(props);

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
      <div>
        <div className={this.props.className} 
             id={this.props.id} 
             style={{height:this.props.height}} 
             onClick={this.toggle}>
          {this.props.elements}
        </div>
        <Popover placement={this.props.placement} 
                 isOpen={this.state.popoverOpen} 
                 target={this.props.id} 
                 toggle={this.toggle}>
          <PopoverHeader>{this.props.title}</PopoverHeader>
          <PopoverBody>Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</PopoverBody>
        </Popover>
      </div>
    );
  }
}

export default PopoverItem;
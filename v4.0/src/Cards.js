import React from 'react';
import Draggable from 'react-draggable';

class Cards extends React.Component {
  
  constructor(props) {
    super(props);
    this.val = 6;
    this.size = 100;
    this.createBindings();

    this.state = { 
      activeDrags : 0,
      deltaPosition: {x: 0, y: 0},
      controlledPosition: {x: 0, y: 0},
    };
  }

  createBindings() {
    this.onStart = this.onStart.bind(this);
    this.onStop = this.onStop.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.adjustXPos = this.adjustXPos.bind(this);
    this.adjustYPos = this.adjustYPos.bind(this);
    this.onControlledDrag = this.onControlledDrag.bind(this);
    this.onControlledDragStop = this.onControlledDragStop.bind(this);
  }

  handleDrag(e, ui) {
    const {x, y} = this.state.deltaPosition;
    //console.log(e, this.state.deltaPosition);
    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      }
    });
    //console.log(this.state.deltaPosition);
    document.getElementsByClassName("react-draggable-dragging")[0].style.zIndex = this.val++;
    this.toggleSize(false);
  }

  onStart() {
    this.setState({
      activeDrags: this.state.activeDrags + 1
    });
  }

  onStop() {
    this.setState({
      activeDrags: this.state.activeDrags - 1
    });
    this.toggleSize(false);
  }

  // For controlled component
  adjustXPos(e) {
    e.preventDefault();
    e.stopPropagation();
    const {x, y} = this.state.controlledPosition;
    this.setState({controlledPosition: {x: x - 10, y}});
  }

  adjustYPos(e) {
    e.preventDefault();
    e.stopPropagation();
    const {controlledPosition} = this.state;
    const {x, y} = controlledPosition;
    this.setState({controlledPosition: {x, y: y - 10}});
  }

  onControlledDrag(e, position) {
    const {x, y} = position;
    this.setState({controlledPosition: {x, y}});
  }

  onControlledDragStop(e, position) {
    this.onControlledDrag(e, position);
    this.onStop();
  }

  toggleSize(flg) {
    var factor = 1;
    if(flg) {
      factor = 0.52;
    }
    document.getElementsByClassName("react-draggable-dragging")[0].style.height = (this.size * factor) + "px";
    document.getElementsByClassName("react-draggable-dragging")[0].style.width = (this.size * factor) + "px";
  }

  render() {
    const no_of_cards = 15;
    const qcard = "Q-Card";
    const dragHandlers = {
      onDrag: this.handleDrag, 
      onStart: this.onStart, 
      onStop: this.onStop
    };
    
    const h = this.props.ratio * (window.innerHeight-66) + "px";

    var cards = [];
    for(var i=0; i<no_of_cards; i++) {
      var px = this.props.ratio * (Math.floor(Math.random() * 300) + 200);
      var py = this.props.ratio * (Math.floor(Math.random() * 275) + 175);
      var bh = (this.props.ratio * this.size) + "px";

      cards.push(
        <Draggable key={i} defaultPosition={{x: px, y: py}} bounds="parent" {...dragHandlers}>
            <div className="box" style={{height: bh, width: bh}}>{qcard}</div>
        </Draggable>);
    }

    return (
      <div id="main" style={{position:"relative", height:h, width:"100%"}}>
        {cards}
      </div>
    );
  }
}

export default Cards;
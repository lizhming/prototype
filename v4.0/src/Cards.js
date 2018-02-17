import React from 'react';
import Draggable, {DraggableCore} from 'react-draggable';
import './Cards.css';

class Cards extends React.Component {
  constructor(props) {
    super(props);
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
    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      }
    });
  }

  onStart() {
    console.log(this);
    this.setState({
      activeDrags: this.state.activeDrags + 1
    });
  }

  onStop() {
    this.setState({
      activeDrags: this.state.activeDrags - 1
    });
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

  render() {
    const qcard = "Q-Card";
    const dragHandlers = {onStart: this.onStart, onStop: this.onStop};
    return (
      <div>
        <p>Active DragHandlers: {this.state.activeDrags}</p>
        <div style={{height: '1000px', width: '1000px', padding: '10px'}}>
          <Draggable bounds="parent" {...dragHandlers}>
            <div className="box">
              I can only be moved within my offsetParent.<br /><br />
              Both parent padding and child margin work properly.
            </div>
          </Draggable>
          <Draggable bounds="parent" {...dragHandlers}>
            <div className="box">{qcard}</div>
          </Draggable>
          <Draggable bounds="parent" {...dragHandlers}>
            <div className="box">{qcard}</div>
          </Draggable>
          <Draggable bounds="parent" {...dragHandlers}>
            <div className="box">{qcard}</div>
          </Draggable>
          <Draggable bounds="parent" {...dragHandlers}>
            <div className="box">{qcard}</div>
          </Draggable>
        </div>
      </div>
    );
  }
}

export default Cards;
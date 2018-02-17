import React from 'react';
import Draggable, {DraggableCore} from 'react-draggable';
import './Cards.css';

class Cards extends React.Component {
  state = {
    activeDrags: 0,
    deltaPosition: {x: 0, y: 0},
    controlledPosition: {x: 0, y: 0},
  };

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
    this.handleStop();
  }

  render() {
    const dragHandlers = {onStart: this.onStart, onStop: this.onStop};
    return (
      <div>
        <p>Active DragHandlers: {this.state.activeDrags}</p>
        <Draggable>
          <div className="box">dragged anywhere</div>
        </Draggable>
        <Draggable axis="x">
          <div className="box cursor-x">dragged horizonally (x axis)</div>
        </Draggable>
        <Draggable axis="y">
          <div className="box cursor-y">dragged vertically (y axis)</div>
        </Draggable>
        <Draggable onStart={() => false}>
          <div className="box">No dragged</div>
        </Draggable>
      </div>
    );
  }
}

export default Cards;
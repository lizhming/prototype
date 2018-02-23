import React from 'react';
import Draggable, {DraggableCore} from 'react-draggable';
import { Progress } from 'reactstrap';
import './css/Cards.css';

class Cards extends React.Component {
  
  constructor(props) {
    super(props);
    this.val = 6;
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
    console.log("p", this.state.deltaPosition);
    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      }
    });
    console.log(this.state.deltaPosition);
    document.getElementsByClassName("react-draggable-dragging")[0].style.zIndex = this.val++;
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
    this.onStop();
  }

  render() {
    const qcard = "Q-Card";
    const dragHandlers = {
      onDrag: this.handleDrag, 
      onStart: this.onStart, 
      onStop: this.onStop
    };
    const h = (this.props.ratio * 1080) + "px";
    const pos = {
      x: [], 
      y: []
    };

    for(var i=0; i<5; i++) {
      pos.x.push(Math.floor(Math.random() * 300) + 200)
      pos.y.push(Math.floor(Math.random() * 275) + 175);
    }

    return (
      <div>
        <div id="main" style={{position:"relative", height:h, width:"100%"}}>
          <div id="progress-bar"> 
            <Progress multi>
              <Progress animated bar color="success" value="15">15%</Progress>
              <Progress animated bar color="warning" value="35">35%</Progress>
            </Progress>
          </div>
          <div className="head">Active DragHandlers: {this.state.activeDrags}</div>
          <Draggable defaultPosition={{x: pos.x[0], y: pos.y[0]}} bounds="parent" {...dragHandlers}>
            <div className="box">{qcard}</div>
          </Draggable>
          <Draggable defaultPosition={{x: pos.x[1], y: pos.y[1]}} bounds="parent" {...dragHandlers}>
            <div className="box">{qcard}</div>
          </Draggable>
          <Draggable defaultPosition={{x: pos.x[2], y: pos.y[2]}} bounds="parent" {...dragHandlers}>
            <div className="box">{qcard}</div>
          </Draggable>
          <Draggable defaultPosition={{x: pos.x[3], y: pos.y[3]}} bounds="parent" {...dragHandlers}>
            <div className="box">{qcard}</div>
          </Draggable>
          <Draggable defaultPosition={{x: pos.x[4], y: pos.y[4]}} bounds="parent" {...dragHandlers}>
            <div className="box">{qcard}</div>
          </Draggable>
        </div>
      </div>
    );
  }
}

export default Cards;
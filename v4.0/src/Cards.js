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
      deltaPosition: {x: 0, y: 0}
    };

    const no_of_cards = 10;
    const qcard = "Q-Card";
    const dragHandlers = {
      onDrag: this.handleDrag, 
      onStart: this.onStart, 
      onStop: this.onStop
    };

    this.cards = [];
    for(var i=0; i<no_of_cards; i++) {
      //put cards in random location between x & y betwwen (275, 475)
      var px = this.props.ratio * (Math.floor(Math.random() * 248) + 340);
      var py = this.props.ratio * (Math.floor(Math.random() * 200) + 275);
      var bh = (this.props.ratio * this.size) + "px";

      //console.log(i, px, py);

      this.cards.push(
        <Draggable key={i} defaultPosition={{x: px, y: py}} bounds="parent" {...dragHandlers}>
            <div className="box" style={{height: bh, width: bh}}>{qcard}-{i}</div>
        </Draggable>);
    }
  }

  createBindings() {
    this.onStart = this.onStart.bind(this);
    this.onStop = this.onStop.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }

  handleDrag(e, ui) {
    const {x, y} = this.state.deltaPosition;
    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY
      }
    });
    
    var elem = document.getElementsByClassName("react-draggable-dragging")[0];
    elem.style.zIndex = this.val;
    //elem.innerHTML = this.state.deltaPosition.x + ", " + this.state.deltaPosition.y;
    this.toggleSize(elem, false);
    this.locateCard(elem, ui.x, ui.y);
  }

  locateCard(elem, x, y) {
    if(x >= 275 && x <= 475 && y >= 275 && y <= 475) {
      elem.style.background = "#fff";
    } else if(x >= 600 && y <= 600) {  //relevant
      elem.style.background = "#0f0";
    } else if(x <= 150 && y <= 600) { //irrelevant
      elem.style.background = "#f00";
    } else if(y > 600) {  //unknown
      elem.style.background = "#00f";
    }
  }

  onStart(e, ui) {
    console.log("onStart", ui.x, ui.y);
    ++this.val;
    this.setState({
      activeDrags: this.state.activeDrags + 1
    });
  }

  onStop() {
    this.setState({
      activeDrags: this.state.activeDrags - 1,
      deltaPosition: {x: 0, y: 0}
    });
    this.toggleSize(document.getElementsByClassName("react-draggable-dragging")[0], false);

  }

  toggleSize(elem, flg) {
    var factor = 1;
    if(flg) {
      factor = 0.52;
    }
    elem.style.height = (this.size * factor) + "px";
    elem.style.width = (this.size * factor) + "px";
  }

  render() {
    const h = this.props.ratio * (window.innerHeight-66) + "px";

    return (
      <div id="main" style={{position:"relative", height:h, width:"100%"}}>
        {this.cards}
      </div>
    );
  }
}

export default Cards;
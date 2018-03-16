import React from 'react';
import Draggable from 'react-draggable';

class Cards extends React.Component {
  
  constructor(props) {
    super(props);
    //var no_of_cards = this.props.no_of_cards;
    this.val = 6;
    this.size = 100;
    this.createBindings();

    this.state = { 
      activeDrags : 0,
      deltaPosition: {x: 0, y: 0},
      //count : [no_of_cards, 0, 0, 0]
    };

    const qcard = "Q-Card";
    const dragHandlers = {
      onDrag: this.handleDrag, 
      onStart: this.onStart, 
      onStop: this.onStop
    };

    this.cards = [];
    for(var i=0; i<this.props.cards; i++) {
      //put cards in random location between x & y betwwen (275, 475)
      var px = this.props.ratio * (Math.floor(Math.random() * 200) + 275);
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

    switch(this.locateCard(ui.x, ui.y)) {
      case 0: elem.style.background = "#fff"; break;
      case 1: elem.style.background = "#0f0"; break;
      case 2: elem.style.background = "#f00"; break;
      case 3: elem.style.background = "#0ff"; break;
      default: break;
    }
  }

  locateCard(x, y) {
    if(x >= 250 && x <= 600 && y <= 750) { return 0; } 
    else if(x > 600 && y < 750) { return 1; } //relevant
    else if(x < 250 && y < 750) { return 2; } //irrelevant
    else if(y > 750) { return 3; }            //unknown
  }

  onStart(e, ui) {
    console.log("onStart", ui.x, ui.y);
    ++this.val;
    this.setState({
      activeDrags: this.state.activeDrags + 1
    });

    this.prev = this.locateCard(ui.x, ui.y);
    document.getElementById("main").style.backgroundPosition = "center";
  }

  onStop(e, ui) {
    let count = this.props.count;

    this.setState({
      activeDrags: this.state.activeDrags - 1,
      deltaPosition: {x: 0, y: 0}
    });

    this.toggleSize(document.getElementsByClassName("react-draggable-dragging")[0], false);
    console.log("onStop", ui.x, ui.y);

    this.curr = this.locateCard(ui.x, ui.y);
    ++count[this.curr];
    --count[this.prev];

    this.setState({ count : count });
    this.props.onProgressUpdate(this.state.count);
    document.getElementById("main").style.backgroundPosition = "initial";
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
        <div id="tmp">          
        </div>
        {this.cards}
      </div>
    );
  }
}

export default Cards;
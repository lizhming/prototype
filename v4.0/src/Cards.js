import React from 'react';
import soundfile1 from './sounds/cardPlace1.wav';
import soundfile2 from './sounds/cardPlace2.wav';
import soundfile3 from './sounds/cardSlide1.wav';
import soundfile4 from './sounds/cardSlide2.wav';
import soundfile5 from './sounds/cardSlide3.wav';
import soundfile6 from './sounds/cardSlide4.wav';
import soundfile7 from './sounds/cardSlide5.wav';
import soundfile8 from './sounds/cardSlide6.wav';
import soundfile9 from './sounds/cardSlide7.wav';
import DetailedDescription from './DetailedDescription.js'

class Cards extends React.Component {
  
  constructor(props) {
    super(props);
    //var no_of_cards = this.props.no_of_cards;
    this.val = 6;
    this.size = 75;
    this.createBindings();
    this.h = (this.props.ratio * 0.95 * window.innerHeight) + "px";
    this.center = {
      x: window.innerWidth*0.66*props.ratio*0.5, 
      y: window.innerHeight*0.95*props.ratio*0.5
    };
    
    this.color = ["#969696", "#11a8ab", "#4fc4f6", "#e64c65"]; 
    //"#ffc107", "#28a745", "#007bff", "#dc3545" - older values

    this.state = { 
      activeDrags : 0,
      deltaPosition : {x: 0, y: 0},
      from : 0,
      to : 0,
      start: {x: 0, y: 0},
      stop: {x: 0, y: 0},
      audio: [ new Audio(soundfile1), new Audio(soundfile2), new Audio(soundfile3), 
        new Audio(soundfile4), new Audio(soundfile5), new Audio(soundfile6), 
        new Audio(soundfile7), new Audio(soundfile8), new Audio(soundfile9) ]
    };

    const dragHandlers = {
      onDrag: this.handleDrag, 
      onStart: this.onStart, 
      onStop: this.onStop
    };

    this.cards = [];
    for(var i=0; i<this.props.cardsCount; i++) {
      //put cards in random location between x & y betwwen (275, 475)
      var bh = (this.props.ratio * this.size) + "px";
      this.cards.push(<DetailedDescription key={i}
                             id={this.props.id+"_"+i}
                             height={this.h}
                             px={this.props.px[i].stop.x}
                             py={this.props.py[i].stop.y}
                             bh={bh}
                             color={this.props.color[i]}
                             card={this.props.cards[i]}
                             dragHandlers={dragHandlers} />);
      ///console.log(i, px, py);
    }
     
    this.categories = [];
    this.createCategories();
    console.log("Cpns: ", this.cards);
  }

  createBindings() {
    this.onStop = this.onStop.bind(this);
    this.inside = this.inside.bind(this);
    this.onStart = this.onStart.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.insideCircle = this.insideCircle.bind(this);
    this.createCategories = this.createCategories.bind(this);
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
    this.toggleSize(elem, true);

    var idx = this.locateCard(ui.x, ui.y);
    if(idx >= 0 && idx <= this.props.categories.length) {
      elem.style.background = this.color[idx];
    }
  }

  locateCard(x, y) {
    var stage = document.getElementsByClassName("stage")[0].getBoundingClientRect();
    if(this.insideCircle({x: x, y: y}, stage.width)) {
      return 0;
    }
    //var main = document.getElementsByClassName("main")[this.props.activeIndex].getBoundingClientRect();
    for(var i=1; i<=this.props.categories.length; ++i) {
      //var pos = this.props.categories.length * this.props.activeIndex + i - 1;
      var pie = document.getElementsByClassName("circle")[0].getBoundingClientRect();
      /*let center = {
        x: this.center.x - main.left,
        y: this.center.y - main.top
      }*/
      if(this.inside({x: x, y: y}, pie.width/2, -1.57, 0.5233)) {
        return 1;
      } else if(this.inside({x: x, y: y}, pie.width/2, 0.5233, 2.616)) {
        return 2;
      } else if(this.inside({x: x, y: y}, pie.width/2, 2.616, -1.57)) {
        return 3;
      } 
    }
  }

  insideCircle(point, r) {
    let radius = 240;   //15rem
    var relPoint = {
      x: point.x - this.center.x,
      y: point.y - this.center.y
    };
    return (relPoint.x*relPoint.x + relPoint.y*relPoint.y <= radius * radius);
  }

  inside(point, radius, angle1, angle2) {
    function areClockwise(center, radius, angle, point2) {
      var point1 = {
        x : (center.x + radius) * Math.cos(angle),
        y : (center.y + radius) * Math.sin(angle)
      };
      return -point1.x*point2.y + point1.y*point2.x > 0;
    }

    var relPoint = {
      x: point.x - this.center.x,
      y: point.y - this.center.y
    };

    return !areClockwise(this.center, radius, angle1, relPoint) &&
           areClockwise(this.center, radius, angle2, relPoint) &&
           (relPoint.x*relPoint.x + relPoint.y*relPoint.y <= radius * radius);
  }

  onStart(e, ui) {
    //console.log("onStart", ui.x, ui.y);
    this.setState({
      start: {x: ui.x, y: ui.y}
    });
    ++this.val;
    this.setState({
      activeDrags: this.state.activeDrags + 1
    });

    this.prev = this.locateCard(ui.x, ui.y);
    //document.getElementById("main").style.backgroundPosition = "center";
    this.setState({
      from: this.prev
    });
  }

  onStop(e, ui) {
    let count = this.props.count;

    this.setState({
      activeDrags: this.state.activeDrags - 1,
      deltaPosition: {x: 0, y: 0}
    });

    this.toggleSize(document.getElementsByClassName("react-draggable-dragging")[0], false);
    //console.log("onStop", ui.x, ui.y);
    this.setState({
      stop: {x: ui.x, y: ui.y}
    });

    this.curr = this.locateCard(ui.x, ui.y);
    this.setState({
      to: this.curr
    });
    console.log("Curr: " + this.curr, "Prev: " + this.prev);
    ++count[this.curr];
    --count[this.prev];

    this.setState({ count : count });
    //console.log(this.state.count);
    if(typeof this.prev !== 'undefined' && typeof this.curr !== 'undefined' && (this.curr !== this.prev)) {
      let elem = document.getElementsByClassName("react-draggable-dragging")[0];
      let name = elem.innerHTML;
      this.props.onProgressUpdate(this.state.count);
      this.props.onChange(this.color[this.prev], this.color[this.curr], name, elem.id.split("_")[1]);
      this.props.onUpdatePosition(this.state.start, this.state.stop, this.color[this.curr], elem.id.split("_")[1]);
    }
    //document.getElementById("main").style.backgroundPosition = "initial";
    let rnd = Math.floor(Math.random() * this.state.audio.length);
    this.state.audio[rnd].play();
  }

  toggleSize(elem, flg) {
    var factor = 1;
    if(flg) {
      factor = 1.75;
    }
    elem.style.height = (this.size * factor) + "px";
    elem.style.width = (this.size * factor) + "px";
  }

  createCategories() {
    for(var i=1; i<=this.props.categories.length; ++i) {
      let id = "part"+i;
      this.categories.push(
          <div key={i} id={id} className="circle"></div>
        );
    }
  }

  render() {
    return (
      <div className="main" style={{height:this.h}}>
        <div className="stage"></div>
        <div className="stageHeading" id="cat-three">{this.props.categories[2]}</div>
        <div className="stageHeading" id="cat-one">{this.props.categories[0]}</div>
        <div className="stageHeading" id="cat-two">{this.props.categories[1]}</div>
        {this.categories}
        {this.cards}
      </div>
    );
  }
}

export default Cards;
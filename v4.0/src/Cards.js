import React from 'react';
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
    
    this.color = ["#969696", "#11A8AB", "#4FC4F6", "#E64C65"]; 
    //"#ffc107", "#28a745", "#007bff", "#dc3545" - older values

    this.state = { 
      activeDrags : 0,
      deltaPosition : {x: 0, y: 0},
      from : 0,
      to : 0
    };

    const dragHandlers = {
      onDrag: this.handleDrag, 
      onStart: this.onStart, 
      onStop: this.onStop
    };

    this.cards = [];
    for(var i=0; i<this.props.cardsCount; i++) {
      //put cards in random location between x & y betwwen (275, 475)
      var px = this.props.ratio * (Math.floor(Math.random() * 200) + this.center.x-150);
      var py = this.props.ratio * (Math.floor(Math.random() * 200) + this.center.y-150);
      var bh = (this.props.ratio * this.size) + "px";

      this.cards.push(<DetailedDescription key={i}
                             id={this.props.id+"_"+i}
                             height={this.h}
                             px={px}
                             py={py}
                             bh={bh}
                             card={this.props.cards[i]}
                             dragHandlers={dragHandlers} />);
      /// console.log(i, px, py);
    }
     
    this.categories = [];
    this.createCategories();
  }

  createBindings() {
    this.onStart = this.onStart.bind(this);
    this.onStop = this.onStop.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.inside = this.inside.bind(this);
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
    this.toggleSize(elem, false);

    var idx = this.locateCard(ui.x, ui.y);
    if(idx >= 0 && idx <= this.props.categories.length) {
      elem.style.background = this.color[idx];
    }
  }

  locateCard(x, y) {
    var stage = document.getElementsByClassName("stage")[this.props.activeIndex].getBoundingClientRect();
    if(this.insideCircle({x: x, y: y}, stage.width)) {
      return 0;
    }
    var main = document.getElementsByClassName("main")[this.props.activeIndex].getBoundingClientRect();
    for(var i=1; i<=this.props.categories.length; ++i) {
      var pos = this.props.categories.length * this.props.activeIndex + i - 1;
      var pie = document.getElementsByClassName("circle")[pos].getBoundingClientRect();
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
    console.log("onStart", ui.x, ui.y);
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
    console.log("onStop", ui.x, ui.y);

    this.curr = this.locateCard(ui.x, ui.y);
    this.setState({
      to: this.curr
    });
    console.log(this.curr, this.prev);
    ++count[this.curr];
    --count[this.prev];

    this.setState({ count : count });
    //console.log(this.state.count);
    if(typeof this.prev !== 'undefined' && typeof this.curr !== 'undefined' && (this.curr !== this.prev)) {
      let name = document.getElementsByClassName("react-draggable-dragging")[0].innerHTML;
      this.props.onProgressUpdate(this.state.count);
      this.props.onChange(this.color[this.prev], this.color[this.curr], name);
    }
    //document.getElementById("main").style.backgroundPosition = "initial";
  }

  toggleSize(elem, flg) {
    var factor = 1;
    if(flg) {
      factor = 0.52;
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
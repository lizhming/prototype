import React, { Component } from 'react';
import Cards from './Cards.js';
import Rater from './Rater.js';
import History from './History.js';
//import Question from './Question.js';
import ProgressBar from './ProgressBar.js';
import PopoverItem from './PopoverItem.js';
import soundfile from './sounds/chipLay.wav';
import soundfile1 from './sounds/cardSlide8.wav';
import { Button, Collapse, Card, CardTitle, CardBody } from 'reactstrap';

import './css/App.css';
import './css/screen-res.css';

/** 
 * App - file which takes care of all other components of the application.
 * It renders other 6 components.
 */

class App extends Component {
  constructor(props) {
    super(props);
    this.RATERS = 4;
    this.defaultColor = "#969696";
    this.createBindings();
    this.state = {
      w: props.width, 
      h: props.height,
      ratio: 0,
      activeIndex: 0,
      from: this.defaultColor,
      to: this.defaultColor,
      cardName: "",
      reset: false,
      cardID: -1,
      show: false,
      collapse: false,
      info: new Audio(soundfile),
      codebookClick: new Audio(soundfile1)
    };
    this._isMounted = false;
    this.cards = [];
    this.labels = [];
    this.progressBar = [];
    this.history = [];
    this.totalCards = [];
    this.cardPositions = [];
    this.cardColor = [];
    this.color = ["#969696", "#11a8ab", "#4fc4f6", "#e64c65"]; 

    let total = 0;
    for(var i=0; i<props.data.questionsCount; ++i) {
      total += props.data.values[i].cardsCount;
    }
    for(i=0; i<props.data.questionsCount; ++i) {
      this.totalCards.push(total);
      this.cards.push({count: [this.totalCards[i],0,0,0]})
      this.progressBar.push(i);
      this.labels.push(i);
      this.history.push(i);
      this.cardPositions.push([]);
      this.cardColor.push([]);
      for(var j=0; j<props.data.values[i].cardsCount; ++j) {
        let px = (Math.floor(Math.random() * 200) + window.innerWidth*0.66*0.5-150);
        let py = (Math.floor(Math.random() * 200) + window.innerHeight*0.95*0.5-150);
        this.cardPositions[i].push({start: {x: 0, y: 0}, stop: {x: px, y: py}});
        this.cardColor[i].push(this.color[0]);
      }
    }
  }

  createBindings() {
    this._maintainAspectRatio = this._maintainAspectRatio.bind(this);
    this.onProgressUpdate = this.onProgressUpdate.bind(this);
    this.onUpdatePosition = this.onUpdatePosition.bind(this);
    this.createProgressBars = this.createProgressBars.bind(this);
    this.createHistory = this.createHistory.bind(this);
    this.onSelectQuestion = this.onSelectQuestion.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.showInfo = this.showInfo.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    window.addEventListener('resize', this._maintainAspectRatio, false);
  }

  componentWillUnmount() {
    this._isMounted = false;
    window.removeEventListener('resize', this._maintainAspectRatio, false);
  }

  _maintainAspectRatio() {
    if(this._isMounted) {
      this.setState({ ratio: window.innerWidth / this.state.w });
      if (this.state.h * this.state.ratio > window.innerHeight) {
          this.setState({ ratio: window.innerHeight / this.state.h });
      }

      this.setState({ 
        w: this.state.w * this.state.ratio, 
        h: this.state.h * this.state.ratio 
      });

      console.log("Aspect Ratio " + this.state.ratio);

      document.getElementById("viz").style.height = (this.state.ratio * 0.44 * this.state.h) + "px";
      document.getElementById("rater").style.height = (this.state.ratio * 0.56 * this.state.h) + "px";
      //document.getElementById("question").style.height = (this.state.ratio * this.state.h) + "px";

      this.props.onPropsChange(this.state.ratio);
    }
  }

  onProgressUpdate(count) {
    this.setState({ 
      count : count, 
      from : this.defaultColor, 
      to : this.defaultColor 
    });
  }

  onChange(colorFrom, colorTo, value, id, reset=false) {
    //console.log(colorFrom, colorTo, value);  
    this.setState({ from : colorFrom, to : colorTo, cardName: value, cardID: id, reset: reset });
  }

  onSelectQuestion(id) {
    this.setState({ 
      activeIndex : id, 
      from : this.defaultColor, 
      to : this.defaultColor   
    });
    //console.log(id);
  }

  toggle() {
    this.setState({ 
      collapse: !this.state.collapse,
      from : this.defaultColor,
      to : this.defaultColor  
    });
    this.state.codebookClick.play();
  }

  showInfo() {
    this.setState({
      show: !this.state.show,
      from : this.defaultColor,
      to : this.defaultColor
    });
    this.state.info.play();
  }

  deleteEvent(index, fromColor, toColor, cardName, cardID) {
    // console.log(index, fromColor, toColor, cardName);
    // count -> [notClassified, relevant, unknown, irrelevant]
    let count = this.state.count;
    ++count[this.color.indexOf(this.defaultColor)];
    --count[this.color.indexOf(toColor)];

    this.onProgressUpdate(count);
    this.cards[this.state.activeIndex].count = this.state.count;
    
    //change color and add value
    this.onChange(toColor, this.defaultColor, cardName, cardID, true);
    let x = (Math.floor(Math.random() * 200) + window.innerWidth*0.66*0.5-150);
    let y = (Math.floor(Math.random() * 200) + window.innerHeight*0.95*0.5-150);
    this.onUpdatePosition(this.cardPositions[this.state.activeIndex][cardID].stop, {x: x, y: y}, toColor, cardID, true);
  }

  onUpdatePosition(start, stop, color, value, flag) {
    let id = "cs" + this.state.activeIndex + "_" + value;
    this.cardColor[this.state.activeIndex][value] = color;
    this.cardPositions[this.state.activeIndex][value] = { start: start, stop: stop };
    //console.log(this.cardPositions);
    if(flag) {
      document.getElementById(id).style.backgroundColor = this.defaultColor;
      document.getElementById(id).style.transform = "translate("+this.cardPositions[this.state.activeIndex][value].stop.x+"px, "+this.cardPositions[this.state.activeIndex][value].stop.y+"px)";
      // this.cardColor[this.state.activeIndex][value] = this.defaultColor;
      // let val = this.state.activeIndex + 1;
      // if(this.state.activeIndex == this.props.data.questionsCount-1) {
      //   val = this.state.activeIndex - 1;
      // }
      // this.onSelectQuestion(val);
      //window.setTimeout(this.onSelectQuestion(this.state.activeIndex), 100);
    }
  }

  // to create elements for a question's cards
  createLabels() {
    //return this.labels.map((val, i) => {
      //let id = "cs"+i;
      //console.log("show" + this.state.activeIndex)
      //let cls = (i === this.state.activeIndex) ? "card-section" : "card-section hidden";
      let i = this.state.activeIndex;
      let cls = "card-section";
      let id = "cs" + i;
      return (
        <div className={cls} key={id} id={id}>
          <Cards id={id} 
                cards={this.props.data.values[i].values} 
                cardsCount={this.props.data.values[i].cardsCount} 
                count={this.cards[i].count} 
                ratio={this.props.ratio} 
                px={this.cardPositions[this.state.activeIndex]}
                py={this.cardPositions[this.state.activeIndex]}
                color={this.cardColor[this.state.activeIndex]}
                activeIndex={this.state.activeIndex}
                categories={this.props.data.categories}
                onChange={this.onChange}
                onUpdatePosition={this.onUpdatePosition}
                onProgressUpdate={this.onProgressUpdate} />
        </div>
      )
    //});
  }

  // creating history element
  createHistory(height) {
    //return this.history.map((val, i) => {
      //let id = "hist"+i;
      //let cls = (i === this.state.activeIndex) ? "history-main" : "history-main hidden";
      return (
        <div className={"history-main"} key={"hist"} id={"hist"}>
          <History count={this.props.data.questionsCount}
                   height={height}
                   from={this.state.from}
                   to={this.state.to}
                   cardID={this.state.cardID}
                   activeIndex={this.state.activeIndex}
                   cardName={this.state.cardName}
                   className="row"
                   deleteEvent={this.deleteEvent} />
        </div>
        );
    //});
  }

  // creating questions' elements
  createProgressBars() {
    for(var i=0; i<this.props.data.questionsCount; ++i) {
      let val = this.props.data.values[i].cardsCount * 4; //raters = 4

      this.progressBar[i] = <ProgressBar key={i} 
                          factor={0}
                          isOne={false}
                          cards={this.totalCards[i]} 
                          count={this.cards[i].count} 
                          qid={i}
                          onSelectQuestion={this.onSelectQuestion}
                          qname={this.props.data.values[i].src} 
                          active={i === this.state.activeIndex} />
      /// creating all progress bars
    }
    
    //var tmp = this.progressBar[0];
    //this.progressBar[0] = this.progressBar[this.state.activeIndex];
    //this.progressBar[this.state.activeIndex] = tmp;
    
    this.currProgressBar = <ProgressBar 
                          factor={this.totalCards[this.state.activeIndex]-this.props.data.values[this.state.activeIndex].cardsCount}
                          isOne={true}
                          cards={this.props.data.values[this.state.activeIndex].cardsCount} 
                          count={this.cards[this.state.activeIndex].count} 
                          qid={this.state.activeIndex}
                          onSelectQuestion={this.onSelectQuestion}
                          qname={this.props.data.values[this.state.activeIndex].src} 
                          active={true} />
    /// to set for active progress bar
    return this.progressBar;
  }

  render() {
    const vizH = (this.props.ratio * 0.39 * this.state.h) + "px";
    const raterH = (this.props.ratio * 0.30 * this.state.h) + "px";
    const historyFactor = window.innerHeight > 900 ? 0.28 : 0.25;
    const historyH = (this.props.ratio * historyFactor * this.state.h) + "px";
    //const quesH = (this.props.ratio * 0.12 * this.state.h) + "px";
    const codebookH = window.innerHeight > 900 ? (this.props.ratio * 0.62 * this.state.h) + "px" : "auto";

    const vizDesc = "Graphical representation of the progress made by all the domain-experts to train the ML Algorithm by labeling and classifying questions.";
    const raterDesc = "It is the representation of intercoder agreement, such as Cohen's kappa or Krippendoff alpha, is used to evaluate the robustness of the labeled data.";
    const historyDesc = "This section displays history data for each classification made per question by the trainer.";

    let rel = "The data which resembles most to the given question can be considered in this category... \nEg: " + this.props.data.values[0].values[0].description;
    let unk = "Any detail which is completely vague in terms of the information it provides is considered to be in 'unknown' set.. \nEg: " + this.props.data.values[0].values[1].description;
    let irr = "Those codes/data which provide some detail about the query made, but aren't sufficient enough are considered to be irrelevant data.. \nEg: " + this.props.data.values[0].values[2].description;;

    return (
      <div className="container-fluid">
        <div className="row"> 
          <div className="col-4 border">
            <PopoverItem id="viz" height={vizH} show={this.state.show}
                        placement="right" title="Total ML Training Progress" 
                        className="row" description={vizDesc}
                        elements={this.createProgressBars()} />
            <PopoverItem id="rater" height={raterH} show={this.state.show} 
                        placement="right" title="Rater's Agreement" 
                        className="row" description={raterDesc} 
                        elements={<Rater height={raterH} />} />
            <PopoverItem id="history" height={historyH} 
                        placement="right" title="History" show={this.state.show} 
                        className="row" description={historyDesc}
                        elements={this.createHistory(historyH)} />
            <div className="row" id="codebook">
            <Collapse className="in" isOpen={this.state.collapse} style={{width: "100%"}}>
              <Card>
                <CardBody style={{height: codebookH}}>
                  <CardTitle>Codebook</CardTitle>
                  <div><span className="bold">Question:</span> {this.props.data.values[this.state.activeIndex].src}</div>
                  <span>Relevant</span>
                  <textarea className="form-control" rows="5" defaultValue={rel}></textarea>
                  <span>Irrelevant</span>
                  <textarea className="form-control" rows="6" defaultValue={irr}></textarea>
                  <span>Unkown</span>
                  <textarea className="form-control" rows="5" defaultValue={unk}></textarea>
                </CardBody>
              </Card>
            </Collapse>
            <Button color="primary" onClick={this.toggle} style={{ position: 'fixed', bottom: 0 }}>Codebook</Button>
            </div>
          </div>
          <div className="col-8 border">
            <div className="row">
              {this.currProgressBar}
            </div>
            <div className="row">
              {this.createLabels()}
            </div>
          </div>
        </div>
        <div id="info" onClick={this.showInfo}></div>
        <div id="loader" style={{height: raterH}}></div>
      </div>
    );
  }
}

export default App;

// <div className="row">
//   <div id="question" className="question-tag" 
//         style={{height:quesH}}>
//     <Question qcount={this.props.data.questionsCount}
//               qcards={this.props.data.values} 
//               ratio={this.props.ratio}
//               onSelectQuestion={this.onSelectQuestion} />
//   </div>
// </div>

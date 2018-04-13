import React, { Component } from 'react';
import Cards from './Cards.js';
import Rater from './Rater.js';
import History from './History.js';
import Question from './Question.js';
import ProgressBar from './ProgressBar.js';
import PopoverItem from './PopoverItem.js';
import './css/App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.createBindings();
    this.state = {
      w: props.width, 
      h: props.height,
      ratio: 0,
      activeIndex: 0,
      from: "#ffc107",
      to: "#ffc107"
    };
    this._isMounted = false;
    this.cards = [];
    this.labels = [];
    this.progressBar = [];

    for(var i=0; i<props.data.questionsCount; ++i) {
      this.cards.push({count: [10,0,0,0]})
      this.progressBar.push(i);
      this.labels.push(i);
    }
  }

  createBindings() {
    this._maintainAspectRatio = this._maintainAspectRatio.bind(this);
    this.onProgressUpdate = this.onProgressUpdate.bind(this);
    this.createProgressBars = this.createProgressBars.bind(this);
    this.onSelectQuestion = this.onSelectQuestion.bind(this);
    this.onChange = this.onChange.bind(this);
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
      document.getElementById("question").style.height = (this.state.ratio * this.state.h) + "px";

      this.props.onPropsChange(this.state.ratio);
    }
  }

  onProgressUpdate(count) {
    this.setState({ count : count });
  }

  onChange(colorFrom, colorTo) {
    console.log(colorFrom, colorTo);
    this.setState({ from : colorFrom, to : colorTo});
  }

  onSelectQuestion(id) {
    this.setState({ activeIndex : id });
    //console.log(id);
  }

  createLabels() {
    return this.labels.map((val, i) => {
      let id = "c-"+i;
      //console.log("show" + this.state.activeIndex)
      let cls = (i === this.state.activeIndex) ? "card-section" : "card-section hidden";
      return (
        <div className={cls} key={id}>
          <Cards cards={this.props.data.values[i].values} 
                cardsCount={this.props.data.values[i].cardsCount} 
                count={this.cards[i].count} 
                ratio={this.props.ratio} 
                activeIndex={this.state.activeIndex}
                categories={this.props.data.classificationCategories}
                onChange={this.onChange}
                onProgressUpdate={this.onProgressUpdate} />
        </div>
      )
    });
  }

  createProgressBars() {
    for(var i=0; i<this.props.data.questionsCount; ++i) {
      this.progressBar[i] = <ProgressBar key={i} 
                          cards={this.props.data.values[i].cardsCount} 
                          count={this.cards[i].count} 
                          qid={this.props.data.values[i].src} 
                          active={i==this.state.activeIndex} />
    }
    var tmp = this.progressBar[0];
    this.progressBar[0] = this.progressBar[this.state.activeIndex];
    this.progressBar[this.state.activeIndex] = tmp;
    return this.progressBar;
  }

  render() {
    const vizH = (this.props.ratio * 0.44 * this.state.h) + "px";
    const raterH = (this.props.ratio * 0.30 * this.state.h) + "px";
    const historyH = (this.props.ratio * 0.26 * this.state.h) + "px";
    const quesH = (this.props.ratio * 0.12 * this.state.h) + "px";

    return (
      <div className="container-fluid">
        <div className="row"> 
          <div className="col-4 border">
            <PopoverItem id="viz" height={vizH} placement="right" title="Progress Report" 
                elements={this.createProgressBars()} className="row" />
            <PopoverItem id="rater" height={raterH} placement="right" title="Rater's Agreement" 
                elements={<Rater ratio={this.props.ratio} className="row" />} />
            <PopoverItem id="history" height={historyH} placement="right" title="History" className="row"
                elements={<History ratio={this.props.ratio} 
                                   from={this.state.from} 
                                   to={this.state.to} 
                                   className="row" />} />
          </div>
          <div className="col-8 border">
            <div className="row">
              <div id="question" className="question-tag" 
                    style={{height:quesH}}>
                <Question qcount={this.props.data.questionsCount}
                          qcards={this.props.data.values} 
                          ratio={this.props.ratio}
                          onSelectQuestion={this.onSelectQuestion} />
              </div>
            </div>
            <div className="row">
              {this.createLabels()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

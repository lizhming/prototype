import React, { Component } from 'react';
import Cards from './Cards.js';
import Rater from './Rater.js';
import Question from './Question.js';
import ProgressBar from './ProgressBar.js';
import './css/App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.createBindings();
    this.state = {
      w: props.width, 
      h: props.height,
      ratio: 0
    };
    this._isMounted = false;
    this.cards = [];
    this.questions = [];
    this.progressBar = [];

    for(var i=0; i<props.data.questionsCount; ++i) {
      this.cards.push({count: [10,0,0,0]})
      this.progressBar.push(i);
      this.questions.push(i);
    }
  }

  createBindings() {
    this._maintainAspectRatio = this._maintainAspectRatio.bind(this);
    this.onProgressUpdate = this.onProgressUpdate.bind(this);
    this.createProgressBars = this.createProgressBars.bind(this);
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
      document.getElementById("dash").style.height = (this.state.ratio * this.state.h) + "px";

      this.props.onPropsChange(this.state.ratio);
    }
  }

  onProgressUpdate(count) {
    this.setState({ count : count });
  }

  createQuestions() {
    return this.questions.map((val, i) => {
      let id = "c-"+i;
      let cls = (i === 0) ? "card-section" : "card-section hidden";
      return (
        <div className={cls} key={id}>
          <Cards cards={this.props.data.values[i].values} 
                cardsCount={this.props.data.values[i].cardsCount} 
                count={this.cards[i].count} 
                ratio={this.props.ratio} 
                onProgressUpdate={this.onProgressUpdate} />
        </div>
      )
    });
  }

  createProgressBars() {
    return this.progressBar.map((val, i) => {
      return <ProgressBar key={i} cards={this.props.data.values[i].cardsCount} 
                count={this.cards[i].count} />
    });
  }

  render() {
    const vizH = (this.props.ratio * 0.44 * this.state.h) + "px";
    const raterH = (this.props.ratio * 0.56 * this.state.h) + "px";

    return (
      <div className="container-fluid">
        <div className="row"> 
          <div className="col-4 border">
            <div className="row" id="viz" style={{height:vizH}}>
              {this.createProgressBars()}
            </div>
            <div className="row" id="rater" style={{height:raterH}}>
              <Rater ratio={this.props.ratio} />
            </div>
          </div>
          <div className="col-8 border">
            <div className="row" id="question" className="question-tag">
              <Question qcount={this.props.data.questionsCount}
                        qcards={this.props.data.values} 
                        ratio={this.props.ratio} />
            </div>
            <div className="row">
              {this.createQuestions()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

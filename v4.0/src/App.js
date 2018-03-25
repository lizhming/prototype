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
      ratio: 0,
      activeIndex: 0
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
                categories={this.props.data.classificationCategories}
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
    const quesH = (this.props.ratio * 0.12 * this.state.h) + "px";

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
            <div id="question" className="question-tag" 
                  style={{height:quesH}}>
              <Question qcount={this.props.data.questionsCount}
                        qcards={this.props.data.values} 
                        ratio={this.props.ratio}
                        onSelectQuestion={this.onSelectQuestion} />
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

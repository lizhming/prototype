import React, { Component } from 'react';
import Cards from './Cards.js';
import Rater from './Rater.js';
import Dash from './Dash.js';
import ProgressBar from './ProgressBar.js';
import './css/App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this._maintainAspectRatio = this._maintainAspectRatio.bind(this);
    this.state = {
      w: props.width, 
      h: props.height,
      ratio: 0
    };
    this._isMounted = false;
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
    }
  }

  render() {
    const viz = 'Viz';
    const vizH = (this.props.ratio * 0.44 * this.state.h) + "px";
    const raterH = (this.props.ratio * 0.56 * this.state.h) + "px";

    console.log(this.state.h, vizH, raterH);

    return (
      <div className="container-fluid">
        <div className="row"> 
          <div className="col-3 border">
            <div className="row" id="viz" style={{height:vizH}}>{viz}</div>
            <div className="row" id="rater" style={{height:raterH}}>
              <Rater ratio={this.props.ratio} />
            </div>
          </div>
          <div className="col-6 border">
            <ProgressBar />
            <Cards ratio={this.props.ratio} />
          </div>
          <div className="col-3 border" id="dash">
            <Dash ratio={this.props.ratio} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;

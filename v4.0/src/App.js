import React, { Component } from 'react';
import Cards from './Cards.js';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this._maintainAspectRatio = this._maintainAspectRatio.bind(this);
    this.state = {
      w: props.width, 
      h: props.width,
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
    this.setState({ ratio: window.innerWidth / this.state.w });
    if (this.state.h * this.state.ratio > window.innerHeight) {
        this.setState({ ratio: window.innerHeight / this.state.h });
    }

    this.setState({ 
      w: this.state.w * this.state.ratio, 
      h: this.state.h * this.state.ratio 
    });

    console.log("Aspect Ratio " + this.state.ratio);

    document.getElementById("viz").style.height = (this.state.ratio * 480) + "px";
    document.getElementById("rater").style.height = (this.state.ratio * 600) + "px";
    document.getElementById("dash").style.height = (this.state.ratio * 1080) + "px";
  }

  render() {
    const viz = 'Viz';
    const rater = 'Rater Agreement';
    const dash = 'DashBoard';
    const vizH = (this.props.ratio * 480) + "px";
    const raterH = (this.props.ratio * 600) + "px";
    const dashH = (this.props.ratio * this.props.height) + "px";

    return (
      <div className="container-fluid">
        <div className="row"> 
          <div className="col-3 border">
            <div className="row" id="viz" style={{height:vizH}}>{viz}</div>
            <div className="row" id="rater" style={{height:raterH}}>{rater}</div>
          </div>
          <div className="col-6 border">
            <Cards ratio={this.props.ratio}/>
          </div>
          <div className="col-3 border" id="dash" style={{height:dashH}}>{dash}</div>
        </div>
      </div>
    );
  }
}

export default App;

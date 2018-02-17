import React, { Component } from 'react';
import Cards from './Cards.js';

class App extends Component {
  constructor(props) {
    super(props);
    this._maintainAspectRatio = this._maintainAspectRatio.bind(this);
    this.state = {
      w: 1920, 
      h: 1080,
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
    if (this._isMounted) {
      this.setState({ ratio: window.innerWidth / this.state.w });
      if (this.state.h * this.state.ratio > window.innerHeight) {
          this.setState({ ratio: window.innerHeight / this.state.h });
      }

      this.setState({ 
        w: this.state.w * this.state.ratio, 
        h: this.state.h * this.state.ratio 
      });

      console.log("Aspect Ratio " + this.state.ratio);
    }
  }

  render() {
    const viz = 'Viz';
    const rater = 'Rater Agreement';
    const dash = 'DashBoard';

    return (
      <div className="container-fluid">
        <div className="row"> 
          <div className="col-3 border">
            <div className="row" id="viz">{viz}</div>
            <div className="row" id="rater">{rater}</div>
          </div>
          <div className="col-6 border">
            <Cards />
          </div>
          <div className="col-3 border" id="dash">{dash}</div>
        </div>
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import Cards from './Cards.js';

class App extends Component {

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

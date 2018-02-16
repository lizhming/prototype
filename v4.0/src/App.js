import React, { Component } from 'react';
import logo from './logo.svg';
import { Badge } from 'reactstrap';
import './App.css';

class App extends Component {
  render() {
    return (
      <div class="container-fluid">
        <div class="row">
          <div class="col-9">
            <div class="row">
              <div class="col-4 border">
                <div class="row" id="viz">Viz</div>
                <div class="row" id="rater">Rater Agreement</div>
              </div>
              <div class="col-8 border" id="draggable"></div>
            </div>
          </div>
          <div class="col-3 border" id="dash">
            DashBoard
          </div>
        </div>
      </div>
    );
  }
}

export default App;

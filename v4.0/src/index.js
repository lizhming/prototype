import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

var w = 1920, h = 1080;
var ratio;

window.addEventListener('resize', maintainAspectRatio, false);

function maintainAspectRatio() {
	ratio = window.innerWidth / w;
	if (h * ratio > window.innerHeight) {
	    ratio = window.innerHeight / h;
	}
	w *= ratio;
	h *= ratio;
}

maintainAspectRatio();

ReactDOM.render(<App width={w} ratio={ratio} height={h} />, document.getElementById('root'));
registerServiceWorker();

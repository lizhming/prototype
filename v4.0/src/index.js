import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';
import data from './data/file.json';
import registerServiceWorker from './registerServiceWorker';

var w = window.innerWidth, h = window.innerHeight;
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

function onPropsChange(r) {
	ratio = r;
}

ReactDOM.render(<App width={w} ratio={ratio} height={h} data={data} onPropsChange={onPropsChange} />, document.getElementById('root'));
registerServiceWorker();

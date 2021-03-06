import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';
import data from './data/file.json';
import registerServiceWorker from './registerServiceWorker';

/**
 * The index js file, to get the aspect ratio of the screen, and create renderer for ReactDOM
 */
var w = window.innerWidth, h = window.innerHeight;
var ratio;

window.addEventListener('resize', maintainAspectRatio, false);
document.getElementById("root").style.width = w + "px";
document.getElementById("root").style.height = h + "px";

console.log(w, h);

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

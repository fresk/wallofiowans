var _ = require('lodash');
var THREE = require('three');
var TWEEN = require('tween.js');
var ui = require('./ui');

NUM_COLUMNS = 8;
NUM_ROWS = 4;

var app = ui.app("wall-of-iowans");
var data = require('./data/iowans.json');
var panels = ui.repeat2D(panel, NUM_COLUMNS, NUM_ROWS);

ui.fit_to_parent(panels);
app.add(panels);


function panel(n, m, i){
	var p = ui.box(0.9,0.9,0.01);
	p.position.x = n * 0.95;
	p.position.y = m * 0.95;

	p.interactive = true;
	p.on_mouse_down = function(e){
		p.material = ui.color(0xcccccc);
		ui.animate(p.rotation, {
			y: Math.PI 
		}, 500);
	};
	return p;
}


function flip(panel){
	console.log("FLIP", panel);
};

















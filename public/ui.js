var _ = require('lodash');
var THREE = require('three');
var TWEEN = require('tween.js');

var tween = exports.Tween = TWEEN.Tween;


var animate = exports.animate = function(node, target_values, duration){
	var duration = duration || 1000;
	var t = new TWEEN.Tween(node);
	t.to(target_values, duration)
	t.start();
	

	// var start_values = {};

	// var keys = _.keys(target_values);
	// _.each(keys, function(key){
	// 	start_values = node[key];
	// });
	
	// var t = new TWEEN.Tween(start_values);
	// t.to(target_values, 1000)
	// t.onUpdate(function(){
	// 	console.log	
 //    });
	// t.start();

	return t;

}



var window_aspect = exports.window_aspect = function(){
	return window.innerWidth / window.innerHeight;
};


var get_center = exports.get_center = function(obj){
	var b = new THREE.Box3();
	b.setFromObject(obj);
	return b.center();
}


var scale = exports.scale = function(obj, scale){
	obj.scale.x = scale;
	obj.scale.y = scale;
	obj.scale.z = scale;
	obj.updateMatrix();
}

var color = exports.color = function(hex, options){
	options = options || {}
	options.color = hex;
	return new THREE.MeshBasicMaterial(options); 
};


var group = exports.group = function(){
	return new THREE.Object3D();
};


var sphere = exports.sphere = function(r, mat, sx, sy){
	mat = mat || color( 0xff0000 );
	sx = sx || 12;
	sy = sy || 12;
	var geometry = new THREE.SphereGeometry( r, sx, sy );
	return new THREE.Mesh( geometry, mat );
};


var box = exports.box = function(width, height, depdth, mat){
	if (mat == undefined)
		mat = color( 0xffffff );
	var geometry = new THREE.BoxGeometry( width, height, depdth );
	return new THREE.Mesh( geometry, mat );
};


var unit_grid = exports.unit_grid = function(){
	var grid = new THREE.GridHelper( 1, 0.5);
	grid.scale.set(0.5, 0.5, 0.5);
	grid.setColors(0xff0000, 0xffffff);
	//grid.rotation.x = Math.PI/2.0;
	return grid;
};



var fit_to_parent = exports.fit_to_parent = function(obj){
	var b = new THREE.Box3();
	b.setFromObject(obj);
	
	var size = b.size();
	var s = Math.min(1.0/size.x, 1.0/size.y);
	obj.scale.set(s,s,s);
	
	
	b.setFromObject(obj);
	var c = b.center();
	obj.position.x = -c.x;
	obj.position.y = -c.y;
	
};



var repeat = exports.repeat = function(create_object, n){
	var g = group();
	for(var i=0; i<n; i++){
		var obj = create_object(i);
		g.add(obj);
	}
	return g;
};



var repeat2D = exports.repeat2D = function(create_object, n, m){
	var i = 0;
	var g = group();
	for(var y=0; y<m; y++){
		for(var x=0; x<n; x++){
			i++;
			var obj = create_object(x,y,i);
			g.add(obj);
		}
	}
	return g;
};



var app = exports.app = function(title){

	window.document.title = title;

	//setup scene
	var scene = new THREE.Scene();
	var root = group();
	//root.add(unit_grid());
	scene.add(root);
	
	//intialize renderer
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	//camera
	var aspect = window_aspect();
	var camera = new THREE.PerspectiveCamera( 75, aspect, 1, 100 );
	camera.position.z = 10;
	scene.scale.set(14,14,10);

	//reset camera on window resize
	window.addEventListener('resize', function(){
		renderer.setSize( window.innerWidth, window.innerHeight );
		camera.aspect = window_aspect();
		camera.updateProjectionMatrix();
	}, false);


	//interactivity / input events	
	var raycaster = new THREE.Raycaster();
	var mousePosition = new THREE.Vector3();

	root.intersect = function(vec){
		var vec = vec || mousePosition.clone();	
		vec.unproject( camera );
		
		raycaster.set(camera.position, vec.sub( camera.position ).normalize());
		var intersects = raycaster.intersectObjects(root.children, true);

		return _.filter(intersects, function(hit){
			return hit.object.interactive;
		});		
	};

	window.addEventListener( 'mousemove', function(e){
		mousePosition.x = (e.x/window.innerWidth) * 2 - 1;
		mousePosition.y = -(e.y/window.innerHeight) * 2 + 1;
		mousePosition.z = 0.5;
	}, false );

	window.addEventListener('mousedown', function(e){
		var hits = root.intersect();
		console.log(hits);
		if(hits && hits[0].object){
			var target = hits[0].object;
			if (target.on_mouse_down){
				console.log("on_mouse_down", target.name, target.id);
				target.on_mouse_down(e);	
			}
		}
	}, false);



	root.render = function(){
		requestAnimationFrame( root.render );
		TWEEN.update();
		renderer.render(scene, camera)
	};
	root.render();
	return root;
};




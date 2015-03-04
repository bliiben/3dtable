var camera, scene, renderer, geometry, material, mesh, controls;

function launchAnimation(){
	init();
	animate();
}
	var geoList = [];
	var meshList = [];
function init() {
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 1000;

	controls = new THREE.TrackballControls( camera );

	material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
	for ( i in nodeList ){
		for( j in nodeList[i].link ){
			var g = new THREE.Geometry();
			geoList.push(g);

			g.vertices.push( new THREE.Vector3( nodeList[i].position.x*20-(20*7), nodeList[i].position.y*20-(20*7), nodeList[i].position.z*20-(20*7)));
			g.vertices.push( new THREE.Vector3( nodeList[i].link[j].link.position.x*20-(20*7), nodeList[i].link[j].link.position.y*20-(20*7), nodeList[i].link[j].link.position.z*20-(20*7)));

			mesh = new THREE.Line( g, material );

			nodeList[i].mesh.push(mesh);
			nodeList[i].link[j].link.mesh.push(mesh);
			meshList.push(mesh);
			scene.add(mesh);
		}
	}


	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	document.body.appendChild( renderer.domElement );
}

function animate() {
	// note: three.js includes requestAnimationFrame shim
	requestAnimationFrame( animate );
	controls.update();
	render();
}

function render() {
	renderer.render( scene, camera );
}
function linkingVerticesToNodes () {
	for(i in nodeList){
		for( j in nodeList[i].mesh ){
			for( k in nodeList[i].mesh[j].geometry.vertices ){
				if ( nodeList[i].mesh[j].geometry.vertices[k].x == nodeList[i].position.x*20-(20*7) && nodeList[i].mesh[j].geometry.vertices[k].y == nodeList[i].position.y*20-(20*7) && nodeList[i].mesh[j].geometry.vertices[k].z == nodeList[i].position.z*20-(20*7) ){
					nodeList[i].mesh[j].geometry.dynamic =true;
					nodeList[i].geometry.push( nodeList[i].mesh[j].geometry);
					nodeList[i].vector.push(nodeList[i].mesh[j].geometry.vertices[k]);
				}
			}
		}
	}
}
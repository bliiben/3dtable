// Script rule.js
// The 2nd of march 2015
// Author : Benjamin MIQUEL
// Description : Allow to compute de best organization of the linking of the elements with a string like algorithm


// 3d table
var CUBIC_SIZE = 14;
var SCANNABLE_SPACE = 1;
var env = (function (){ var r = []; for (var i = 0; i < CUBIC_SIZE; i++) {r.push([]); for (var j = 0; j < CUBIC_SIZE; j++) {r[i].push([]); for (var k = 0; k < CUBIC_SIZE; k++) {r[i][j].push(null); }; }; }; return r; }());
console.log("Setting env : "+env.length+"*"+env[0].length+"*"+env[0][0].length + " of " +env[0][0][0]);
var nodeList = [];
// Object

function Node(info){
	this.info=info;
	this.link=[];
	this.name=info.name;
	this.position;
	this.stress=0;
}
//If no arg
//	this.stress is set
//else
//	this.stress not set
//return stress
Node.prototype.calculStress = function(potentialPosition) {
	var stress= 0;
	var position = (typeof potentialPosition !='undefined')?potentialPosition:this.position;
	
	for ( i in this.link) 
		stress += imp(distance(position , this.link[i].link.position));

	if(typeof potentialPosition =='undefined')
		this.stress=stress;

	return stress;
};
// Differents globals functions

function Position(x,y,z){
	this.x=x;
	this.y=y;
	this.z=z;
}
function imp(a){ return a*a; }
function distance(a,b){
	return  Math.sqrt( (b.x-a.x) * (b.x-a.x) + (b.y-a.y) * (b.y-a.y) + (b.z-a.z) * (b.z-a.z) );
}
function isInBound(p){
	return p.x >= 0 && p.y >= 0 && p.z >= 0 && p.x < CUBIC_SIZE && p.y < CUBIC_SIZE && p.z < CUBIC_SIZE;
}
function getInBoundPositionOf(p){
	return new Position( Math.max( Math.min(0,p.x),CUBIC_SIZE) , Math.max( Math.min(0,p.y),CUBIC_SIZE) , Math.max( Math.min(0,p.z),CUBIC_SIZE) );
}
function someoneIn(p){
	return (getEnvP(p) != null);
}
function getEnvP(p){
	if( ! isInBound(p) ){
		p = getInBoundPositionOf(p);
		console.log("OutOfBound : Resizing : getEnvP");
	}
	return env[p.x][p.y][p.z];
}
function setEnvP(p,n){
	if( ! isInBound(p) ){
		p = getInBoundPositionOf(p);
		console.log("OutOfBound : Resizing : setEnvP");
	}
	env[p.x][p.y][p.z]=n;
	n.position=p;
}
function swapNodeEnv(p1,p2){
	var n1 = getEnvP(p1);
	var n2 = getEnvP(p2);

	setEnvP(p1,n2);
	setEnvP(p2,n1);
}
// Place a Node somewhere
function placeNodeRandom(n){
	var place = false;
	var essaies = 0;
	while (!place){
		essaies++;
		var p = new Position(rand(0,CUBIC_SIZE-1),rand(0,CUBIC_SIZE-1),rand(0,CUBIC_SIZE-1));
		if(getEnvP(p)==null){
			place=true;
			setEnvP(p,n);
		}
		if(essaies >100){
			console.log("Trop d'essaies");
			return;
		}
	}
}
function placeAllNode(){
	for ( i in nodeList ){
		placeNodeRandom(nodeList[i]);
	}
}

// Move to an more appropriate place the node

function moveNodeSomewhereBetter(n){
	
	var bestP = new Position(n.x,n.y,n.z);
	var minimumStress = null;
	n.calculStress();
	for (var i = -1*SCANNABLE_SPACE+n.position.x; i <= n.position.x + SCANNABLE_SPACE ; i++) {
		for (var j = -1*SCANNABLE_SPACE+n.position.y; j <= n.position.y + SCANNABLE_SPACE ; j++) {
			for (var k = -1*SCANNABLE_SPACE+n.position.z; k <= n.position.z + SCANNABLE_SPACE ; k++) {

				if( i==j && j==k)
					continue;

				var currentPosition = new Position(i,j,k);

				if( ! isInBound(currentPosition) )
					continue;

				var stressHere = n.calculStress(currentPosition);

				if( minimumStress == null || minimumStress > stressHere){
					minimumStress = stressHere;
					bestP=currentPosition;
				}
				
			};
		};
	};
	
	if( minimumStress < n.stress ){
		// Is someone already at this place ?
		if(someoneIn(bestP)){
			// Is it better for the common good to move it ?
			var stranger = getEnvP(bestP);
			stranger.calculStress();
			if( stranger.calculStress(bestP) + minimumStress <= stranger.stress + n.stress ){
				swapNodeEnv(bestP,n.position);
				console.log("swap in ",bestP);
			}else{
				console.log("Best solution found");
				return;
			}

		}else{
			setEnvP(bestP,n);
			console.log("moved in ",bestP);
		}
	}
}
// Collect data from data.json to create the linking

var content=null;
$(function (){

	$.getJSON("data.json").done(function(contentJson){
		content = contentJson;
		total_node = 0;
		for (var i = 0; i < content.length; i++) {
			content[i].node = new Node(content[i]);
			nodeList.push(content[i].node);
		};
		for (var i = 0; i < content.length; i++) {
			for (var j = 0; j < content.length; j++) {
				if( i==j )
					continue;

				for (var k = 0; k < content[i].column.length; k++) {
					if(content[i].column[k].ref == content[j].name){
						content[i].node.link.push({link:content[j].node,label:content[i].column[k].name,color:content[i].column[k].color});
						//content[i].node.link.push({link:content[j].node,label:content[i].column[k].name,color:content[i].column[k].color});
						total_node ++;
					}
				};
			};
		};
		console.log("Node linked : "+total_node);

		json_loaded();
	});
});


function json_loaded(){
	//Put into 3d environment
	placeAllNode();
}
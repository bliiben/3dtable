// Script rule.js
// The 2nd of march 2015
// Author : Benjamin MIQUEL
// Description : Allow to compute de best organization of the linking of the elements with a string like algorithm


// 3d table
var CUBIC_SIZE = 14; 
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

Node.prototype.calculStress = function(position) {
	position = position | this.p;
	this.stress=0;
	for ( i in this.connexion) {
		this.stress += imp(distance(position , connexion[i].p));
	}
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
}
// Place a Node somewhere
function placeNode(n){
	var p = new Position(rand(0,CUBIC_SIZE-1),rand(0,CUBIC_SIZE-1),rand(0,CUBIC_SIZE-1));
	if(getEnvP(p)==null){

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
}
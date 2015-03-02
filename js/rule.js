// Script rule.js
// The 2nd of march 2015
// Author : Benjamin MIQUEL
// Description : Allow to compute de best organization of the linking of the elements with a string like algorithm


// 3d table
var CUBIC_SIZE = 14; 
var env = (function (){ var r = []; for (var i = 0; i < CUBIC_SIZE; i++) {r.push([]); for (var j = 0; j < CUBIC_SIZE; j++) {r[i].push([]); for (var k = 0; k < CUBIC_SIZE; k++) {r[i][j].push(null); }; }; }; return r; }());
console.log("Setting env : "+env.length+"*"+env[0].length+"*"+env[0][0].length + " of " +env[0][0][0]);
// Object

function Node(info){
	this.info=info;
	this.link=[];
	this.name=info.name;
}


// Collect data from data.json to create the linking

var content=null;
$(function (){

	$.getJSON("data.json").done(function(contentJson){
		content = contentJson;
		total_node = 0;
		for (var i = 0; i < content.length; i++) {
			content[i].node = new Node(content[i]);
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
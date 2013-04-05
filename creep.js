function Creep(board) {
	"use strict";

	var matrix = board;
	var pathFinding = new AStar(matrix);
	var ele;

	var callback;

	var path;
	var goal;

	var timeout;

	var row;
	var col;


	var transX = 0;
	var transY = 0;

	// Initialize the creep to start at a location
	this.initialize = function(startRow, startCol, endGoal, callbackFn) {
		row = startRow;
		col = startCol;
		goal = endGoal;
		callback = callbackFn;

		ele = document.createElement("div");
		ele.className = "creep";
		var box = document.getElementById("box");
		$(box).append(ele);

		stop();

		//ele.dataset.loc = startRow + "-" + startCol;

		ele.addEventListener('webkitTransitionEnd', function() {
			clearTimeout(timeout);
			moveToNext();
		}, false);
	};

	this.stop = function() {
		console.log("stopping");
		path = [];
		clearTimeout(timeout);
	};

	// Returns true if a path was found. False otherwise
	this.pathFind = function() {
		// Reset all the classes
		var lines = document.getElementById("box").childNodes;
		for (var i = 0; i < lines.length; i++) {
			for (var j = 0; j < lines[i].childNodes.length; j++) {
				lines[i].childNodes[j].className = "cell";
			}
		}

		var path = pathFinding.findPath(matrix[row][col], goal);
		if (!path) {
			return false;
		} else {
			path.forEach(function(item) {
				$(document.getElementById(item)).addClass("path");
			});

			animate(path);
			return true;
		}
	};

	function animate(directions) {
		path = directions;
		ele.dataset.loc = path.shift();

		// Quick delay to render
		setTimeout(moveToNext, 0);
		//console.log(path);
	}

	function moveToNext() {
		var next = path.shift();

		// no more items in path
		if (!next) {
			callback();
			return;
		}

		var current = ele.dataset.loc.split("-");
		var nextParts = next.split("-");

		if (current[0] < nextParts[0]) {
			row += 1;
		} else if (current[0] > nextParts[0]) {
			row -= 1;
		} else if (current[1] < nextParts[1]) {
			col += 1;
		} else {
			col -= 1;
		}

		var transform = "translate3d(" + (col * 20) + "px, " + (row * 20) + "px, 0px)";
		ele.style.webkitTransform = transform;
		ele.dataset.loc = next;
		console.log("moving to: " + next);

		timeout = setTimeout(moveToNext, 500);
	}
}
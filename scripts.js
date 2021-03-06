var c = document.getElementById("myCanvas");
var gridHeight = c.height;
var gridWidth = c.width;
var density = 0.55;
var theGrid = createArray(gridWidth);
var mirrorGrid = createArray(gridWidth);
var ctx = c.getContext("2d");
ctx.fillStyle = "#951C02";

function hideBody() {
    var tohide = document.getElementById("tohide");
    var toshow = document.getElementById("toshow");

    if (tohide.style.opacity == "0"){
        tohide.style.opacity = "1";
        tohide.style.filter  = 'alpha(opacity=1)'; // IE fallback
        toshow.style.opacity = "0";
        toshow.style.filter  = 'alpha(opacity=0)'; // IE fallback

    }
    else {
        tohide.style.opacity = "0";
        tohide.style.filter  = 'alpha(opacity=0)'; // IE fallback
        toshow.style.opacity = "1";
        toshow.style.filter  = 'alpha(opacity=1)'; // IE fallback

    }
}

fillRandom(); //create the starting state for the grid by filling it with random cells
//var bm = getBitmap();
//fillDet(bm);
tick(); //call main loop

//functions
function tick() { //one tick
	console.time("loop");
	drawGrid();
	updateGrid();
	console.timeEnd("loop");
}

var run_life = false;

function switchLife() {
    run_life = !run_life;
}

function killLife() {
    run_life = false;
}

function birthLife() {
    run_life = true;
}

function checkLife() {
    return run_life;
}

function startLife() {
    switchLife();
    runLife();
}

function runLife() { //main loop
	console.time("loop");
	drawGrid();
	updateGrid();
    run_life = checkLife();
    if (run_life) {
	    console.timeEnd("loop");
        requestAnimationFrame(runLife);
    }
}

function createArray(rows) { //creates a 2 dimensional array of required height
	var arr = [];
	for (var i = 0; i < rows; i++) {
		arr[i] = [];
	}
	return arr;
}

function fillRandom() { //fill the grid randomly
	for (var j = 100; j < gridHeight - 100; j++) { //iterate through rows
		for (var k = 100; k < gridWidth - 100; k++) { //iterate through columns
			theGrid[j][k] = Math.round(Math.random()*density);
		}
	}
}

function drawGrid() { //draw the contents of the grid onto a canvas
var liveCount = 0;
	ctx.clearRect(0, 0, gridHeight, gridWidth); //this should clear the canvas ahead of each redraw
	for (var j = 1; j < gridHeight; j++) { //iterate through rows
		for (var k = 1; k < gridWidth; k++) { //iterate through columns
			if (theGrid[j][k] === 1) {
				ctx.fillRect(j, k, 1, 1);
				liveCount++;
				
			}
		}
	}
	console.log(liveCount/100);
}

function updateGrid() { //perform one iteration of grid update
   
	for (var j = 1; j < gridHeight - 1; j++) { //iterate through rows
		for (var k = 1; k < gridWidth - 1; k++) { //iterate through columns
			var totalCells = 0;
			//add up the total values for the surrounding cells
			totalCells += theGrid[j - 1][k - 1]; //top left
			totalCells += theGrid[j - 1][k]; //top center
			totalCells += theGrid[j - 1][k + 1]; //top right

			totalCells += theGrid[j][k - 1]; //middle left
			totalCells += theGrid[j][k + 1]; //middle right

			totalCells += theGrid[j + 1][k - 1]; //bottom left
			totalCells += theGrid[j + 1][k]; //bottom center
			totalCells += theGrid[j + 1][k + 1]; //bottom right

			//apply the rules to each cell
			switch (totalCells) {
				case 2:
					mirrorGrid[j][k] = theGrid[j][k];
				   
					break;
				case 3:
					mirrorGrid[j][k] = 1; //live
					
					break;
				default:
					mirrorGrid[j][k] = 0; //
			}
		}
	}

	//mirror edges to create wraparound effect

	for (var l = 1; l < gridHeight - 1; l++) { //iterate through rows
		//top and bottom
		mirrorGrid[l][0] = mirrorGrid[l][gridHeight - 3];
		mirrorGrid[l][gridHeight - 2] = mirrorGrid[l][1];
		//left and right
		mirrorGrid[0][l] = mirrorGrid[gridHeight - 3][l];
		mirrorGrid[gridHeight - 2][l] = mirrorGrid[1][l];

	}


	//swap grids
	var temp = theGrid;
	theGrid = mirrorGrid;
	mirrorGrid = temp;
}

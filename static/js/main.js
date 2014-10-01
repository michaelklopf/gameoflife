var $ = require('jquery');

var gameBoard = [];
var nextStepGameBoard = [];
var rows = 100;
var columns = 100;
var grid_width = 800;
var grid_height = 800;
var start_x = 50;
var start_y = 50;

$(document).ready(function() {
    var c = document.getElementById('grid');
    var ctx = c.getContext("2d");
    initializeGameBoard(ctx);
});

var initializeGameBoard = function(context) {
  createEmptyGameBoard();

  addInitialValuesToGameBoard();

  paintGameBoard(context);

  setInterval(function(){checkLife(context)}, 1000);
};

var checkLife = function(context) {
  evaluateLife(context);
  gameBoard = nextStepGameBoard.slice(0);
  paintGameBoard(context);
};

var evaluateLife = function(context) {
  for (var h = 0; h < rows; h++) {
    for (var w = 0; w < columns; w++) {
      checkRulesForCell(h, w);
    }
  }
};

var checkRulesForCell = function(row_pos, col_pos) {
  var neighbors = getNeighborsOfCell(row_pos, col_pos);
  if (typeof neighbors === 'undefined' || !(neighbors instanceof Array)) {
    console.log("Error when checking neighbors of cell");
    return;
  }

  var livingNeighbors = countLivingNeighbors(neighbors);
  // when cell is alive it can only die or survive (survice is implicit)
  if (gameBoard[row_pos][col_pos] === 'x') {
    if (isDyingOfOverpopulation(livingNeighbors) || isDyingOfUnderpopulation(livingNeighbors)) {
      nextStepGameBoard[row_pos][col_pos] = '';
      return;
    }
    if (isSurviving) {
      nextStepGameBoard[row_pos][col_pos] = 'x';
      return;
    }
  // when cell is dead it can be born or stay dead
  } else if (gameBoard[row_pos][col_pos] === '') {
    if (isDyingOfOverpopulation(livingNeighbors) || isDyingOfUnderpopulation(livingNeighbors)) {
      nextStepGameBoard[row_pos][col_pos] = '';
      return;
    }
    if (isBorn(livingNeighbors)) {
      nextStepGameBoard[row_pos][col_pos] = 'x';
      return;
    }
  } else {
    console.log("Warning: Unkown cell type.");
  }
};

var paintGameBoard = function(context) {
  var cell_width = grid_width / columns;
  var cell_height = grid_height / rows;

  var current_pos_x = start_x;
  var current_pos_y = start_y;
  context.moveTo(current_pos_x, current_pos_y);
  for (var h = 0; h < rows; h++) {
    for (var w = 0; w < columns; w++) {
      if (gameBoard[h][w] === '') {
        context.clearRect(current_pos_x, current_pos_y, cell_width, cell_height);
        context.strokeStyle = "black";
        context.strokeRect(current_pos_x, current_pos_y, cell_width, cell_height);
      } else if (gameBoard[h][w] === 'x') {
        context.fillStyle = "black";
        context.fillRect(current_pos_x, current_pos_y, cell_width, cell_height);
      }
      current_pos_x = current_pos_x + cell_width;
    }
    current_pos_x = start_x;
    current_pos_y = current_pos_y + cell_height;
  }
};

var createEmptyGameBoard = function() {
  // mulit-dimensional arrays have to be set up as seen here
  var w;
  var h;

  for (h = 0; h < rows; h++) {
    gameBoard[h] = [rows];
    nextStepGameBoard[h] = [rows];
    for (w = 0; w < columns; w++) {
      gameBoard[h][w] = '';
      nextStepGameBoard[h][w] = '';
    }
  }
};

/*
  Any live cell with fewer than two live neighbours dies, as if caused by under-population.
*/
var isDyingOfUnderpopulation = function(livingNeighbors) {
  if (livingNeighbors < 2)
    return true;
  else
    return false;
};

/*
  Any live cell with two or three live neighbours lives on to the next generation.
*/
var isSurviving = function(livingNeighbors) {
  console.log(livingNeighbors);
  if (livingNeighbors === 2 || livingNeighbors === 3) {
    return true;
  } else {
    return false;
  }
};

/*
  Any live cell with more than three live neighbours dies, as if by overcrowding.
*/
var isDyingOfOverpopulation = function(livingNeighbors) {
  if (livingNeighbors > 3)
    return true
  else
    return false;
};

/*
  Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
*/
var isBorn = function(livingNeighbors) {
  if (livingNeighbors === 3)
    return true;
  else
    return false;
};

var countLivingNeighbors = function(neighbors) {
  var livingNeighbors = 0;
  for (var i=0, max_neighbors = neighbors.length; i<max_neighbors; i++) {
    if (neighbors[i] === 'x') {
      livingNeighbors = livingNeighbors + 1;
    }
  }
  return livingNeighbors;
};

var getNeighborsOfCell = function(row_pos, col_pos) {
  if (!isCellValid) {
    return;
  }
  var neighbors = [];

  neighbors = checkForCornerCells(row_pos, col_pos);
  if (typeof neighbors === 'undefined' || !(neighbors instanceof Array)) {
    console.log("Error when checking neighbors of cell");
    return;
  }
  if (neighbors.length > 0) {
    return neighbors;
  }

  neighbors = checkForEdgeCells(row_pos, col_pos);
  if (typeof neighbors === 'undefined' || !(neighbors instanceof Array)) {
    console.log("Error when checking neighbors of cell");
    return;
  }
  if (neighbors.length > 0) {
    return neighbors;
  }

  neighbors = getCellNeighbors(row_pos, col_pos);
  if (typeof neighbors === 'undefined' || !(neighbors instanceof Array)) {
    console.log("Error when checking neighbors of cell");
    return;
  }
  if (neighbors.length > 0) {
    return neighbors;
  }
};

var isCellValid = function(row_pos, col_pos) {
  if (row_pos < 0) {
    return false;
  } else if (row_pos > rows-1) {
    return false;
  } else if (col_pos < 0) {
    return false;
  } else if (col_pos > columns-1) {
    return false;
  } else {
    return true;
  }
};

var checkForCornerCells = function(row_pos, col_pos) {
  if (!isCellValid(row_pos, col_pos)) {
    return;
  }
  var neighbors = [];
  // top left corner
  if (row_pos-1 < 0 && col_pos-1 < 0) {
    neighbors.push(gameBoard[row_pos+1][col_pos]);
    neighbors.push(gameBoard[row_pos][col_pos+1]);
    neighbors.push(gameBoard[row_pos+1][col_pos+1]);
    return neighbors;
  // top right corner
  } else if (row_pos-1 < 0 && col_pos+1 > columns-1) {
    neighbors.push(gameBoard[row_pos][col_pos-1]);
    neighbors.push(gameBoard[row_pos+1][col_pos]);
    neighbors.push(gameBoard[row_pos+1][col_pos-1]);
    return neighbors;
  // bottom left corner
  } else if (row_pos+1 > rows-1 && col_pos-1 < 0) {
    neighbors.push(gameBoard[row_pos-1][col_pos]);
    neighbors.push(gameBoard[row_pos][col_pos+1]);
    neighbors.push(gameBoard[row_pos-1][col_pos+1]);
    return neighbors;
  // bottom right corner
  } else if (row_pos+1 > rows-1 && col_pos+1 > columns-1) {
    neighbors.push(gameBoard[row_pos-1][col_pos]);
    neighbors.push(gameBoard[row_pos][col_pos-1]);
    neighbors.push(gameBoard[row_pos-1][col_pos-1]);
    return neighbors;
  // no corner cell
  } else {
    return neighbors;
  }
}

/*
  Requires a check for the corner cases first.
  So call it after checkForCornerCells.
*/
var checkForEdgeCells = function(row_pos, col_pos) {
  if (!isCellValid(row_pos, col_pos)) {
    return;
  }
  var neighbors = [];
  // left edge
  if (col_pos === 0) {
    neighbors.push(gameBoard[row_pos-1][col_pos]);
    neighbors.push(gameBoard[row_pos+1][col_pos]);
    neighbors.push(gameBoard[row_pos-1][col_pos+1]);
    neighbors.push(gameBoard[row_pos][col_pos+1]);
    neighbors.push(gameBoard[row_pos+1][col_pos+1]);
    return neighbors;
  // right edge
  } else if (col_pos === columns-1) {
    neighbors.push(gameBoard[row_pos-1][col_pos]);
    neighbors.push(gameBoard[row_pos+1][col_pos]);
    neighbors.push(gameBoard[row_pos-1][col_pos-1]);
    neighbors.push(gameBoard[row_pos][col_pos-1]);
    neighbors.push(gameBoard[row_pos+1][col_pos-1]);
    return neighbors;
  // top edge
  } else if (row_pos === 0) {
    neighbors.push(gameBoard[row_pos][col_pos-1]);
    neighbors.push(gameBoard[row_pos][col_pos+1]);
    neighbors.push(gameBoard[row_pos+1][col_pos-1]);
    neighbors.push(gameBoard[row_pos+1][col_pos]);
    neighbors.push(gameBoard[row_pos+1][col_pos+1]);
    return neighbors;
  // bottom edge
  } else if (row_pos === rows-1) {
    neighbors.push(gameBoard[row_pos][col_pos-1]);
    neighbors.push(gameBoard[row_pos][col_pos+1]);
    neighbors.push(gameBoard[row_pos-1][col_pos-1]);
    neighbors.push(gameBoard[row_pos-1][col_pos]);
    neighbors.push(gameBoard[row_pos-1][col_pos+1]);
    return neighbors;
  // no edge cells
  } else {
    return neighbors;
  }
};

/*
  Requires that you check for corner and edge cells first.
  Will happily find all the neighbors of a normal cell then.
*/
var getCellNeighbors = function(row_pos, col_pos) {
  if (!isCellValid(row_pos, col_pos)) {
    return;
  }
  var neighbors = [];
  // start on top
  neighbors.push(gameBoard[row_pos-1][col_pos]);
  neighbors.push(gameBoard[row_pos-1][col_pos+1]);
  neighbors.push(gameBoard[row_pos][col_pos+1]);
  neighbors.push(gameBoard[row_pos+1][col_pos+1]);
  neighbors.push(gameBoard[row_pos+1][col_pos]);
  neighbors.push(gameBoard[row_pos+1][col_pos-1]);
  neighbors.push(gameBoard[row_pos][col_pos-1]);
  // stop on top left
  neighbors.push(gameBoard[row_pos-1][col_pos-1]);
  return neighbors;
};

var addInitialValuesToGameBoard = function() {
  // maybe with probability. Higher on the inside.
  gameBoard[50][50] = 'x';
  gameBoard[50][49] = 'x';
  gameBoard[51][50] = 'x';
  gameBoard[51][49] = 'x';
  gameBoard[50][5] = 'x';
  gameBoard[50][4] = 'x';
  gameBoard[50][3] = 'x';
  gameBoard[51][29] = 'x';
  gameBoard[50][29] = 'x';
  gameBoard[50][30] = 'x';
  gameBoard[50][50] = 'x';
  gameBoard[50][49] = 'x';
  gameBoard[51][50] = 'x';
  gameBoard[51][49] = 'x';

  gameBoard[51][50] = 'x';
  gameBoard[52][49] = 'x';
  gameBoard[53][50] = 'x';
  gameBoard[52][49] = 'x';
  gameBoard[51][5] = 'x';
  gameBoard[51][4] = 'x';
  gameBoard[51][3] = 'x';
  gameBoard[52][29] = 'x';
  gameBoard[51][29] = 'x';
  gameBoard[51][30] = 'x';
  gameBoard[51][50] = 'x';
  gameBoard[51][49] = 'x';
  gameBoard[52][50] = 'x';
  gameBoard[52][49] = 'x';

  gameBoard[52][50] = 'x';
  gameBoard[53][49] = 'x';
  gameBoard[54][50] = 'x';
  gameBoard[53][49] = 'x';
  gameBoard[52][5] = 'x';
  gameBoard[52][4] = 'x';
  gameBoard[52][3] = 'x';
  gameBoard[53][29] = 'x';
  gameBoard[52][29] = 'x';
  gameBoard[52][30] = 'x';
  gameBoard[52][50] = 'x';
  gameBoard[52][49] = 'x';
  gameBoard[53][50] = 'x';
  gameBoard[53][49] = 'x';

  gameBoard[70][60] = 'x';
  gameBoard[70][59] = 'x';
  gameBoard[71][60] = 'x';
  gameBoard[71][59] = 'x';
  gameBoard[70][5] = 'x';
  gameBoard[70][4] = 'x';
  gameBoard[70][3] = 'x';
  gameBoard[71][39] = 'x';
  gameBoard[70][39] = 'x';
  gameBoard[70][40] = 'x';
  gameBoard[70][60] = 'x';
  gameBoard[70][59] = 'x';
  gameBoard[71][60] = 'x';
  gameBoard[71][59] = 'x';
};

var logGameBoard = function(gameBoardToLog) {
  for (var i = 0; i<rows; i++) {
    //var output = "";
    console.log(gameBoardToLog[i]);
  }
  console.log("\n");
};

var gameBoard = [];
var rows = 10;
var columns = 10;
var grid_width = 600;
var grid_height = 600;
var start_x = 10;
var start_y = 10;

$(document).ready(function() {
    var c = document.getElementById('grid');
    var ctx = c.getContext("2d");
    initializeGameBoard(ctx);
});

var initializeGameBoard = function(context) {
  createEmptyGameBoard();

  addInitialValuesToGameBoard();

  paintGameBoard(context);

  //logGameBoard();
}

var paintGameBoard = function(context) {
  var cell_width = grid_width / columns;
  var cell_height = grid_height / rows;

  context.rect(start_x, start_y, grid_width, grid_height);
  context.strokeStyle = "black";
  context.stroke();

  var w;
  var h;

  var current_pos_x = start_x;
  var current_pos_y = start_y;

  context.moveTo(current_pos_x, current_pos_y);
  for (h = 0; h < rows; h++) {
    for (w = 0; w < columns; w++) {
      if (gameBoard[h][w] === '') {
        context.rect(current_pos_x, current_pos_y, cell_width, cell_height);
        context.strokeStyle = "black";
        context.stroke();
      } else if (gameBoard[h][w] === 'x') {
        context.fillStyle = "black";
        context.fillRect(current_pos_x, current_pos_y, cell_width, cell_height);
      }
      current_pos_x = current_pos_x + cell_width;
    }
    current_pos_x = start_x;
    current_pos_y = current_pos_y + cell_height;
  }
}

var createEmptyGameBoard = function() {
  // mulit-dimensional arrays have to be set up as seen here
  var w;
  var h;

  for (h = 0; h < rows; h++) {
    gameBoard[h] = [rows];
    for (w = 0; w < columns; w++) {
      gameBoard[h][w] = '';
    }
  }
}

var addInitialValuesToGameBoard = function() {
  // maybe with probability. Higher on the inside.
  /*
  gameBoard[50][50] = 'x';
  gameBoard[50][49] = 'x';
  gameBoard[51][50] = 'x';
  gameBoard[51][49] = 'x';
  */
  gameBoard[4][5] = 'x';
  gameBoard[5][4] = 'x';
  gameBoard[5][3] = 'x';
}

var logGameBoard = function() {
  for (var i = 0; i<rows; i++) {
    //var output = "";
    console.log(gameBoard[i]);
  }
}

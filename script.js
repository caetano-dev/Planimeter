//canvas tem 1307 de largura e 802 de altura
//cada quadrado do plano tem 51x51

var can = document.querySelector(".canvas-main");           // variable for the canvas
var con = can.getContext('2d');                             // variable for the context
var clearButton = document.querySelector('.clear');         // variable for the clear button
var imageButton = document.querySelector('.image'); 
var calculateAreaButton = document.querySelector('.area'); 
var paint = false;                                          // a flag will be set true when left-button is held down; this will allow painting
var mouseX, mouseY;                                         // variables to store mouse coordinates
var coord = [];                                             // array to store all (x,y) coordinates
var imageData = con.getImageData(0, 0, can.width, can.height);
var resultTextArea = document.querySelector('#result');

// When clear button is pressed, clear the canvas & reset the coord array back to an empty array
clearButton.addEventListener('click', function() {
  con.clearRect(0, 0, con.canvas.width, con.canvas.height);
  coord = [];
})


// addClick is a function that saves all (x,y) mouse coordinates into the coord array.
function addClick(x, y, drag) {
    coord.push({ X: x,                                     // else, color uses currentColor
                  Y: y, 
                  DRAG: drag, 
              });
}

// redraw will clear the canvas and 
// it will cycle through the coord array, drawing mini-lines between each pair of 
// coordinates to represent what the user is drawing.
function redraw() {
  con.clearRect(0, 0, con.canvas.width, con.canvas.height);       // clear canvas
      
  for(var i=0; i < coord.length; i++) {                           // iterate through "coord" array
    con.beginPath();
    
    if (coord[i].DRAG) {                                          // if DRAG is true, this means the current (x,y) isn't the start of a user-drawn line, 
       con.moveTo(coord[i-1].X, coord[i-1].Y);                    // it's in the middle somewhere as part of that line.  
    }                                                             // So the moveTo() method should start at the previous (x,y) in our array.
    else {
       con.moveTo(coord[i].X + 1, coord[i].Y + 1);                // else the current (x,y) is the start point for a user-drawn line.  
    }                                                             // Then the moveTo() should go to a neighboring point, this will cause the start point to appear
                                                                  // as a dot on our board.
    con.lineTo(coord[i].X, coord[i].Y);                           // lineTo() should do to the current (x,y) in our array
    con.closePath();              
    con.lineWidth = 3;                               // use the thickness set to 3
    con.strokeStyle = 'rgb(0%, 0%, 0%)';              // use the color set to black
    con.stroke();                                                 // draw this mini-line
  }
}

function calculateArea(coord) {
  let area = 0;
  for (let i = 0; i < coord.length - 1; i++) {
    let x = coord[i].X;
    let y = coord[i].Y;
    let nextX = coord[i + 1].X;
    let nextY = coord[i + 1].Y;
    area += x * nextY - y * nextX;
  }
  return Math.abs(area / 2);
}

// event handler for when the left mouse button is held down, the user is drawing
can.addEventListener('mousedown', function(e) {
  mouseX = e.pageX - this.offsetLeft;                              // record the coordinates
  mouseY = e.pageY - this.offsetTop;

  paint = true;                                                    // set paint flag as true, because we want to draw on the board
  addClick(mouseX, mouseY, false);                                 // send coordinates to addClick().  False is for the DRAG boolean variable
  redraw();                                                        // to denote this (x,y) is the first point of a line drawn by user.
});

// event handler for when the user moves the mouse around
can.addEventListener('mousemove', function(e) {
  mouseX = e.pageX - this.offsetLeft;         
  mouseY = e.pageY - this.offsetTop;

  if (paint) {                                                      // record coordinates only if the paint flag is true, which is set true 
    addClick(mouseX, mouseY, true);                                 // when the left mouse button is held down.  Here DRAG is true, to tell 
    redraw();                                                       // the function that this (x,y) is part of the line rather than the start of it
  }
});

// event handler for when user lets go of the mouse button
can.addEventListener('mouseup', function(e) {
  paint = false;                                                    // set paint to false, we don't want to record these (x,y) coordinates
});

// event handler for when user moves mouse out of bounds of canvas
can.addEventListener('mouseleave', function(e) {                    
  paint = false;                                                    // set paint to false, we don't want to record these (x,y) coordinates
});

calculateAreaButton.addEventListener("click", function(){
  resultText = `Valor da área: ${calculateArea(coord)/2500} cm²`
  resultTextArea.innerText = resultText
})
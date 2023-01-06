const calculateAreaButton = document.querySelector('.area');
const coordinates = document.querySelector('#coordinates');
const resultTextArea = document.querySelector('#result');
const clearButton = document.querySelector('.clear');
const can = document.querySelector(".canvas-main");
const con = can.getContext('2d');
let mouseX, mouseY;
let paint = false;
let coord = [];

clearButton.addEventListener('click', function() {
  con.clearRect(0, 0, con.canvas.width, con.canvas.height);
  coord = [];
});

function addClick(x, y, drag) {
  coord.push({ X: x, Y: y, DRAG: drag });
}

function redraw() {
  con.clearRect(0, 0, con.canvas.width, con.canvas.height);
  for(let i = 0; i < coord.length; i++) {
    con.beginPath();
    if (coord[i].DRAG) {
      con.moveTo(coord[i - 1].X, coord[i - 1].Y);
    } else {
      con.moveTo(coord[i].X + 1, coord[i].Y + 1);
    }
    con.lineTo(coord[i].X, coord[i].Y);
    con.closePath();
    con.lineWidth = 3;
    con.strokeStyle = 'rgb(0%, 0%, 0%)';
    con.stroke();
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

can.addEventListener('mousedown', function(e) {
  mouseX = e.pageX - this.offsetLeft;
  mouseY = e.pageY - this.offsetTop;
  paint = true;                     
  addClick(mouseX, mouseY, false); 
  redraw();                       
});

can.addEventListener('mousemove', function(e) {
  mouseX = e.pageX - this.offsetLeft;         
  mouseY = e.pageY - this.offsetTop;
  const cRect = can.getBoundingClientRect();        
  let canvasX = Math.round(e.clientX - cRect.left);
  let canvasY = Math.round(e.clientY - cRect.top);
  canvasX = canvasX - 36
  canvasY = can.height - canvasY - 28
  let x = event.clientX;
  let y = event.clientY;
  coordinates.innerHTML = "(" + canvasX + "px, " + canvasY + "px)";
  coordinates.style.top = y-30 + "px";
  coordinates.style.left = x+40 + "px";

  if (paint) {              
    addClick(mouseX, mouseY, true);
    redraw();
  }
});

can.addEventListener('mouseup' || 'mouseleave', function(e) {
  paint = false;                            
});

calculateAreaButton.addEventListener("click", function(){
  const areaOfBackgroundSquare = 2500;
  resultText = `Valor da área: ${calculateArea(coord)/areaOfBackgroundSquare} cm²`;
  resultTextArea.innerText = resultText;
})

function drawSquare(x, y, sideLength, drag, con) {
  coord.push({ X: x, Y: y, DRAG: drag });
  coord.push({ X: (x+sideLength), Y: y, DRAG: drag });
  coord.push({ X: (x+sideLength), Y: (y+sideLength), DRAG: drag });
  coord.push({ X: x, Y: (y+sideLength), DRAG: drag });
  coord.push({ X: x, Y: y, DRAG: drag });
  con.fillRect(x, y, sideLength, sideLength);
}

drawSquare(634, 322, 100, false, con);


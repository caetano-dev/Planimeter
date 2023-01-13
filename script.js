const calculateAreaButton = document.querySelector('.area');
const newAreaDiv = document.querySelector('.newArea');
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

const showCoordinates = (x, y, canvasX, canvasY) => {
  coordinates.innerHTML = "(" + canvasX + "px, " + canvasY + "px)";
  coordinates.style.top = y-50 + "px";
  coordinates.style.left = x+50 + "px";
}

let startPoint 
let lastPoint 

function redraw(e) {
  mx = e.offsetX;
  my = e.offsetY;

  // draw a new rect from the start position 
  // to the current mouse position
  con.beginPath();
  con.lineWidth = 8;
  con.lineJoin = con.lineCap = 'round';
  con.setLineDash([0, 0]);
  con.globalAlpha = 1.0;


  con.moveTo(startPoint.x, startPoint.y);
  con.lineTo(mx, my);

  con.closePath();
  con.strokeStyle = 'red';
  con.fill();
  con.stroke();
  con.fillStyle = 'rgba(25,50,75,0.5)';
  con.fill();

  for(let i = 0; i < coord.length; i++) {
    con.beginPath();
    if (coord[i].DRAG) {
      con.moveTo(coord[i - 1].X, coord[i - 1].Y);
    } else {
      con.moveTo(coord[i].X + 1, coord[i].Y + 1);
    }
    con.lineTo(coord[i].X, coord[i].Y);
    con.closePath();
    con.lineWidth = 8;
    con.strokeStyle = 'rgb(0%, 0%, 0%)';
    con.fill();
    con.stroke();
  }
}

can.addEventListener('mousedown', function(e) {
  con.clearRect(0, 0, con.canvas.width, con.canvas.height);
  startX = e.clientX - this.offsetLeft;
  startY = e.clientY - this.offsetTop;
  addClick(startX, startY, false); 
  con.beginPath();
  con.moveTo(e.clientX, e.clientY);
  paint = true;                     
  lastPoint = {
    x: e.offsetX,
    y: e.offsetY
  };
  startPoint = lastPoint;
  redraw(e);                       
});

can.addEventListener('mousemove', function(e) {
  mouseX = e.pageX - this.offsetLeft;         
  mouseY = e.pageY - this.offsetTop;
  const cRect = can.getBoundingClientRect();        
  let canvasX = Math.round(e.clientX - cRect.left);
  let canvasY = Math.round(e.clientY - cRect.top);
  canvasX = canvasX - 36
  canvasY = can.height - canvasY - 28
  let x = e.clientX;
  let y = e.clientY;
  showCoordinates(x, y, canvasX, canvasY);

  if (paint) {              
    addClick(mouseX, mouseY, true);
    redraw(e);
  }
});

can.addEventListener('mouseup' || 'mouseleave', function(e) {
  paint = false;                            
  con.lineTo(startPoint.x, startPoint.y);
  con.closePath();
  con.stroke()
  con.fill();

  let imageData = con.getImageData(0, 0, can.width, can.height);
  let data = imageData.data;
  let totalPixels = data.length / 4;
  let pixelsInside = 0;
  let r = 1000;
  let d = 1;

  for (let i = 0; i < totalPixels; i++) {
    let isInside = data[i * 4 + 3] > 0; // check if the pixel is inside the closed shape
    if (isInside) {
      pixelsInside++;
    }
  }
  let theta = (pixelsInside / totalPixels) * 2 * Math.PI;
  let area = (r * theta * Math.PI) / 360 * d;
  console.log("Area of the closed shape:", area);

});


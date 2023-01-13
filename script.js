//a 50px by 50px square returns 0.14123458188532148 of area when r = 1000 and d = 1

const calculateAreaButton = document.querySelector('.area');
const newAreaDiv = document.querySelector('.newArea');
const coordinates = document.querySelector('#coordinates');
const resultTextArea = document.querySelector('#result');
const clearButton = document.querySelector('.clear');
const can = document.querySelector(".canvas-main");
const con = can.getContext('2d');
let coord = [];
let paint = false;
let startPoint 

clearButton.addEventListener('click', function() {
  con.clearRect(0, 0, con.canvas.width, con.canvas.height);
  coord = [];
});

const addClick = (x, y, drag) => {
  coord.push({ X: x, Y: y, DRAG: drag });
}

const showCoordinates = (x, y, canvasX, canvasY) => {
  coordinates.innerHTML = "(" + canvasX + "px, " + canvasY + "px)";
  coordinates.style.top = y-50 + "px";
  coordinates.style.left = x+50 + "px";
}

const redraw = (e) => {
  mx = e.offsetX;
  my = e.offsetY;

  con.lineWidth = 1;
  con.strokeStyle = 'red';
  con.moveTo(startPoint.x, startPoint.y);

  for(let i = 0; i < coord.length; i++) {
    con.lineTo(coord[i].X, coord[i].Y); //mouse path
    con.stroke();
  }
}

const mousePath = (e) => {
  con.strokeStyle = 'green';
  con.moveTo(startPoint.x, startPoint.y);
  for(let i = 0; i < coord.length; i++) {
    con.beginPath();
    if (coord[i].DRAG) {
      con.moveTo(coord[i - 1].X, coord[i - 1].Y);
    } else {
      con.moveTo(coord[i].X + 1, coord[i].Y + 1);
    }
    con.lineTo(coord[i].X, coord[i].Y);
    con.closePath();
    con.stroke();
    con.fill();
  }
}

can.addEventListener('mousedown', function(e) {
  con.beginPath();
  startPoint = {
    x: e.clientX - this.offsetLeft,
    y: e.clientY - this.offsetTop
  }
  addClick(startPoint.x, startPoint.y, false); 
  con.moveTo(e.clientX, e.clientY);
  paint = true;                     
});

can.addEventListener('mousemove', function(e) {
  let mouse = {
    x: e.pageX - this.offsetLeft,
    y: e.pageY - this.offsetTop
  }

  const cRect = can.getBoundingClientRect();        
  let canvasCoordinates = {
    x: Math.round(e.clientX - cRect.left)-36,
    y: can.height - Math.round(e.clientY - cRect.top) - 28
  }

  let x = e.clientX;
  let y = e.clientY;
  showCoordinates(x, y, canvasCoordinates.x, canvasCoordinates.y);

  if (paint) {              
    mousePath(e);
    addClick(mouse.x, mouse.y, true);
  }
});

can.addEventListener('mouseup' || 'mouseleave', function(e) {
  con.clearRect(0, 0, con.canvas.width, con.canvas.height);
  redraw(e);
  paint = false;                            
  con.lineTo(startPoint.x, startPoint.y);
  con.closePath();
  con.stroke()
  con.fill();

  let imageData = con.getImageData(0, 0, can.width, can.height);
  let data = imageData.data;
  let totalPixels = data.length / 4;
  let pixelsInside = 0;
  const r = 1000;
  const d = 1;

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


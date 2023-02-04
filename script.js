const coordinates = document.querySelector('#coordinates');
const resultTextArea = document.querySelector('#result');
const clearButton = document.querySelector('.clear');
const can = document.querySelector(".canvas-main");
const con = can.getContext('2d');
let coord = [];
let paint = false;

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
  for(let i = 0; i < coord.length; i++) {
    con.lineTo(coord[i].X, coord[i].Y); //mouse path
    con.stroke();
  }
}

const mousePath = (e) => {
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
can.addEventListener("mousemove", function (e) {
  let mouse = {
    x: e.pageX - this.offsetLeft,
    y: e.pageY - this.offsetTop,
  };
  const cRect = can.getBoundingClientRect();
  let canvasCoordinates = {
    x: Math.round(e.clientX - cRect.left) - 36,
    y: can.height - Math.round(e.clientY - cRect.top) - 28,
  };

  let x = e.clientX;
  let y = e.clientY;
  showCoordinates(x, y, canvasCoordinates.x, canvasCoordinates.y);

  if (paint) {
    mousePath(e);
    addClick(mouse.x, mouse.y, true);
  }
});

function calculateArea(coord) {
  let sum = 0;
  for (let i = 0; i < coord.length - 1; i++) {
    sum += ((coord[i + 1].X - coord[i].X) * (coord[i + 1].Y + coord[i].Y)) / 2;
  }
  return sum;
}

can.addEventListener("mouseup" || "mouseleave", function (e) {
  con.clearRect(0, 0, con.canvas.width, con.canvas.height);
  redraw(e);
  paint = false;
  con.closePath();
  con.stroke();
  con.fill();
  area = (-calculateArea(coord)/2500);
  resultTextArea.innerText = area
});


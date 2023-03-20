# Planimeter

This is the code for a JavaScript implementation of a planimeter, which allows the user to draw an area on canvas and calculate its area in square centimeters.

## Variables

The following variables are declared and used globally. These are buttons, containers, vectors, and other HTML elements.

```js
const coordinates = document.querySelector("#coordinates"); 
const resultTextArea = document.querySelector("#result");
const clearButton = document.querySelector(".clear");
const can = document.querySelector(".canvas-main");
const con = can.getContext("2d");
let coord = [];
let paint = false;
```
## Functions

Functions allow you to write code once and use it many times, which makes the code more modular and easier to maintain.

Functions, as in mathematics, usually take one or more inputs (also called arguments or parameters) and can return an output (also called a return value). The input is passed to the function when it is called, and the function performs its task using the input. The output is the result of the function's task.

In JavaScript, we can denote a function by `function nameFunction(parameters)` or `const nameFunction = (parameters)`.

The `addClick(x,y,drag)` function has the task of adding all the mouse coordinates into a vector, as well as the value `DRAG`, which can be true or false.

```js
const addClick = (x, y, drag) => {
  coord.push({ X: x, Y: y, DRAG: drag })
};
```

``redraw()` will clear the screen and loop through the array of coordinates, drawing mini-lines between each pair of coordinates to represent what the user is drawing.

```js
const redraw = (e) => {
  mx = e.offsetX;
  my = e.offsetY;
  con.lineWidth = 1;
  for (let i = 0; i < coord.length; i++) {
    con.lineTo(coord[i].X, coord[i].Y);
    con.stroke();
  }
};
```
The `calculateArea()` function is an implementation of the Gauss Formula. The formula works by treating the area as a sequence of vectors, which can be represented as line segments connecting vertices.

- The first step is to initialize a variable sum to zero. This variable will be used to accumulate the sum of the areas of the individual vectors.

- Next, the function loops over all vertices of the coordination parameter, which is a set of objects representing the X and Y coordinates of each vertex.

- For each iteration, the function calculates the area of a vector by multiplying the difference between the X coordinates of the two vertices with the sum of their Y coordinates and dividing the result by 2. The formula for the area of a vector represented by two points (x1, y1) and (x2, y2) is ((x2 - x1) * (y2 + y1)) / 2.

Finally, the function returns the sum value, which is the sum of the areas of all the individual vectors and represents the total area of the figure.

```js
function calculateArea(coord) {
  let sum = 0;
  for (let i = 0; i < coord.length - 1; i++) {
    sum += ((coord[i + 1].X - coord[i].X) * (coord[i + 1].Y + coord[i].Y)) / 2;
  }
  return sum;
}
```

Below are declared functions that have the role of drawing figures that are already finished. We use them to verify that the calculations are correct.

```js
function drawShape(points, drawFn, drag, con) {
  coord.push(...points.map(p => ({ X: p.x, Y: p.y, DRAG: drag })));
  drawFn(points, con);
}

function drawSquare(points, con) {
  con.fillRect(points[0].x, points[0].y, points[2].x - points[0].x, points[2].y - points[0].y);
}

function drawTriangle(points, con) {
  con.beginPath();
  con.moveTo(points[0].x, points[0].y);
  con.lineTo(points[1].x, points[1].y);
  con.lineTo(points[2].x, points[2].y);
  con.fill();
}
```

## Event listeners

Event listeners are used to determine what the code should do when an action is performed by the user, such as clicking, dragging the mouse or even releasing the button.

We add an `event listener` to the clear screen button. When this is triggered, we remove all coordinates from our array and clear the frame.

```js
clearButton.addEventListener("click", function () {
  con.clearRect(0, 0, con.canvas.width, con.canvas.height);
  coord = [];
});

```
Here, we add `event listeners` to the canvas. When the user clicks on it, we take the mouse coordinates and add their drawing to the canvas. We use the variables `canvas.x` and `canvas.y` to map the pixels and display them to the user.

While the mouse is on the screen with the button pressed, the user can paint.

```js
can.addEventListener("mousedown", function (e) {
  con.beginPath();
  startPoint = {
    x: e.clientX - this.offsetLeft,
    y: e.clientY - this.offsetTop,
  };
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

```

Here, we wait for the user to finish drawing the area and take the mouse off the screen so we can fill the shape.


```js
can.addEventListener("mouseup" || "mouseleave", function (e) {
  con.clearRect(0, 0, con.canvas.width, con.canvas.height);
  redraw(e);
  paint = false;
  con.closePath();
  con.stroke();
  con.fill();
});
```
When the calculate area button is called, we use the`calculateArea()` function and display its result on the screen.  

```js
calculateAreaButton.addEventListener("click", function (e) {
  area = calculateArea(coord) / 2500;
  resultTextArea.innerText = area+" cm²";
});
```

Buttons used to call the functions that draw the triangle and square are triggered when the user clicks on them.

```js
squareButton.addEventListener("click", function (e) {
  drawShape(
    [
      { x: 634, y: 322 },
      { x: 634, y: 422 },
      { x: 734, y: 422 },
      { x: 734, y: 322 },
      { x: 634, y: 322 },
    ],
    drawSquare,
    false,
    con
  );
});

triangleButton.addEventListener("click", function (e) {
  drawShape(
    [
      { x: 934, y: 392 },
      { x: 450, y: 100 },
      { x: 540, y: 490 },
    ],
    drawTriangle,
    true,
    con
  );
});
```

# Planímetro

Este é o código para a implementação de um planímetro em JavaScript, que permite ao usuário desenhar uma área no canvas e calcular sua área em centímetros quadrados.

## Variáveis

As seguintes variáveis são declaradas e utilizadas globalmente. Se tratam de botões, containers, vetores e outros elementos do HTML.

```js
const coordinates = document.querySelector("#coordinates"); 
const resultTextArea = document.querySelector("#result");
const clearButton = document.querySelector(".clear");
const can = document.querySelector(".canvas-main");
const con = can.getContext("2d");
let coord = [];
let paint = false;
```

## Event listeners

Event listeners são usados para determinar o que o código deve fazer quando uma ação é realizada pelo usuário, como clicks, arrastar o mouse ou até mesmo soltar o botão.

Adicionamos um `event listener` no botão de limpar a tela. Quando este é acionado, removemos todas as coordenadas do nosso vetor e limpamos o quadro.

```js
clearButton.addEventListener("click", function () {
  con.clearRect(0, 0, con.canvas.width, con.canvas.height);
  coord = [];
});

```

Aqui, adicionamos `event listeners` no canvas. Quando o usuário clica no mesmo, pegamos as coordenadas do mouse e adicionamos na tela seu desenho. Usamos as variáveis `canvas.x` e `canvas.y` para mapear os pixels e mostra-los ao usuário.

Enquanto o mouse se encontra na tela com o botão pressinado, o usuário pode pintar.

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

Aqui, quando o usuário acaba de desenhar a área e tira o mouse da tela, calculamos a sua área. Vamos ver como `calculateArea()` funciona em mais detalhes no tópico de funções.

```js
can.addEventListener("mouseup" || "mouseleave", function (e) {
  con.clearRect(0, 0, con.canvas.width, con.canvas.height);
  redraw(e);
  paint = false;
  con.closePath();
  con.stroke();
  con.fill();
  area = calculateArea(coord) / 2500;
  resultTextArea.innerText = area;
});
```

## Funções

Funções permitem escrever o código uma vez e usá-lo várias vezes, o que torna o código mais modular e fácil de manter.

As funções, assim como na matemática, normalmente aceitam uma ou mais entradas (também chamadas de argumentos ou parâmetros) e podem retornar uma saída (também chamada de valor de retorno). A entrada é passada para a função quando ela é chamada, e a função executa sua tarefa usando a entrada. A saída é o resultado da tarefa da função.

Em Javascript, podemos denotar uma função por `function nomeDaFunção(parâmetros)` ou `const nomeDaFunção = (parâmetros)`.

A função `addClick(x,y,drag)` tem a tarefa de adicionar todas as coordenadas do mouse em um vetor, assim como o valor `DRAG`, que pode ser verdadeiro ou falso.

```js
const addClick = (x, y, drag) => {
  coord.push({ X: x, Y: y, DRAG: drag });
};
```

`redraw()` limpará a tela e fará um loop pelo array de coordenadas, desenhando mini-linhas entre cada par de coordenadas para representar o que o usuário está desenhando.

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
A função `calculateArea()` é uma implementação da Fórmula de Gauss. A fórmula funciona tratando a área como uma sequência de vetores, que pode ser representada como segmentos de linha conectando os vértices.

- O primeiro passo é inicializar uma soma variável a zero. Esta variável será usada para acumular a soma das áreas dos vetores individuais.

- Em seguida, a função faz loops sobre todos os vértices do parâmetro de coordenação, que é um conjunto de objetos representando as coordenadas X e Y de cada vértice.

- Para cada iteração, a função calcula a área de um vetor multiplicando a diferença entre as coordenadas X dos dois vértices com a soma de suas coordenadas Y e dividindo o resultado por 2. A fórmula para a área de um vetor representada por dois pontos (x1, y1) e (x2, y2) é ((x2 - x1) * (y2 + y1)) / 2.

Finalmente, a função retorna o valor da soma, que é a soma das áreas de todos os vetores individuais e representa a área total da figura.

```js
function calculateArea(coord) {
  let sum = 0;
  for (let i = 0; i < coord.length - 1; i++) {
    sum += ((coord[i + 1].X - coord[i].X) * (coord[i + 1].Y + coord[i].Y)) / 2;
  }
  return sum;
}
```
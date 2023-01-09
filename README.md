# Planímetro

A seguir, segue o código fonte utilizado para a criação do planímetro, acompanhado de explicações acerca de seu funcionamento.


### Declaração de variáveis.

Começamos o código declarando nossas variáveis que serão utilizadas globalmente, como botões, containers e outros elementos do HTML.

```js
const calculateAreaButton = document.querySelector('.area');
const coordinates = document.querySelector('#coordinates');
const resultTextArea = document.querySelector('#result');
const clearButton = document.querySelector('.clear');
const can = document.querySelector(".canvas-main");
const con = can.getContext('2d');
let mouseX, mouseY;
let paint = false;
let coord = [];
```

### Event listeners

Event listeners são usados para determinar o que o código deve fazer quando uma ação é realizada pelo usuário, como clicks, arrastar o mouse ou até mesmo soltar o botão.

Adicionamos um `event listener` on botão de limpar a tela. Quando este é acionado, removemos todas as coordenadas do nosso vetor e limpamos o quadro.

```js
clearButton.addEventListener('click', function() {
  con.clearRect(0, 0, con.canvas.width, con.canvas.height);
  coord = [];
});

```

Aqui, adicionamos `event listeners` no canvas. Quando o usuário clica no mesmo, pegamos as coordenadas do mouse e adicionamos na tela seu desenho. Usamos as variáveis `canvasX` e `canvasY` para mapear os pixels e mostra-los ao usuário.

Enquanto o mouse se encontra na tela com o botão pressinado, o usuário pode pintar.

```js
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
```

Este é o botão usado para calcular a área e mostrar seu valor na tela. Explicaremos como `calculateArea()` funciona no tópico de funções.

```js
calculateAreaButton.addEventListener("click", function(){
  const areaOfBackgroundSquare = 2500;
  resultText = `Valor da área: ${calculateArea(coord)/areaOfBackgroundSquare} cm²`;
  resultTextArea.innerText = resultText;
})
```

### Funções

Funções permitem escrever o código uma vez e usá-lo várias vezes, o que torna o código mais modular e fácil de manter.

As funções, assim como na matemática, normalmente aceitam uma ou mais entradas (também chamadas de argumentos ou parâmetros) e podem retornar uma saída (também chamada de valor de retorno). A entrada é passada para a função quando ela é chamada, e a função executa sua tarefa usando a entrada. A saída é o resultado da tarefa da função.

A função `addClick(x,y,drag)` tem a tarefa de adicionar todas as coordenadas do mouse em um vetor, assim como o valor  `DRAG`, que pode ser verdadeiro ou falso.

```js
function addClick(x, y, drag) {
  coord.push({ X: x, Y: y, DRAG: drag });
}
```

`redraw()` limpará a tela e fará um loop pelo array de coordenadas, desenhando mini-linhas entre cada par de coordenadas para representar o que o usuário está desenhando.

```js
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
```
A função `calculateArea()` calcula a área da forma desenhada dividindo a área do desenho formado pelos pontos em coordenação com a área do quadrado que serve de fundo para a tela. A área do polígono é calculada usando a [Fórmula da área de Gauss](https://en.wikipedia.org//wiki/Shoelace_formula), que afirma que a área de um polígono pode ser determinada tratando o polígono como um conjunto de segmentos de linha, calculando a soma dos produtos das coordenadas x e y dos pontos finais de cada segmento de linha e, em seguida, dividindo o resultado por 2.

```js
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

```

`drawSquare()` é usada para desenhar perfeitamente um quadrado no centro da tela quando o programa é iniciado. Através dela, podemos comprovar que os cálculos realizados pelo programa estão corretos ao usar a função `calculateArea()`.

```js
function drawSquare(x, y, sideLength, drag, con) {
  coord.push({ X: x, Y: y, DRAG: drag });
  coord.push({ X: (x+sideLength), Y: y, DRAG: drag });
  coord.push({ X: (x+sideLength), Y: (y+sideLength), DRAG: drag });
  coord.push({ X: x, Y: (y+sideLength), DRAG: drag });
  coord.push({ X: x, Y: y, DRAG: drag });
  con.fillRect(x, y, sideLength, sideLength);
}
//utilização da função
drawSquare(634, 322, 100, false, con);
```

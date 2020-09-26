{
const canvas = document.getElementById("canvas2");
const ctx = canvas.getContext("2d");

//Now we create an object to hold the reference points
const universe = {
  x0: 0,
  y0: 0,
  x1: canvas.width,
  y1: canvas.height,
  h: canvas.height,
  w: canvas.width,
};

universe.updatePoints = function(){
  const origin = invertCoordinates(0, 0);
  const rightBottomCorner = invertCoordinates(canvas.width, canvas.height);
  universe.x0 = origin[0];
  universe.y0 = origin[1];
  universe.x1 = rightBottomCorner[0];
  universe.y1 = rightBottomCorner[1];
  universe.h = universe.y1-universe.y0;
  universe.w = universe.x1-universe.x0;
};

function invertCoordinates(x, y){
  const t = ctx.getTransform(); //transform
  const M = t.a*t.d-t.b*t.c;//Factor that shows up a lot
  const xnew = (x*t.d-y*t.c+t.c*t.f-t.d*t.e)/M;
  const ynew = (x*t.b+y*t.a+t.b*t.e-t.a*t.f)/M;
  return [xnew, ynew];
};


function drawGrid(){
  const dw = 50;
  const ncols = Math.ceil(universe.w/dw);
  const nrows = Math.ceil(universe.h/dw);
  const w = ncols*dw;
  const h = nrows*dw;

  //Improving visibility
  ctx.strokeStyle = "gray";
  ctx.lineWidth = 1;

  //Translation to give effect of dragging
  ctx.translate(0, Math.floor(universe.y0/dw)*dw);

  //Now we make the rows
  for (let i=0; i<=nrows; i++){
    ctx.beginPath();
    ctx.moveTo(universe.x0, i*dw);
    ctx.lineTo(universe.x1, i*dw);
    ctx.closePath();
    ctx.stroke();
  };

  //Then we undo the previous transformation and apply the next
  ctx.translate(Math.floor(universe.x0/dw)*dw, -Math.floor(universe.y0/dw)*dw);

  //Now we make the columns
  for (let i=0; i<=ncols; i++){
    ctx.beginPath();
    ctx.moveTo(i*dw, universe.y0);
    ctx.lineTo(i*dw, universe.y1);
    ctx.closePath();
    ctx.stroke();
  };

  //Translate canvas back!!!!
  ctx.translate(-Math.floor(universe.x0/dw)*dw, 0);
};

//Lets get the slider
const zoomSlider = document.getElementById("zoomSlider2");
const label = document.getElementById("zoomSliderLabel2");
const transLabel = document.getElementById("transSliderLabel2");
const transSlider = document.getElementById("transSlider2");
zoomSlider.oninput = transSlider.oninput = function(){
  ctx.resetTransform();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let scale = Number(zoomSlider.value);
  let dx = Number(transSlider.value);
  //Note that ctx comes from the scope of lesson.js
  ctx.setTransform(scale, 0, 0, scale, dx,dx);
  universe.updatePoints();
  drawGrid();
  label.innerHTML = scale;
  transLabel.innerHTML = dx;
};


//We transform the canvas
let scale = 1;
ctx.setTransform(scale, 0, 0, scale,0, 0);

//We update the reference points
universe.updatePoints();

//We draw the grid
drawGrid();
};

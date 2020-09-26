{
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

function invertCoordinates(x, y){
  const t = ctx.getTransform(); //transform
  const M = t.a*t.d-t.b*t.c;//Factor that shows a lot
  const xnew = (x*t.d-y*t.c+t.c*t.f-t.d*t.e)/M;
  const ynew = (x*t.b+y*t.a+t.b*t.e-t.a*t.f)/M;
  return [xnew, ynew];
};

//To facillitate visualization we make a function to draw
//an object in the same location relative to original origin.
function drawReferece(){
  ctx.fillStyle = 'cornflowerblue';
  ctx.fillRect(50,50, 50, 50);
};
drawReferece();

//First we create the functions that will act on the canvas
function mousePressed(e){
  //Set required tags and save required values
  canvas.isPressed = true;
  canvas.clickedCoords = invertCoordinates(e.offsetX, e.offsetY);
  canvas.initTransform = ctx.getTransform();

  //Draw reference
  drawReferece();
};

function mouseDragged(e){
  if (!canvas.isPressed){return;};

  //Clear the canvas
  ctx.resetTransform();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(canvas.initTransform);

  //Get the displacement
  const newCoords = invertCoordinates(e.offsetX, e.offsetY);
  const dx = newCoords[0] - canvas.clickedCoords[0];
  const dy = newCoords[1] - canvas.clickedCoords[1];

  //Apply new view
  ctx.translate(dx, dy);

  //Resume drawing our reference
  drawReferece();
};

function mouseReleased(){
  canvas.isPressed = false;
  canvas.initTransform = ctx.getTransform();
  ctx.resetTransform();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(canvas.initTransform);
  drawReferece();
};

canvas.addEventListener("mousedown", mousePressed);
canvas.addEventListener("mousemove", mouseDragged);
canvas.addEventListener("mouseup", mouseReleased);
};

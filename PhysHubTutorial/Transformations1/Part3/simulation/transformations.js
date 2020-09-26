//Here we make the canvas and all the functions that use it!
//We also make the universe object which helps with transform management
//First we create the canvas and the function for the grid.
//Here we also make the

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

//Lets define a function to clear the canvas
function clearCanvas(){
  const transform = ctx.getTransform();
  ctx.resetTransform();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(transform);
};

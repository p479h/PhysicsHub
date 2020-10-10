const canvas = document.getElementById("canvas");
const offCanvas = document.getElementById("offCanvas");
const ctx = canvas.getContext("2d");
const offCtx = offCanvas.getContext("2d");

const universe = {
  x0: 0,
  y0: 0,
  x1: canvas.width,
  y1: canvas.height,
  h: canvas.height,
  w: canvas.width,
  scale: 1,
};

//Updated universe after a transformation has been applied to the canvas
universe.updatePoints = function(){
  const origin = invertCoordinates(0, 0);
  const rightBottomCorner = invertCoordinates(canvas.width, canvas.height);
  universe.x0 = Math.floor(origin[0]);//Integers are more efficient
  universe.y0 = Math.floor(origin[1]);
  universe.x1 = Math.floor(rightBottomCorner[0]);
  universe.y1 = Math.floor(rightBottomCorner[1]);
  universe.h = universe.y1-universe.y0;
  universe.w = universe.x1-universe.x0;
};

//Gives the coordinates of x,y with inverse transform to the canvas transform
function invertCoordinates(x, y){
  const t = ctx.getTransform(); //transform
  const M = t.a*t.d-t.b*t.c;//Factor that shows up a lot
  const xnew = (x*t.d-y*t.c+t.c*t.f-t.d*t.e)/M;
  const ynew = (x*t.b+y*t.a+t.b*t.e-t.a*t.f)/M;
  return [xnew, ynew];
};

//Changes canvas dimensions and transform to improve image quality
function improveImage(scale=2){
  //Improve resolution
  canvas.width*=scale;
  canvas.height*=scale;
  ctx.scale(scale, scale);
  universe.scale*=scale;
  universe.updatePoints();
};

//Lets define a function to clear the canvas
function clearCanvas(){
  const transform = ctx.getTransform();
  ctx.resetTransform();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(transform);
};

function clearOffCanvas(){
  const t = offCtx.getTransform();
  offCtx.resetTransform();
  offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
  offCtx.setTransform(t);
};

function setTransform(x0, x1){
  const kx = canvas.width/(x1 - x0);
  const dx = -x0*kx;
  //canvas.setTransform(kx, 0, 0, 1, dx, 0);
  offCtx.setTransform(kx, 0, 0, 1, dx, 0);
};

function translate(xtrans){
  let t = offCtx.getTransform();
  ctx.translate(xtrans*t.a, 0);
  let t2 = ctx.getTransform();
  if (t2.e > 0){
    //alert("Hit left side of offScreenCanvas");
    handleLeftSideLimit();
  } else if (t2.e + offCanvas.width < canvas.width){
    //alert("Hit right side of OffScreenCanvas");
    handleRightSideLimit();
  };
};

function handleLeftSideLimit(){
  clearOffCanvas();
  const t = offCtx.getTransform();
  offCtx.resetTransform();
  offCtx.drawImage(canvas, offCanvas.width - canvas.width, 0);
  offCtx.setTransform(t);
  ctx.resetTransform();
};

function handleRightSideLimit(){
  clearOffCanvas();
  const t = offCtx.getTransform();
  offCtx.resetTransform();
  offCtx.drawImage(canvas, 0, 0);
  offCtx.setTransform(t);
  offCtx.translate(-canvas.width/t.a, 0);
  ctx.resetTransform();
};
setTransform(0, canvas.width);
offCtx.lineWidth = 3;
offCtx.moveTo(10, 100);
offCtx.strokeStyle = "white";
offCtx.beginPath();
const data = [];
for (let i =0; i<1000; i++){
  data.push([i, Math.sin(i/10)*100+100]);
};
for (let i =0; i<1000; i++){
  offCtx.lineTo(...data[i]);
};
offCtx.stroke();

let i = 1;
offCtx.lineWidth = 3;
ctx.fillStyle = "cornflowerblue";
ctx.strokeStyle = ctx.strokeStyle;
resizeYImage(1000);
setInterval(
  ()=>{
    translate(-1);
    // offCtx.beginPath();
    // // offCtx.moveTo(i+198, Math.sin((i-2)/10)*50+100);
    // if (i%2 == 0){
    //   offCtx.lineTo(i+198, Math.sin((i-2)/10)*50+100);
    //   offCtx.lineTo(i+199, Math.sin((i-1)/10)*50+100);
    //   offCtx.lineTo(i+200, Math.sin(i/10)*50+100);
    //   offCtx.stroke();
    // };
    // i++;
    clearCanvas();
    ctx.drawImage(offCanvas, 0, 0);
  }, 10
)

ctx.drawImage(offCanvas, 0, 0);

function canvasClicked(e){
  translate(-50);
  clearCanvas();
  ctx.drawImage(offCanvas, 0, 0);
};

function resizeYImage(newLim){
  const transform = offCtx.getTransform();
  const oldScale = transform.d;
  const oldLim = offCanvas.height * oldScale;
  const scaleFactor = newLim/oldLim;
  const currentImage = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
  const newHeight = canvas.height/scaleFactor;
  clearOffCanvas();
  offCtx.putImageData(currentImage, 0, offCanvas.height-newHeight);
  offCtx.scale(1, scaleFactor);
};

canvas.onclick = canvasClicked;

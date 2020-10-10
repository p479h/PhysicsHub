
{
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.id = "plottingCanvas";
  canvas.style = "height: 300px; width: 500px; border: 2px solid white; background: black; display: inline-block; transition-duration: .5s; position: absolute; z-index:-1; margin: 0;";
  canvas.width = 500;
  canvas.height = 300;
};

const plottingCanvas = document.getElementById("plottingCanvas");
const plottingCtx = plottingCanvas.getContext("2d", {alpha: false});//alpha false optimizes
let parent = canvas.parentElement;
plottingCanvas.parentElement = parent;
parent.appendChild(plottingCanvas);

function setLims(x0, x1, y0, y1){
  //Does not work with enhanced image!!!
  const kx = plottingCanvas.width/(x1-x0);
  const ky = plottingCanvas.height/(y1-y0);
  const dx = -x0*kx;
  const dy = y0*ky;
  plottingCtx.setTransform(kx, 0, 0, -ky, dx, dy+plottingCanvas.height);
};

//Now lets create a function just like invertCoordinates. But it does the transformation
function transformCoords(transform, x, y){
  let xArray = [];
  let yArray = [];
  for (var i =0; i<x.length; i++){
    xArray.push(x[i]*transform.a+transform.e);
    yArray.push(y[i]*transform.d+transform.f);
  };
  return [xArray, yArray];
};

function plotPoints(x, y){
  //PLOTS LINE
  let trans = plottingCtx.getTransform();
  let points = transformCoords(trans, x, y);
  plottingCtx.resetTransform();
  let x_ = points[0];
  let y_ = points[1];
  plottingCtx.moveTo(x_[0], y_[0]);
  plottingCtx.beginPath();
  plottingCtx.lineWidth = 3;
  for (var i=1; i<x.length; i++){
    plottingCtx.lineTo(x_[i], y_[i]);
  };
  plottingCtx.stroke();
  plottingCtx.setTransform(trans);
};


function drawPlottingGrid(sideLen=.2, canvas=plottingCanvas, ctx=plottingCtx){
  const dw = sideLen*50;
  const dh = sideLen;
  const transform = ctx.getTransform();
  const ncols = Math.ceil(canvas.width/transform.a/dw);
  const nrows = Math.ceil(-canvas.height/transform.d/dh);
  const w = ncols*dw;
  const h = nrows*dh;

  //Improving visibility
  ctx.strokeStyle = "gray";
  ctx.lineWidth = 1;

  const leftTopCorner = invertCoordinates(0, 0, ctx);
  const x0 = leftTopCorner[0];
  const y0 = leftTopCorner[1];
  const rightBottomCorner = invertCoordinates(canvas.width, canvas.height, ctx);
  const x1 = rightBottomCorner[0];
  const y1 = rightBottomCorner[1];

  //Making the rows translatabble
  ctx.translate(0, Math.floor(y0/dw)*dh);

  //Now we make the rows
  for (var i=0; i<=nrows; i++){
    ctx.moveTo(x0, i*dh);
    ctx.lineTo(x1, i*dh);
  };

  //Then we undo the previous transformation and apply the next
  ctx.translate(Math.floor(x0/dw)*dw, -Math.floor(y0/dw)*dh);

  //Now we make the columns
  for (var i=0; i<=ncols; i++){
    ctx.moveTo(i*dw, y0);
    ctx.lineTo(i*dw, y1);
  };
  ctx.save();
  ctx.resetTransform();
  ctx.stroke();
  ctx.restore();

  //Translate canvas back!!!!
  ctx.translate(-Math.floor(x0/dw)*dw, 0);
  ctx.restore();
};

function clearPlottingCanvas(){
  const t = plottingCtx.getTransform();
  plottingCtx.resetTransform();
  plottingCtx.clearRect(0, 0, plottingCanvas.width, plottingCanvas.height);
  plottingCtx.setTransform(t);
};

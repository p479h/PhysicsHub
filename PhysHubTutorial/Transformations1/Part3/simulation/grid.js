//This function requires the file transformations.js

function drawGrid(sideLen=50){
  const dw = sideLen;
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

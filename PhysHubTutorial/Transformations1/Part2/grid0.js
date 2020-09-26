{
const canvas = document.getElementById("canvas0");
const ctx = canvas.getContext("2d");

//The following transformation is just used for better visualization
let w = canvas.width;
let h = canvas.height;
let scale = .8;
ctx.setTransform(scale, 0, 0, scale, (w/scale-w)/3, (h/scale-h)/3);

function drawGrid(){
  const dw = 52;
  const ncols = Math.ceil(canvas.width/dw);
  const nrows = Math.ceil(canvas.height/dw);
  const w = ncols*dw;
  const h = nrows*dw;

  //Improving visibility
  ctx.strokeStyle = "gray";
  ctx.lineWidth = 1;

  //Now we make the rows
  for (let i=0; i<=nrows; i++){
    ctx.beginPath();
    ctx.moveTo(0, i*dw);
    ctx.lineTo(w, i*dw);
    ctx.closePath();
    ctx.stroke();
  };

  //Now we make the columns
  for (let i=0; i<=ncols; i++){
    ctx.beginPath();
    ctx.moveTo(i*dw, 0);
    ctx.lineTo(i*dw, h);
    ctx.closePath();
    ctx.stroke();
  };
};

drawGrid();
};

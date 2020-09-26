//This file is where we make use of ALL the functions
//It depends on transformations.js, body.js, grid.js and mouseEvents.js


//Lets make some bodies
for (let i=0; i<5; i++){
  let b = new body(i*30, i*30, 1, i, 20);
  b.m = i*.2+1;
};

//Lets draw the grid
drawGrid();

//Lets make a loop of events
let interval = setInterval(
  ()=>{
    clearCanvas();
    drawGrid();
    body.prototype.evolve();
  },10
);

//Lets attach some mouseEvents to the canvas
function mousePressed(e){
  canvasPressed(e);
};

function mouseDragged(e){
  canvasDragged(e);
};

function mouseReleased(e){
  canvasReleased(e);
};

canvas.addEventListener("mousedown", mousePressed);
canvas.addEventListener("mousemove", mouseDragged);
canvas.addEventListener("mouseup", mouseReleased);

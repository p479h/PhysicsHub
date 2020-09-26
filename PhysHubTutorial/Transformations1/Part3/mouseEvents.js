{
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//First we create the functions that will act on the canvas
function mousePressed(e){
  canvas.isPressed = true;
  ctx.fillStyle = 'cornflowerblue';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

function mouseDragged(e){
  if (!canvas.isPressed){return;};
  ctx.fillStyle = "tomato";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

function mouseReleased(){
  canvas.isPressed = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

canvas.addEventListener("mousedown", mousePressed);
canvas.addEventListener("mousemove", mouseDragged);
canvas.addEventListener("mouseup", mouseReleased);
};

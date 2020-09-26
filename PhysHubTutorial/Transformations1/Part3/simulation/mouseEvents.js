//This file depends on transformations.js

function canvasPressed(e){
  //Set required tags and save required values
  canvas.isPressed = true;
  canvas.clickedCoords = invertCoordinates(e.offsetX, e.offsetY);
  canvas.initTransform = ctx.getTransform();
};

function canvasDragged(e){
  if (!canvas.isPressed){return;};

  //Update the reference coordinates in universe
  universe.updatePoints();

  //Get the displacement
  const newCoords = invertCoordinates(e.offsetX, e.offsetY);
  const dx = newCoords[0] - canvas.clickedCoords[0];
  const dy = newCoords[1] - canvas.clickedCoords[1];

  //Apply new view
  ctx.translate(dx, dy);
};

function canvasReleased(){
  canvas.isPressed = false;
};


// canvas.addEventListener("mousedown", mousePressed);
// canvas.addEventListener("mousemove", mouseDragged);
// canvas.addEventListener("mouseup", mouseReleased);

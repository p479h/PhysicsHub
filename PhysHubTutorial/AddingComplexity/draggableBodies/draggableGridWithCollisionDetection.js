/*
Author: p479h
*/

//First we take the canvas from the document.
if (document.getElementsByTagName("canvas").length>0){
  const canvas = document.getElementsByTagName("canvas")[0];
  canvas.id = "canvas";
} else {
  //If there are no canvas in the document, we make one.
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.id = "canvas";
  canvas.style = "height: 300px;width: 500px;border: 1px solid black;background: black;display: block;";
  canvas.width = 500;
  canvas.height = 300;
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", {alpha: false});//alpha false optimizes
let running = true;//So we can pause the simulation
let damping = 1;


//Now we modify the canvas to simulate a p5 canvas
canvas.elt = canvas;


//Now we create an object to hold the reference points
//These are used for actions that depend on the transfomed corners of the canvas
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
  const origin = invertCoordinates(0, 0, ctx);
  const rightBottomCorner = invertCoordinates(canvas.width, canvas.height, ctx);
  universe.x0 = Math.floor(origin[0]);//Integers are more efficient
  universe.y0 = Math.floor(origin[1]);
  universe.x1 = Math.floor(rightBottomCorner[0]);
  universe.y1 = Math.floor(rightBottomCorner[1]);
  universe.h = universe.y1-universe.y0;
  universe.w = universe.x1-universe.x0;
};

//Gives the coordinates of x,y with inverse transform to the canvas transform
function invertCoordinates(x, y, ctx){
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


//Changes canvas dimensions and transform to improve image quality
function improveImage(scale=2){
  //Improve resolution
  canvas.width*=scale;
  canvas.height*=scale;
  ctx.scale(scale, scale);
  universe.scale*=scale;
  universe.updatePoints();
};


//Now we make the function for the grid
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
  for (var i=0; i<=nrows; i++){
    ctx.moveTo(universe.x0, i*dw);
    ctx.lineTo(universe.x1, i*dw);
  };

  //Then we undo the previous transformation and apply the next
  ctx.translate(Math.floor(universe.x0/dw)*dw, -Math.floor(universe.y0/dw)*dw);

  //Now we make the columns
  for (var i=0; i<=ncols; i++){
    ctx.moveTo(i*dw, universe.y0);
    ctx.lineTo(i*dw, universe.y1);
  };
  ctx.stroke();

  //Translate canvas back!!!!
  ctx.translate(-Math.floor(universe.x0/dw)*dw, 0);


  //Draw the frame!!!
  universe.updatePoints();
  ctx.strokeStyle = "white";
  ctx.lineWidth = 6/ctx.getTransform().a;
  ctx.beginPath();
  ctx.moveTo(universe.x0, universe.y0);
  ctx.lineTo(universe.x0, universe.y0+universe.h);
  ctx.lineTo(universe.x0+universe.w, universe.y0+universe.h);
  ctx.lineTo(universe.x0+universe.w, universe.y0);
  ctx.closePath();
  ctx.stroke();
};

//Canvas functions must not take action when the cursor lies outside the canvas
canvasMouseIn = function(){
  canvas.isMouseOver = true;

  //The document can no longer be scrolled
  document.body.style.overflow = "hidden";

  //Nice cursor
  canvas.style.cursor = "grab";
};

//Canvas functions must not take action when the cursor lies outside the canvas
canvasMouseOut = function(){
  canvas.isMouseOver = false;
  document.body.style.overflow = "auto";
};


//Now the functons involving canvas interactivity
function canvasPressed(e){
  //Set required tags and save required values
  if (!canvas.isMouseOver){return;};
  canvas.isPressed = true;
  canvas.clickedCoords = invertCoordinates(e.offsetX*universe.scale, e.offsetY*universe.scale, ctx);
  canvas.initTransform = ctx.getTransform();
  canvas.style.cursor = "grabbing";
};


//Function that changes canvas attributes upon mouse drag
function canvasDragged(e){
  if (!canvas.isPressed || !canvas.isMouseOver){return;};

  //Update the reference coordinates in universe
  universe.updatePoints();

  //Get the displacement
  const newCoords = invertCoordinates(e.offsetX*universe.scale, e.offsetY*universe.scale, ctx);
  const dx = newCoords[0] - canvas.clickedCoords[0];
  const dy = newCoords[1] - canvas.clickedCoords[1];

  //Apply new view
  ctx.translate(dx, dy);
};

//Handles mouse release actions that affect the canvas
function canvasReleased(){
  canvas.isPressed = false;
  canvas.style.cursor = "grab";
};


//Zoomming in and out
function canvasWheel(e){
  //Follows the untransformd mousePosition
  let t = ctx.getTransform();
  const mouseLoc = invertCoordinates(e.offsetX*universe.scale, e.offsetY*universe.scale, ctx);
  let change = e.deltaY/1000; //Change in coordinates
  const scale = 1 + change;
  if (scale*t.a>5.0 || scale*t.a<.2){
    change = 0;
    if (scale*t.a<.2){
      ctx.setTransform(.2,t.b,t.c,.2, t.e,t.f);
    } else if (scale*t.a> 5) {
      ctx.setTransform(5,t.b,t.c,5, t.e,t.f);
    };
    universe.updatePoints();
    return;
  };
  ctx.translate(...mouseLoc);
  ctx.scale(scale, scale);
  ctx.translate(-mouseLoc[0], -mouseLoc[1]);
  t = ctx.getTransform();
  // ctx.setTransform(t.a+change,t.b,t.c,t.d+change, t.e,t.f);
  universe.updatePoints();
};


//Now our beloved body class
function body(x, y, vx, vy, r=50){
  //This is a square body
  this.x = x; // x, y -> Center of circle
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.m = 1; //Mass in arbitrary units
  this.fillStyle = generateColor();//"cornflowerblue";//Pretty fill color
  this.strokeStyle = "white"; //Edge color
  this.lineWidth = 1; //Edge width
  this.r = r; //Radius in pixels

  //this is where the array with all the bodies is stored
  this.bodies.push(this);
};

//Note that the draw function now includes linewidth
body.prototype.draw = function(){
  //First we make sure the canvas fits out objects specifications
  ctx.fillStyle = this.fillStyle;
  ctx.strokeStyle = this.strokeStyle;
  ctx.lineWidth = this.lineWidth;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, 6.28);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

//Draws all bodies
body.prototype.drawAll = function(){
  //First we make sure the canvas fits out objects specifications
  for (var b of body.prototype.bodies){
    b.draw();
  };
};

//Moves the body that has this funciton called by as a method!
body.prototype.move = function(dt = 1){
  //Moves the particle through dt seconds
  this.x+=this.vx*dt;
  this.y+=this.vy*dt;
};

//Moves all bodies.
body.prototype.moveAll = function(dt = 1){
  //Does the same as move, but to all blocks
  for (var b of body.prototype.bodies){
    b.move(dt);
  };
};


//Detects wall collisions and handles them
//Walls are the sides of the canvas
body.prototype.wallDetectionAndHandling = function(){
  /*This bounces the object from the wall.*/
  if (this.x+this.r>universe.x1){
    this.vx*=-1*damping;
    this.x = universe.x1 - this.r;
  } else if (this.x -this.r < universe.x0){
    this.vx*=-1*damping;
    this.x = this.r+universe.x0;
  };
  if (this.y+this.r>universe.y1){
    this.vy*=-1*damping;
    this.y = universe.y1-this.r;
  } else if (this.y -this.r < universe.y0){
    this.vy*=-1*damping;
    this.y = this.r+universe.y0;
  };
};

//Checks and handles wall collisions for all the bodies
body.prototype.wallDetectionAndHandlingAll = function(){
  //Does the same as move, but to all blocks
  for (var b of body.prototype.bodies){
    b.wallDetectionAndHandling();
  };
};

//Used to get access to all the bodies
body.prototype.bodies = []; //Notice every created object ends here

//Checks the collisions for all bodies with all other bodies
body.prototype.checkAndHandleCollisionAll = function(){
  const bodies = body.prototype.bodies;
  for (var i=0; i < bodies.length-1; i++){
    for (var j=i+1; j < bodies.length; j++){
      const b1 = bodies[i];
      const b2 = bodies[j];
      if ((b1.x-b2.x)**2>(b1.r+b2.r)**2){continue;};//efficiency
      if ((b1.y-b2.y)**2>(b1.r+b2.r)**2){continue;};
      if ((b1.x-b2.x)**2+(b1.y-b2.y)**2 < (b1.r+b2.r)**2){
        b1.collideWith(b2);//This function does anything we want after collision
      };
    };
  };
};

//Draws arror that give an indication of relative velocity
body.prototype.drawVArrow = function(){
  const speed = Math.sqrt(this.vx**2+this.vy**2);
  if (speed==0){return;};
  const sin = this.vy/speed;
  const cos = this.vx/speed;
  const len = 40*speed;
  const h = 3; //sideHeight of arrow
  ctx.strokeStyle = ctx.fillStyle = this.strokeStyle;
  ctx.lineWidth = this.lineWidth*2;
  ctx.transform(cos, sin, -sin, cos, this.x, this.y);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(len, 0);
  ctx.lineTo(len, -h);
  ctx.lineTo(len+2*h, 0);
  ctx.lineTo(len, h);
  ctx.lineTo(len, 0);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
  ctx.transform(cos, -sin, sin, cos, 0, 0);
  ctx.translate(-this.x, -this.y);
};

//Draws velocity arrows for all bodies
body.prototype.drawVArrowAll = () =>{
  for (var b of body.prototype.bodies){
    b.drawVArrow();
  };
};

/*
NOTE:
The math here is a bit complex.
Instead of trying to understand it
here, go to wikipedia.
https://wikimedia.org/api/rest_v1/media/math/render/svg/14d5feb68844edae9e31c9cb4a2197ee922e409c
*/

body.prototype.collideWith = function(b2){
  //This function updates velocities and positions!
  //Two bodies can't ocupy the same location!!!

  //Here we save some values
  const vx1 = this.vx;
  const vy1 = this.vy;
  const vx2 = b2.vx;
  const vy2 = b2.vy;

  //Lets save these values
  let x12 = b2.x - this.x;
  let y12 = b2.y - this.y;

  //Make the balls no longer overlap
  //This step is VERY important
  let dist = Math.sqrt(x12**2 + y12**2);//Only used once. But not constant!
  const xOffset = (this.r+b2.r - dist)*x12/dist;
  const yOffset = (this.r+b2.r - dist)*y12/dist;
  b2.x += 1/2*xOffset;
  b2.y += 1/2*yOffset;
  this.x -= 1/2*xOffset;
  this.y -= 1/2*yOffset;

  //Constant that shows up more than once
  const mt = this.m + b2.m;
  const r = (b2.x-this.x)**2 + (b2.y-this.y)**2;
  const dotProd = (vx1-vx2)*(this.x-b2.x) + (vy1-vy2)*(this.y-b2.y);
  //Note that x12 and y12 changed!
  x12 = b2.x - this.x;
  y12 = b2.y - this.y;

  //Calculate new velocities
  const newVx1 = vx1 - 2*b2.m*-x12*dotProd/(mt*r);
  const newVy1 = vy1 - 2*b2.m*-y12*dotProd/(mt*r);

  const newVx2 = vx2 - 2*this.m*x12*dotProd/(mt*r);
  const newVy2 = vy2 - 2*this.m*y12*dotProd/(mt*r);

  //Set new velocities
  this.vx = newVx1*damping; this.vy = newVy1*damping;
  b2.vx = newVx2*damping; b2.vy = newVy2*damping;
};

//Random rbg color generator
function generateColor(){
  const color = `rgb( ${Math.random()*255},
                      ${Math.random()*255},
                      ${Math.random()*255})`;
  return color;
};


//Now we check for mouseclick
body.prototype.isMouseOver = function(e){
  const point = invertCoordinates(e.offsetX*universe.scale, e.offsetY*universe.scale, ctx);
  for (var b of body.prototype.bodies){
    if ((b.x-point[0])**2+(b.y-point[1])**2<b.r**2){
      body.prototype.unSelectBody();
      body.prototype.selectBody(b);
      return true;
    };
  };
  return false;
};

//Selects a body
body.prototype.selectBody = (b)=> {
  body.prototype.selectedBody = b;
  b.originalStroke = b.strokeStyle;
  b.strokeStyle = "cornflowerblue";
  b.lineWidth = 1.2;
  b.isBeingDragged = true;
};

//Makes a body ready to be dragged by the mouse
body.prototype.startDragging = () =>{
  if (!body.prototype.selectedBody){return};
  body.prototype.selectedBody.isBeingDragged = true;
};

//Makes a body undraggable
body.prototype.stopDragging = () =>{
  if (!body.prototype.selectedBody){return};
  body.prototype.selectedBody.isBeingDragged = false;
};

//Makes body return to unselected state
body.prototype.unSelectBody = ()=> {
  if (!body.prototype.selectedBody){return;};
  const b = body.prototype.selectedBody;
  b.strokeStyle = b.originalStroke;
  // b.fillStyle = "white";
  b.lineWidth = 1;
  b.isBeingDragged = false;
  body.prototype.selectedBody = undefined;
};

//Applies many functions to make the system evolve in time
body.prototype.evolve = function(){
  const b = body.prototype;
  for (let i=0; i<25; i++){
    b.checkAndHandleCollisionAll(); //Must be first!!
    b.wallDetectionAndHandlingAll(); //Ensures nothing moves inside the wall!!! This breaks everything!!!!
    b.moveAll();
  };
  b.drawAll();
  b.drawVArrowAll();
};

//Makes a body move to where the mouse is
body.prototype.moveToMouse = (e)=>{
  const b = body.prototype.selectedBody;
  const point = invertCoordinates(e.offsetX*universe.scale, e.offsetY*universe.scale, ctx);
  b.x = point[0];
  b.y = point[1];
};


//Lets attach some mouseEvents to the canvas
function mousePressed(e){
  const b = body.prototype.selectedBody;
  if (body.prototype.isMouseOver(e)){
    body.prototype.startDragging();
    return;
  };
  body.prototype.unSelectBody();
  canvasPressed(e);
};

//Canvas mouse drag handler
function mouseDragged(e){
  if (body.prototype.selectedBody){
    if (body.prototype.selectedBody.isBeingDragged){
      body.prototype.moveToMouse(e);
    };
    return;
  } else {
    canvasDragged(e);
  };
};

//Canvas mouse release handler
function mouseReleased(e){
  body.prototype.stopDragging();
  canvasReleased(e);
};


//Adding event listeners
canvas.addEventListener("mousedown", mousePressed);
canvas.addEventListener("mousemove", mouseDragged);
canvas.addEventListener("mouseup", mouseReleased);
canvas.addEventListener("mouseenter", canvasMouseIn);
canvas.addEventListener("mouseleave", canvasMouseOut);
canvas.addEventListener("wheel", canvasWheel);


//Lets make the canvas look fantastisch
improveImage(2);

//Lets make some bodies
for (var i=0; i < 1; i++){
  const rand = Math.random;
  for (var j =0; j<5; j++){
    const x = i*60;
    const y = j*60;
    const vx = rand()**6-rand()**6;
    const vy = rand()**6-rand()**6;
    const r = Math.floor(rand()*8+10);
    const b = new body(x, y, vx, vy, r);
    b.m = i*.2+1;
  };
};

// ctx.scale(1/2, 1/2);
// universe.updatePoints();

//Now we begin the simulation
function run(){
  clearCanvas();
  drawGrid();
  body.prototype.evolve();
  requestAnimationFrame(run);
};
run();

/*
Welcome

Move all the way down!!!!!!!
*/

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

function body(x, y, vx, vy, w=50){
  //This is a square body
  this.x = x; // x, y -> top left corner (arbritrary choice)
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.m = 1; //Mass in arbitrary units
  this.fillStyle = "cornflowerblue";//Pretty fill color
  this.strokeStyle = "black"; //Edge color
  this.lineWidth = 1; //Edge width
  this.w = w; //Side length in pixels
};

//Note that the draw function now includes linewidth
body.prototype.draw = function(){
  //First we make sure the canvas fits out objects specifications
  ctx.fillStyle = this.fillStyle;
  ctx.strokeStyle = this.strokeStyle;
  ctx.lineWidth = this.lineWidth;
  ctx.beginPath();
  ctx.fillRect(this.x, this.y, this.w, this.w);
  ctx.rect(this.x, this.y, this.w, this.w);
  ctx.stroke();
  ctx.closePath();
};

body.prototype.move = function(dt = 1){
  //This moves the particle in the laziest way possible
  //But it does the just just fine.
  //dt is the ammount of time that passes during the movement.
  this.x+=this.vx*dt;
  this.y+=this.vy*dt;
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Stop here
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/*
To make it bounce walls we first need to check if the cube has collided
with the walls. Then handle the result
*/
body.prototype.wallDetectionAndHandling = function(){
  /*This bounces the object from the wall. But you can
  simply substitute the bouncing part by other functions later.
  Something like leftWallHandler();*/
  if (this.x+this.w>canvas.width || this.x<0){
    this.vx*=-1;
  };
  if (this.y+this.w>canvas.height || this.y<0){
    this.vy*=-1;
  };
};

// We test it in our loop

let b1 = new body(10,canvas.height- 50, 1, 0);
b1.draw();

let interval = setInterval(
  ()=>{
    /*Erase canvas */
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //THIS IS THE NEW FUNCTION
    b1.wallDetectionAndHandling();

    //Here we move the object
    b1.move();

    //Now we draw the object.
    b1.draw();
  }, 10
);
// Furthermore you can just make more cubes. They can all populate
//The canvas at the same time.

let button = document.createElement("button");
button.type = "button";
button.innerHTML = "Click to add another boxe";
document.body.appendChild(button);
button.onclick = function(){
  clearInterval(interval);
  let b2 = new body(100,canvas.height- 50, 1, 0);
  b2.fillStyle  = "tomato";
  let interval2 = setInterval(
    ()=>{
      /*Erase canvas */
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      //THIS IS THE NEW FUNCTION
      b1.wallDetectionAndHandling();
      b2.wallDetectionAndHandling();

      //Here we move the object
      b1.move();
      b2.move();

      //Now we draw the object.
      b1.draw();
      b2.draw();
    }, 10
  );
  button.onclick = function(){null};
};

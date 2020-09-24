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
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Stop here
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/*
If you followed this far you noticed we still need to do two things.
one of them is to get the collision between objects working and
a way to facillitate accessing all the body objects at the same time.
BOth are done below
*/
body.prototype.bodies = []; //Notice every created object ends here

body.prototype.checkAndHandleCollision = function(){
  for (let i=0; i<this.bodies.length-1; i++){
    for (let j=i+1; j<this.bodies.length; j++){
      let b1 = this.bodies[i];
      let b2 = this.bodies[j];
      if (b2.x<b1.x+b1.w && b1.x<b2.x+b2.w){
        b1.collideWith(b2);//This function does anything we want after collision
      } else {
        b1.fillStyle = b2. fillStyle = "cornflowerblue"; //For tsting purpuses
      };
    };
  };
};

//Here is out collision handler
body.prototype.collideWith = function(b2){
  this.fillStyle = b2.fillStyle = "white";
  //Here we will add our formulas
};

// We test it in our loop
let b1 = new body(10,canvas.height- 50, 1, 0);
let b2 = new body(100,canvas.height- 50, 1, 0);

let interval = setInterval(
  ()=>{
    /*Erase canvas */
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //THIS IS THE NEW FUNCTION
    for (let b of b1.bodies){ //For loops to make sure all the cubes get affected
      b.wallDetectionAndHandling();
    };

    b1.checkAndHandleCollision();

    //Here we move the object
    for (let b of b1.bodies){
      b.move();
    };

    //Now we draw the object.
    for (let b of b1.bodies){
      b.draw();
    };
  }, 10
);

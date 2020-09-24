/*
Welcome

In the last lesson we made collision detection.
Also, we added for loops to the function that
redraws the screen. THe problem is that all
those loops make things disorganized.

So we introduce the following functions
that can be called from any object or from the
class directly. These functions will affect ALL
the cubes.

drawAll();
moveAll();

Also, I changed one of the names to:
checkAndHandleCollisionAll();
ABout this last one, because of
how it was made, it already affects all
the bodies. THe only change I made is that
I removed 'this' from the formula because
then it can be called directly from the
class as:
body.prototype.checkAndHandleCollision();

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

body.prototype.drawAll = function(){
  //First we make sure the canvas fits out objects specifications
  for (let b of body.prototype.bodies){
    b.draw();
  };
};


body.prototype.move = function(dt = 1){
  //Moves the particle through dt seconds
  this.x+=this.vx*dt;
  this.y+=this.vy*dt;
};

body.prototype.moveAll = function(dt = 1){
  //Does the same as move, but to all blocks
  for (let b of body.prototype.bodies){
    b.move();
  };
};



body.prototype.wallDetectionAndHandling = function(){
  /*This bounces the object from the wall.*/
  if (this.x+this.w>canvas.width || this.x<0){
    this.vx*=-1;
  };
  if (this.y+this.w>canvas.height || this.y<0){
    this.vy*=-1;
  };
};

body.prototype.wallDetectionAndHandlingAll = function(){
  //Does the same as move, but to all blocks
  for (let b of body.prototype.bodies){
    if (b.x+b.w>canvas.width || b.x<0){
      b.vx*=-1;
    };
    if (b.y+b.w>canvas.height || b.y<0){
      b.vy*=-1;
    };
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

body.prototype.checkAndHandleCollisionAll = function(){
  let bodies = body.prototype.bodies;
  for (let i=0; i<bodies.length-1; i++){
    for (let j=i+1; j<bodies.length; j++){
      let b1 = bodies[i];
      let b2 = bodies[j];
      if (b2.x<b1.x+b1.w && b1.x<b2.x+b2.w){
        b1.collideWith(b2);//This function does anything we want after collision
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
    b1.wallDetectionAndHandlingAll();

    //Collisions with other objects
    b1.checkAndHandleCollisionAll();

    //Here we move the object
    b1.moveAll();

    //Now we draw the object.
    b1.drawAll();
  }, 10
);

/*
Lastly, below you will see the new collision handler that
uses formulas I got from wikipedia.
Note that upon collision, one of the blocks gets moved.
Remove this line of code and see what happens.
As an exercise, what do you think the cause is?
*/

body.prototype.collideWith = function(b2){
  //Here we will add our formulas
  const vx1 = this.vx;
  /*
  We saved these values because if we change
  one the calculation for the other will change.
  Hence, we must use the same velocity for b1.
  */
  let m1 =b1.m; let m2=b2.m;
  let mt =m1+m2;
  b1.vx = ((m1-m2)*vx1+ 2*m2*b2.vx)/mt;
  b2.vx = ((m2-m1)*b2.vx+ 2*m1*vx1)/mt;
  if (this.x<b2.x){ //To stop them from being inside one another.
    b1.x = b2.x-b1.w;
  } else {
    b2.x = b1.x-b2.w;
  };
};

/*
With this we concluse the basics.
From now on you just need to add
more stuff.

For lesson three we go a step ahead
and change this into something a
little bit more useful. Balls.
*/

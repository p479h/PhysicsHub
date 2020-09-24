/*
Welcome


This is the file where the geometry was changed
*/

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

function body(x, y, vx, vy, r=50){
  //This is a square body
  this.x = x; // x, y -> Center of circle
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.m = 1; //Mass in arbitrary units
  this.fillStyle = "cornflowerblue";//Pretty fill color
  this.strokeStyle = "black"; //Edge color
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
  if (this.x+this.r>canvas.width || this.x -this.r<0){
    this.vx*=-1;
  };
  if (this.y+this.r>canvas.height || this.y -this.r<0){
    this.vy*=-1;
  };
};

body.prototype.wallDetectionAndHandlingAll = function(){
  //Does the same as move, but to all blocks
  for (let b of body.prototype.bodies){
    b.wallDetectionAndHandling();
  };
};


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
      if (Math.sqrt((b1.x-b2.x)**2+(b1.y-b2.y)**2)<b1.r+b2.r){
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
let b1 = new body(30,canvas.height- 50, 1, 0,20);
let b2 = new body(100,canvas.height- 50, 1, 0,20);

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
  if (b1.x<b2.x){ //To stop them from being inside one another.
    b1.x = b2.x-b1.r -b2.r;
  } else {
    b2.x = b1.x-b1.r -b2.r;
  };
};

/*
Now, if you run this on a browser you will see that you indeed get
the expected output. But as I was testing this I found a bug, just
as you will when you are making simulations. To see the bug, go to the
line where b1 is defined and change the first argument (x) to 10;

THis way the ball will be generated inside the wall!!!

Now, after looking at what the error looks like, what do you think
is the way to solve it?

ASSUMING YOU TRIED...
Jk, the solution is in the next part. In the readme file.

*/

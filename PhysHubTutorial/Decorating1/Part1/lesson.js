/*
Welcome


This is the file where I added more support for movement
in more than one dimension.
*/

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function body(x, y, vx, vy, r=50){
  //This is a square body
  this.x = x; // x, y -> Center of circle
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.m = 1; //Mass in arbitrary units
  this.fillStyle = generateColor();//"cornflowerblue";//Pretty fill color
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
  if (this.x+this.r>canvas.width){
    this.vx*=-1;
    this.x = canvas.width - this.r;
  } else if (this.x -this.r<0){
    this.vx*=-1;
    this.x = this.r;
  };
  if (this.y+this.r>canvas.height){
    this.vy*=-1;
    this.y = canvas.height-this.r;
  } else if (this.y -this.r<0){
    this.vy*=-1;
    this.y = this.r;
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
  const bodies = body.prototype.bodies;
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


/*
NOTE:
The math here is a bit complex.
Instead of trying to understand it
here, go to wikipedia.
https://wikimedia.org/api/rest_v1/media/math/render/svg/14d5feb68844edae9e31c9cb4a2197ee922e409c
*/

body.prototype.collideWith = function(b2){
  //This function updates velocities and positions!
  //Two bodies can't ocupy the same location

  //Here we save some values
  const vx1 = this.vx;
  const vy1 = this.vy;
  const vx2 = b2.vx;
  const vy2 = b2.vy;

  //Now we save some vectors and scalars
  const x12 = b2.x - this.x;
  const y12 = b2.y - this.y;
  const r = x12**2 +y12**2;
  const mt = this.m + b2.m;
  const dotProd = (vx1-vx2)*(this.x-b2.x) + (vy1-vy2)*(this.y-b2.y);

  //Calculate new velocities
  const newVx1 = vx1 - 2*b2.m*-x12*dotProd/(mt*r);
  const newVy1 = vy1 - 2*b2.m*-y12*dotProd/(mt*r);

  const newVx2 = vx2 - 2*this.m*x12*dotProd/(mt*r);
  const newVy2 = vy2 - 2*this.m*y12*dotProd/(mt*r);

  //Set new velocities
  this.vx = newVx1; this.vy = newVy1;
  b2.vx = newVx2; b2.vy = newVy2;

  //Make the balls no longer overlap
  const dist = Math.sqrt(r);
  b2.x = this.x+(this.r+ b2.r)*x12/dist;
  b2.y = this.y+(this.r+ b2.r)*y12/dist;
};


// We test it in our loop with a lot of balls
let b1 = new body(90,canvas.height- 50, 1, 0,20);
let b2 = new body(400,canvas.height- 50, -1, 0,20);

for (let i=0; i<6; i++){
  let b = new body(i*30, i*30, 1, i, 20);
  b.m = i*2+1;
};

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
Now, just for fun:

We make a random color generator to make
the balls less blend.
*/
function generateColor(){
  let color = `rgb( ${Math.random()*255},
                      ${Math.random()*255},
                      ${Math.random()*255})`;
  return color;
};


/*
With this, you have officially seen how any simulation
starts. You just have to get the basis of the simualtion
working without glitches. Then, you just decorate it with
fancy things of your liking!

P.S. If you are reaaaaally ambitious, you can also keep
going from here. Instead of decoration, you can further
expand this to 3 dimensions! It is your simulaiton afterall.
The sky -- > Universe is the limit (considering it is endless)
*/

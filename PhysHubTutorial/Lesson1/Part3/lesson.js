/*
Welcome

Move all the way down!!!!!!!
*/

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

/*
Now that we can see the cube. We can add some more
attributes to it.
*/

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

/*
Last time you saw how to start a loop but you
did not see your cube moving. Luckily, last time
we gave the cube a velocity. All we have to do
is move it every time the interval is called.
*/

body.prototype.move = function(dt = 1){
  //This moves the particle in the laziest way possible
  //But it does the just just fine.
  //dt is the ammount of time that passes during the movement.
  this.x+=this.vx*dt;
  this.y+=this.vy*dt;
};

// Now lets test our new function
let b1 = new body(10,canvas.height- 50, 1, 0);
b1.draw();

let interval = setInterval(
  ()=>{
    /*Erase canvas */
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //HERE WE MOVE THE OBJECT
    b1.move();

    //Now we draw the object.
    b1.draw();
  }, 20
);

// Now that the cube can move. We are ready to add more
// functionality!!!

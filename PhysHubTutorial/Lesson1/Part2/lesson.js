/*
Welcome

Now we reuse the code from las time for simplicity.
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

// Now lets test our new function
let b1 = new body(10,canvas.height- 50, 1, 0);
b1.draw();

/*Now that we know our preliminary design works we
can move on

First you must be able to continuouly update
the screen in case there is any movement of
the objects.

This can be done in many ways. The most efficient is using
window.requestAnimationFrame();

But for the sake of simplicity I will use setInterval();
*/

let interval = setInterval(
  ()=>{
    /*If you dont want your screen full of old drawings,
    you must erase the old ones */
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Now we draw the object.
    b1.draw();

  }, 20
);

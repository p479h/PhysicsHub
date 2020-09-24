/*
Welcome

Here you can find the beggining on how to make a simulation.
We will be making a collision simulation. Step by step.

We shall begin.
*/

/*
The first step is to make a plan.

We know we need somewhere to draw. Therefore we know we will need
to have the canvas accessible the entire time.

So let us make the canvas (generated in the html) and the drawing
context available as global variables:
*/

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
//You might notice that the image of this canvas is bad.
//We will deal with that later.

/*
We know we will have collisions.
We know these collisions will happen between objects. We also know
that these object have properties. Hence it makes sense to create
a class that contains all this information that is shared between
colliding objects. I won't explicitly say why I have added each
attribute to the class since you usually won't know all before
hand. You figure those attributes out as you go.
*/

function body(x, y){
  //This is a square body
  this.x = x; // x, y -> top left corner (arbritrary choice)
  this.y = y;
  this.fillStyle = "cornflowerblue";//Pretty fill color
  this.strokeStyle = "black"; //Edge color
  this.w = "10"; //Side length in pixels
};


/*Now we need to visualize our body
Notice that we use ... = function();
The reason is that we will use the name "this".
Arrow functions capture its variables from the
context where they are defined. Hence attactching
an arrow function to a prototype will give you headaches.*/
body.prototype.draw = function(){
  //First we make sure the canvas fits out objects specifications
  ctx.fillStyle = this.fillStyle;
  ctx.strokeStyle = this.strokeStyle;
  ctx.fillRect(this.x, this.y, this.w, this.w);
  ctx.rect(this.x, this.y, this.w, this.w);
  ctx.stroke();
};

// Now lets test our new function
let b1 = new body(10,canvas.height- 10, 50, 50);
b1.draw();

//You should be able to see the body after running this.

// Now to the next tutorial

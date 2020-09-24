As promised, here is the problem and the solution.

Creating a ball inside the wall is problematic because
of how we handled collision will wall. We simply changed
the velocity.

One might argue that the solution is to simply not create
objects inside the walls. But this is lazy thinking and
later you would pay the price. This is how:
  Imagine you have implemented energy losses in during the
  impact. The ball will bounce slower than it came.
  Remember that detection happens when you check that the ball
  is inside the wall? If the speed goes down too much. The ball
  can not scape the wall before the next wall collision detection.
  The net result is that the ball becomes indefinitely stuck inside
  the wall!!!!

  Now, this same problem might occur for collisions with anything.
  Not just the walls.

  Before revealing the solution: PLEASE TRY FINDING A WAY TO
  SOLVE THIS!!!

  With that out of the way:

  THe solution is to remove the object from the object it is currently
  intersecting.
  So if we used this to detect collision:
  if (ball.x+ball.r<canvas.width){...};
  After detecting the collision you simply use this:
  ball.x = canvas.width - ball.r;

  For the rest of this tutotorial I will simply be adding complexity to the
  model. As the FOUNDATION is done.

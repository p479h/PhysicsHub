Now, this is important.
Now that you know the basics on how to start a simulation. It is
time to make sure you go the message.

START SIMPLE
In the exmaples I showed you I made a very simple simulation.
Then slowly I made it scalable. As a matter of fact, as you
probably noticed. There is still a lot of work to do. But it
will not be difficult to do so because the FOUNDATION is there.

For example:
  I like the simulation as it is, however, for starters and also
  for me I admit. Squares are not that nice to work with. You see,
  when squared collide they can produce torque. That is one source
  of complication. Furthermore, if you were to try working with
  squares a bit more in 2 dimensions (notice that the engine I made
  only considers the x direction, hence it is one dimentional).

  Don't get me wrong, TRY working with squares. They are pretty cool,
  it is just that spheres are better to work with for begginers.
  No dispair tho. There are not that many things we have to change
  to make out body class work with balls.

  First we have to change the way we define their coordinates and dimensions.
  We defined it assuming x,y was the position of a corner of the rectangle.
  For balls it makes more sense to consider x, y the center of the ball.
  Furthermore, we can substitute the width by a radius.

  This will cause the draw() function to change, as now we must draw
  balls. But it will also change the collision detection and handling.

  I will not show explicitly the exact changes I made. I will leave that as an
  exercise to you. Just go and read the updated js file in part1.

//Here we add the plotting functions to body!!!

//We define a starting time
let t = 0;
let dt = 1;

//We define a time array
const tArray = [t];

//We give ekArrays for every body:
for (let b of body.prototype.bodies){
  b.ekArray = [b.m*(b.vx**2+b.vy**2)];
  b.ekArray.length = tArray.length;
};

//We define a function to get the maximun Ek out of every body
body.prototype.getEkLimits = function(){
  let max = 0;
  let min = 0;
  for (let b of body.prototype.bodies){
    maxInB = Math.max(...b.ekArray);
    minInB = Math.min(...b.ekArray);
    max = (maxInB>max)? maxInB:max;
    min = (minInB<min)? minInB:min;
  };
  if (max == min || max<min){
    min = 0;
    max = 1;
  };
  return [min, max];
};

//We define a maximun and minimun EK for resizing
body.prototype.ekLimits = body.prototype.getEkLimits();

//We make it possible to plot!!!
body.prototype.plotEnergies = function(){
  const t = plottingCtx.getTransform();
  for (var b of body.prototype.bodies){
    plottingCtx.strokeStyle = b.fillStyle;
    plotPoints(tArray, b.ekArray);
  };
  //Now lets plot circles on the ends to make it prettier
  //For this we need to reset the transform temporarily. Otherwise we do not get circles. We get ovals
  plottingCtx.resetTransform();
  plottingCtx.strokeStyle = "white";
  plottingCtx.lineWidth = 1;
  for (var b of body.prototype.bodies){
    plottingCtx.fillStyle = b.fillStyle;
    let index = b.ekArray.length-1;
    let y = b.ekArray[index];
    let x = tArray[index];
    plottingCtx.beginPath();
    plottingCtx.arc(x*t.a+t.e, y*t.d+t.f, 5, 0, 6.28);
    plottingCtx.closePath();
    plottingCtx.fill();
    plottingCtx.stroke();
  };
  plottingCtx.setTransform(t);
};

//Now lets make a funciton that handles updating t and ekArray
let counter,xlims,ylims;
function handlePlotting(){
  //We need some gloabl variables
  if (!counter){
    counter = 0;
  };
  if (!ylims){
    ylims = body.prototype.getEkLimits();
  };
  if (!xlims){
    xlims = [t - speedSliderContainer.slider.value*50, t];
  };

  //Now the actual plotting
  let length = 100;
  if (tArray.length==length){
    tArray.shift();
    for (let b of body.prototype.bodies){
      b.ekArray.shift();
    };
  };
  for (let b of body.prototype.bodies){
    b.ekArray.push(b.m*(b.vx**2+b.vy**2));
  };
  tArray.push(t);
  t+=dt;

  //Now we still have to plot what we have!!! AND handle the limits
  //We create a variable called counter so we don't check for maxima too
  //often. We also define the variable ylims and xlims
  if (counter%2==0){
    counter = 0;
    ylims = body.prototype.getEkLimits();
  };
  counter++

  //Now we set the limits
  xlims = [t - dt*length, t+20*dt];
  setLims(...xlims, ...ylims);

  // Now we plot what we have
  clearPlottingCanvas();
  drawPlottingGrid();
  body.prototype.plotEnergies();
};


//Now we modify the function that runs when the system is running
//This is done by modifying body.prototype.evolve

//To make the function responsive to changing the running tag we overwrite body.evolve
body.prototype.evolve = function(){
  const b = body.prototype;
  const dt = Number(speedSliderContainer.slider.value);
  b.checkAndHandleCollisionAll(); //Must be first!!
  b.wallDetectionAndHandlingAll(); //Ensures nothing moves inside the wall!!! This breaks everything!!!!

  if (running){
    b.addVerticalAcceleration();
    b.moveAll(dt);
  };

  b.drawAll();
  if (showVCheckboxContainer.checkbox.checked){
    b.drawVArrowAll();
  };

  //Here comes the code where we handle kinetic energies
  if (true/*EKCheckboxContainer.checkbox.checked*/){
    handlePlotting(); //This makes use of dt, which is available from this scope
  };
};

//Note that the above function breaks the function to add objects to the simulation.
//Hence we must fix it by overriding the beast
function addBody(e){
  const point = invertCoordinates(e.offsetX*universe.scale, e.offsetY*universe.scale, ctx);
  const b = new body(...point, 0, 0, 10);
  b.ekArray = [];
  b.ekArray.length = 50;
};

//Also, now we need a function that only makes the plotting canvas visible when
//The button that asks for showing the kinetic energy is pressed.
EKCheckboxContainer.checkbox.onclick = () => {
  //First we add the plottingCanvas to the same container as the canvas
  if (EKCheckboxContainer.checkbox.checked){
    // plottingCanvas.style.display = "inline-block";
    plottingCanvas.style.transform = "translate(75%, 25%) scale(.5, .5)";
    plottingCanvas.style["z-index"] = "1";
  } else {
    // plottingCanvas.style.display = "none";
    plottingCanvas.style.transform = "translate(0%, 0%) scale(.1, .1)";
    plottingCanvas.style["z-index"] = "-1";
  };
};

const explanation = `
<h3>Instructions</h3>
<ul>
  <li>Click and hold to select and drag objects</li>
  <li>Use the dropdown to change individual and global parameters</li>
  <li>Play and discover more!</li>
</ul>
`;

//Now we add some explanation
const explanationBox = document.createElement("div");
canvas.parentElement.appendChild(explanationBox);
explanationBox.parentElement = canvas.parentElement;
explanationBox.style = `
height: 300px;
width: 500px;
background-color: black;
border: 2px solid white;
position: absolute;
display: inline-block;
color:white;
transition-duration: .5s;
z-index: -1;
transform: scale(.1, .1);
margin: 0;
font-family: georgia;
font-size: 25px;
`;
explanationBox.innerHTML = explanation;
instrucCheckboxContainer.checkbox.onclick = ()=>{
  //First we add the plottingCanvas to the same container as the canvas
  if (instrucCheckboxContainer.checkbox.checked){
    // plottingCanvas.style.display = "inline-block";
    explanationBox.style.transform = "translate(75%, -25%) scale(0.5, 0.5)";
    explanationBox.style["z-index"] = "1";
  } else {
    // plottingCanvas.style.display = "none";
    explanationBox.style.transform = "translate(0%, 0%) scale(.1, .1)";
    explanationBox.style["z-index"] = "-1";
  };
};

/*Time to make the dropdown*/
const dd = makeDropdown(canvas);
dd.setLabel("Your label");
setPedroStyle(canvas);

//Making the items
const parametersItem = makeItem(dd);
const displayItem = makeItem(dd);
const commandsItem = makeItem(dd);

//Making the rows on parametersItem
const vxRow = makeRow(parametersItem);
const vyRow = makeRow(parametersItem);
const rRow = makeRow(parametersItem);
const massRow = makeRow(parametersItem);
const dampingRow = makeRow(parametersItem);
const gRow = makeRow(parametersItem);
const speedRow = makeRow(parametersItem);
const colorRow = makeRow(parametersItem);

//Making display items
const EKRow = makeRow(displayItem);
const instrucRow = makeRow(displayItem);
const showVRow = makeRow(displayItem);

//Making the command rows
const startRow = makeRow(commandsItem);
const pauseRow = makeRow(commandsItem);
const removeRow = makeRow(commandsItem);
const addRow = makeRow(commandsItem);

//Nested Items
const colorItem = makeItem(colorRow);

//Rows in nest items
const redRow = makeRow(colorItem);
const greenRow = makeRow(colorItem);
const blueRow = makeRow(colorItem);


//Making the widget containers
//Parameters
const vmax = 1;
const vxSliderContainer = makeSlider(vxRow, vmax, -vmax, .01, 0, "Vx");
const vySliderContainer = makeSlider(vyRow, vmax, -vmax, .01, 0, "Vy");
const rSliderContainer = makeSlider(rRow, 50, 1, .01, 1, "Radius");
const mSliderContainer = makeSlider(massRow, 20, 1, .01, 5, "Mass");
const dampingSliderContainer = makeSlider(dampingRow, 1, 0, .01, 0, "Damp");
const gSliderContainer = makeSlider(gRow, 10, 0., .01, 0, "g");
const speedSliderContainer = makeSlider(speedRow, 7, 0.1, .01, 2, "Speed");
//Colors
const redSliderContainer = makeSlider(redRow, 255, 0, 1, 0, "Red");
const greenSliderContainer = makeSlider(greenRow, 255, 0, 1, 0, "Green");
const blueSliderContainer = makeSlider(blueRow, 255, 0, 1, 0, "Blue");

//display
const EKCheckboxContainer = makeCheckbox(EKRow);
const instrucCheckboxContainer = makeCheckbox(instrucRow);
const showVCheckboxContainer = makeCheckbox(showVRow);

//Commands
const startButtonContainer = new buttonContainer(startRow);
const pauseButtonContainer = new buttonContainer(pauseRow);
const removeCheckboxContainer = makeCheckbox(removeRow);
const addCheckboxContainer = makeCheckbox(addRow);


//Making some buttons
//The function that makes a button requires a dummy function
const dummyFunc = ()=>{null;};
//Making the buttons
const startButton = startButtonContainer.makeButton("Start", dummyFunc);
const pauseButton = pauseButtonContainer.makeButton("Pause", dummyFunc);

//Giving the labels
dd.setLabel("Options");

parametersItem.setLabel("Parameters");
displayItem.setLabel("Diplay");
commandsItem.setLabel("Commands");

colorItem.setLabel("Colors");

EKCheckboxContainer.setLabel("Show kinetic energy");
instrucCheckboxContainer.setLabel("Show Instructions");
showVCheckboxContainer.setLabel("Show velocity");
removeCheckboxContainer.setLabel("Remove");
addCheckboxContainer.setLabel("Add");


//Adding functionality to the dropdown
//First we need to make sure that the parameters refer to the selected body.
//Hence we overwrite the original selectBody() function.
//Before we make a function that sets all the sliders accordingly
function setSlidersToSelectedBody(){
  if (!body.prototype.selectedBody){return;};
  const b = body.prototype.selectedBody;
  vxSliderContainer.slider.value = b.vx;
  vySliderContainer.slider.value = b.vy;
  mSliderContainer.slider.value = b.m;
  rSliderContainer.slider.value = b.r;
  dampingSliderContainer.slider.value = 0; //Still need to add damping

  updateSliderLabels();
};
//Lets get access to all sliders at once
const sliderContainers = [
  vxSliderContainer,
  vySliderContainer,
  mSliderContainer,
  rSliderContainer,
  dampingSliderContainer,
  speedSliderContainer,
  redSliderContainer,
  blueSliderContainer,
  greenSliderContainer
];

//function to update slider labels
function updateSliderLabels(){
  //Updating labels
  for (sliderContainer of sliderContainers){
    sliderContainer.updateValueLabel();
  };
};

//Setting default
showVCheckboxContainer.checkbox.checked =true;

//overwritting the original selectBody function
body.prototype.selectBody = (b)=> {
  body.prototype.selectedBody = b;
  b.originalStroke = b.strokeStyle;
  b.strokeStyle = "cornflowerblue";
  b.lineWidth = 1.2;
  setSlidersToSelectedBody();
  b.isBeingDragged = true;
};

//Giving functions to SLIDERS
function updateVx(){
  const b = body.prototype.selectedBody;
  if (!b){return;};
  b.vx = Number(vxSliderContainer.slider.value);
  updateSliderLabels();
};
vxSliderContainer.slider.oninput = updateVx;

function updateVy(){
  const b = body.prototype.selectedBody;
  if (!b){return;};
  b.vy = Number(vySliderContainer.slider.value);
  updateSliderLabels();
};
vySliderContainer.slider.oninput = updateVy;

function updateM(){
  const b = body.prototype.selectedBody;
  if (!b){return;};
  b.m = Number(mSliderContainer.slider.value);
  updateSliderLabels();
};
mSliderContainer.slider.oninput = updateM;

function updateR(){
  const b = body.prototype.selectedBody;
  if (!b){return;};
  b.r = Number(rSliderContainer.slider.value);
  updateSliderLabels();
};
rSliderContainer.slider.oninput = updateR;

//Now the color sliders
function updateColor(){
  if (!body.prototype.selectedBody){return;};
  const r = redSliderContainer.slider.value;
  const g = greenSliderContainer.slider.value;
  const b = blueSliderContainer.slider.value;
  const color = `rgb(${r}, ${g}, ${b})`;
  body.prototype.selectedBody.fillStyle = color;
  updateSliderLabels();
};

for (let sliderContainer of [redSliderContainer,
                              blueSliderContainer,
                              greenSliderContainer]){
  sliderContainer.slider.oninput = updateColor;
};

//Now the commands functionality
startButton.onclick = function(){
  running = true;
};
pauseButton.onclick = function(){
  running = false;
};

//To make the function responsive to changing the running tag we overwrite body.evolve
body.prototype.evolve = function(){
  const b = body.prototype;
  b.checkAndHandleCollisionAll(); //Must be first!!
  b.wallDetectionAndHandlingAll(); //Ensures nothing moves inside the wall!!! This breaks everything!!!!

  if (running){
    b.moveAll(Number(speedSliderContainer.slider.value));
  };

  b.drawAll();
  if (showVCheckboxContainer.checkbox.checked){
    b.drawVArrowAll();
  };
};


//For the addingMode we must override the original canvasClick funciton.
//This time it will balls if the checkbox is ticked
function addBody(e){
  const point = invertCoordinates(e.offsetX*universe.scale, e.offsetY*universe.scale);
  const b = new body(...point, 0, 0, 10);
};
//Lets attach some mouseEvents to the canvas
function mousePressed(e){
  if (!canvas.isMouseOver){return;};
  let b = body.prototype.selectedBody;
  if (body.prototype.isMouseOver(e)){
    body.prototype.startDragging();
    return;
  };
  body.prototype.unSelectBody();
  if (addCheckboxContainer.checkbox.checked){
    addBody(e);
  };
  canvasPressed(e);
};
canvas.onmousedown = mousePressed;

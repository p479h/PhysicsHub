//Lets get the slider
const zoomSlider = document.getElementById("zoomSlider");
const label = document.getElementById("zoomSliderLabel");
const transLabel = document.getElementById("transSliderLabel");
const transSlider = document.getElementById("transSlider");
zoomSlider.oninput = transSlider.oninput = function(){
  let scale = Number(zoomSlider.value);
  let dx = Number(transSlider.value);
  //Note that ctx comes from the scope of lesson.js
  ctx.setTransform(scale, 0, 0, scale, dx,0);
  universe.updatePoints();
  label.innerHTML = scale;
  transLabel.innerHTML = dx;
};

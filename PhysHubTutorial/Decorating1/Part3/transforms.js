//Lets get the slider
const zoomSlider = document.getElementById("zoomSlider");
const label = document.getElementById("zoomSliderLabel");
zoomSlider.oninput = function(){
  let scale = Number(this.value);
  //Note that ctx comes from the scope of lesson.js
  ctx.setTransform(scale, 0, 0, scale, 0,0);
  label.innerHTML = scale;
};

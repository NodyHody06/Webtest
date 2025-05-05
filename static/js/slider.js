var slider1 = document.getElementById("scaleFactor");
var output1 = document.getElementById("value1");
output1.innerHTML = slider1.value;

slider1.oninput = function() {
  output1.innerHTML = this.value;
}

var slider2 = document.getElementById("oneCharWidth");
var output2 = document.getElementById("value2");
output2.innerHTML = slider2.value;

slider2.oninput = function() {
  output2.innerHTML = this.value;
}

var slider3 = document.getElementById("oneCharHeight");
var output3 = document.getElementById("value3");
output3.innerHTML = slider3.value;

slider3.oninput = function() {
  output3.innerHTML = this.value;
}
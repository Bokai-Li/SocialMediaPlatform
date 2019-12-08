
import addFlag from "./ball.js"
$("#getLocation").click(getLocation)

var x = document.getElementById("demo");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
    
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  x.innerHTML = "Latitude: " + position.coords.latitude.toString().substring(0, 5) + 
  "<br>Longitude: " + position.coords.longitude.toString().substring(0, 5)
  addFlag(position.coords.latitude,position.coords.longitude,0x8E1600)
}

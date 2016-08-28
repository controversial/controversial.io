// Set up ScrollMagic stuff

var ctrl = new ScrollMagic.Controller();

ctrl.scrollTo(function (newpos) {
  TweenLite.to(window, 1, {
    scrollTo: {
      y: newpos
    },
    css: {
      "pointer-events": "none"
    }
  });
});


// Set up ScrollMagic scenes
var scenes = [


  // Fade down button

  new ScrollMagic.Scene({
    duration: "50%",
    offset: 10
  }).setTween(".down-indicator", {
      opacity: 0,
    }).on("enter", function(e) {
      document.getElementsByClassName("down-indicator")[0].style["pointer-events"] = "none";
    }).on("leave", function(e) {
      document.getElementsByClassName("down-indicator")[0].style["pointer-events"] = e.scrollDirection === "REVERSE" ? "inherit": "none";
    })

];

// Add scenes to the controller
for (var i=0; i<scenes.length; i++) {
  scenes[i] = scenes[i].addTo(ctrl);
}


// Bind down indicators to scroll down function
var downIndicators = document.querySelectorAll(".down-indicator > i");
function sectionJump () {
  ctrl.scrollTo(window.scrollY + window.innerWidth);
}
for (var i = 0; i < downIndicators.length; i++) {
  downIndicators[i].onclick = sectionJump;
}

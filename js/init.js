// Set up ScrollMagic stuff

var ctrl = new ScrollMagic.Controller();

ctrl.scrollTo(function (newpos) {
  TweenLite.to(window, 1, {
    scrollTo: {y: newpos}
  });
});


// Set up ScrollMagic scenes
var scenes = [


  // Fade down button

  new ScrollMagic.Scene({
    duration: "50%",
  }).setTween(".down-indicator", {opacity: 0})
];

// Add scenes to the controller
for (var i=0; i<scenes.length; i++) {
  scenes[i] = scenes[i].addTo(ctrl);
}

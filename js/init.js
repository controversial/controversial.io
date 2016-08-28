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
  }).setTween(".down-indicator", {opacity: 0}),


  // Shrink header

  new ScrollMagic.Scene({
    duration: "50%"
  }).setTween("header", {
    css: {
      width: window.innerWidth / 2,
      height: window.innerHeight / 2,
      left: window.innerWidth / 4,
      top: window.innerHeight / 4
    }
  }).setPin("header"),


  // Fade background to white
  new ScrollMagic.Scene({
    duration: "50%"
  }).setTween("body", {
    css: {
      backgroundColor: "#fff"
    }
  })
];

// Add scenes to the controller
for (var i=0; i<scenes.length; i++) {
  scenes[i] = scenes[i].addTo(ctrl);
}

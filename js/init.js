var ctrl = new ScrollMagic.Controller();
var scenes = [
  new ScrollMagic.Scene({
    duration: "50%"
  })
    .setTween("header > .down-indicator", {
      opacity: 0,
    })
    .addTo(ctrl)
];
